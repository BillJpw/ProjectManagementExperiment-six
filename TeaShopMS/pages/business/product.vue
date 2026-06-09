<template>
	<view class="product-container">
		<view class="header">
			<view class="header-title">🍵 新品研发</view>
			<view class="header-desc">记录新品配方、测试记录、上线状态</view>
		</view>
		
		<view class="product-list">
			<view class="product-card" v-for="product in products" :key="product.id">
				<view class="product-header">
					<text class="product-name">{{ product.name }}</text>
					<text class="product-status" :class="'status-' + product.status">{{ getStatusText(product.status) }}</text>
				</view>
				<view class="product-formula">
					<text class="label">配方：</text>
					<text class="formula">{{ product.formula }}</text>
				</view>
				<view class="product-materials">
					<text class="label">所需原料：</text>
					<view class="materials">
						<text class="material-tag" v-for="(mat, idx) in product.materials" :key="idx">{{ mat }}</text>
					</view>
				</view>
				<view class="test-records">
					<text class="label">测试记录：</text>
					<view class="records">
						<text class="record-item" v-for="(record, idx) in product.testRecords" :key="idx">• {{ record }}</text>
					</view>
				</view>
				<view class="product-actions">
					<button class="action-btn" size="mini" @click="editProduct(product)">编辑</button>
					<button class="action-btn primary" size="mini" v-if="product.status !== 'launched'" @click="applyLaunch(product)">申请上线</button>
				</view>
			</view>
		</view>
		
		<view class="empty" v-if="products.length === 0">
			<text class="empty-icon">🍵</text>
			<text class="empty-text">暂无新品记录</text>
		</view>
		
		<view class="add-btn" @click="showAddDialog">
			<text class="add-icon">+</text>
		</view>
		
		<!-- 新建/编辑新品弹窗 -->
		<view class="dialog" v-if="showDialog">
			<view class="dialog-content">
				<view class="dialog-header">
					<text class="dialog-title">{{ isEditing ? '编辑新品' : '新建新品' }}</text>
					<text class="dialog-close" @click="showDialog = false">×</text>
				</view>
				<view class="dialog-body">
					<view class="form-item">
						<text class="form-label">新品名称</text>
						<input class="form-input" v-model="form.name" placeholder="请输入新品名称" />
					</view>
					<view class="form-item">
						<text class="form-label">配方</text>
						<textarea class="form-textarea" v-model="form.formula" placeholder="请输入配方" />
					</view>
					<view class="form-item">
						<text class="form-label">所需原料</text>
						<input class="form-input" v-model="form.materialsInput" placeholder="请输入原料，用逗号分隔" />
					</view>
					<view class="form-item">
						<text class="form-label">测试记录</text>
						<textarea class="form-textarea" v-model="form.testRecordsInput" placeholder="请输入测试记录，用换行分隔" />
					</view>
					<view class="form-item" v-if="isEditing">
						<text class="form-label">状态</text>
						<picker class="form-picker" :value="statusIndex" :range="statusList" @change="onStatusChange">
							<view class="picker-text">{{ statusList[statusIndex] }}</view>
						</picker>
					</view>
				</view>
				<view class="dialog-footer">
					<button class="btn-cancel" @click="showDialog = false">取消</button>
					<button class="btn-confirm" @click="saveProduct">确定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mockProducts } from '@/api/mock.js'

export default {
	data() {
		return {
			products: [],
			showDialog: false,
			isEditing: false,
			form: {
				name: '',
				formula: '',
				materialsInput: '',
				testRecordsInput: ''
			},
			currentProduct: null,
			statusList: ['构思中', '测试中', '已批准', '已上线'],
			statusIndex: 0
		}
	},
	onLoad() {
		this.products = mockProducts
	},
	methods: {
		getStatusText(status) {
			const map = {
				concept: '构思中',
				testing: '测试中',
				approved: '已批准',
				launched: '已上线'
			}
			return map[status] || status
		},
		
		showAddDialog() {
			this.isEditing = false
			this.resetForm()
			this.showDialog = true
		},
		
		editProduct(product) {
			this.isEditing = true
			this.currentProduct = product
			this.form = {
				name: product.name,
				formula: product.formula,
				materialsInput: product.materials.join(','),
				testRecordsInput: product.testRecords.join('\n')
			}
			const statusMap = { '构思中': 0, '测试中': 1, '已批准': 2, '已上线': 3 }
			this.statusIndex = statusMap[this.getStatusText(product.status)] || 0
			this.showDialog = true
		},
		
		onStatusChange(e) {
			this.statusIndex = e.detail.value
		},
		
		saveProduct() {
			if (!this.form.name || !this.form.formula) {
				uni.showToast({
					title: '请填写新品名称和配方',
					icon: 'none'
				})
				return
			}
			
			const materials = this.form.materialsInput.split(',').filter(item => item.trim())
			const testRecords = this.form.testRecordsInput.split('\n').filter(item => item.trim())
			
			if (this.isEditing) {
				// 编辑现有产品
				this.currentProduct.name = this.form.name
				this.currentProduct.formula = this.form.formula
				this.currentProduct.materials = materials
				this.currentProduct.testRecords = testRecords
				const statusMap = { 0: 'concept', 1: 'testing', 2: 'approved', 3: 'launched' }
				this.currentProduct.status = statusMap[this.statusIndex]
				uni.showToast({
					title: '产品编辑成功',
					icon: 'success'
				})
			} else {
				// 新建产品
				const newProduct = {
					id: Date.now(),
					name: this.form.name,
					formula: this.form.formula,
					materials: materials,
					testRecords: testRecords,
					status: 'concept'
				}
				this.products.push(newProduct)
				uni.showToast({
					title: '产品创建成功',
					icon: 'success'
				})
			}
			
			this.showDialog = false
			this.resetForm()
		},
		
		applyLaunch(product) {
			uni.showModal({
				title: '申请上线',
				content: '确定要申请此产品上线吗？',
				confirmText: '确定',
				cancelText: '取消',
				success: (res) => {
					if (res.confirm) {
						product.status = 'approved'
						uni.showToast({
							title: '申请成功',
							icon: 'success'
						})
					}
				}
			})
		},
		
		resetForm() {
			this.form = {
				name: '',
				formula: '',
				materialsInput: '',
				testRecordsInput: ''
			}
			this.currentProduct = null
			this.statusIndex = 0
		}
	}
}
</script>

<style lang="scss" scoped>
.dialog {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.dialog-content {
	background: #fff;
	border-radius: 20rpx;
	width: 80%;
	max-width: 600rpx;
	max-height: 80vh;
	overflow-y: auto;
}

.dialog-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 2rpx solid #f0f0f0;
}

.dialog-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.dialog-close {
	font-size: 40rpx;
	color: #999;
	line-height: 1;
}

.dialog-body {
	padding: 30rpx;
}

.form-item {
	margin-bottom: 24rpx;
}

.form-label {
	display: block;
	font-size: 26rpx;
	color: #333;
	margin-bottom: 12rpx;
}

.form-input,
.form-picker,
.form-textarea {
	width: 100%;
	padding: 20rpx;
	border: 2rpx solid #f0f0f0;
	border-radius: 12rpx;
	font-size: 26rpx;
}

.form-textarea {
	height: 160rpx;
	resize: none;
}

.picker-text {
	color: #666;
}

.dialog-footer {
	display: flex;
	padding: 30rpx;
	gap: 20rpx;
	border-top: 2rpx solid #f0f0f0;
}

.btn-cancel,
.btn-confirm {
	flex: 1;
	height: 80rpx;
	border: none;
	border-radius: 50rpx;
	font-size: 28rpx;
}

.btn-cancel {
	background: #f5f5f5;
	color: #666;
}

.btn-confirm {
	background: linear-gradient(135deg, #2ED573 0%, #5FD068 100%);
	color: #fff;
}
</style>

<style lang="scss" scoped>
.product-container {
	min-height: 100vh;
	background: #f5f5f5;
	padding-bottom: 120rpx;
}

.header {
	background: linear-gradient(135deg, #2ED573 0%, #5FD068 100%);
	padding: 40rpx 30rpx;
}

.header-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #fff;
	margin-bottom: 10rpx;
}

.header-desc {
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.9);
}

.product-list {
	padding: 30rpx;
}

.product-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.product-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.product-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.product-status {
	font-size: 24rpx;
	padding: 6rpx 16rpx;
	border-radius: 50rpx;
}

.status-concept {
	background: #f0f0f0;
	color: #666;
}

.status-testing {
	background: #FFF4E5;
	color: #FF9F43;
}

.status-approved {
	background: #E5F9FF;
	color: #5352ED;
}

.status-launched {
	background: #E8F8F5;
	color: #2ED573;
}

.product-formula,
.product-materials,
.test-records {
	margin-bottom: 20rpx;
}

.label {
	font-size: 26rpx;
	color: #999;
	display: block;
	margin-bottom: 8rpx;
}

.formula {
	font-size: 28rpx;
	color: #333;
	background: #f9f9f9;
	padding: 12rpx 16rpx;
	border-radius: 12rpx;
	display: block;
}

.materials {
	display: flex;
	flex-wrap: wrap;
	gap: 10rpx;
}

.material-tag {
	font-size: 24rpx;
	background: #E5F9FF;
	color: #5352ED;
	padding: 6rpx 16rpx;
	border-radius: 50rpx;
}

.records {
	background: #f9f9f9;
	border-radius: 12rpx;
	padding: 16rpx;
}

.record-item {
	display: block;
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
	margin-bottom: 8rpx;
}

.record-item:last-child {
	margin-bottom: 0;
}

.product-actions {
	display: flex;
	gap: 16rpx;
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 2rpx solid #f0f0f0;
}

.action-btn {
	flex: 1;
	height: 64rpx;
	line-height: 64rpx;
	background: #f5f5f5;
	color: #666;
	border: none;
	border-radius: 50rpx;
	font-size: 26rpx;
}

.action-btn.primary {
	background: linear-gradient(135deg, #2ED573 0%, #5FD068 100%);
	color: #fff;
}

.empty {
	text-align: center;
	padding: 160rpx 0;
}

.empty-icon {
	display: block;
	font-size: 120rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}

.add-btn {
	position: fixed;
	bottom: 40rpx;
	right: 40rpx;
	width: 100rpx;
	height: 100rpx;
	background: linear-gradient(135deg, #2ED573 0%, #5FD068 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 24rpx rgba(46, 213, 115, 0.4);
	z-index: 100;
}

.add-icon {
	font-size: 50rpx;
	color: #fff;
	line-height: 1;
}
</style>
