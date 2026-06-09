<template>
	<view class="material-container">
		<view class="header">
			<view class="header-title">📦 原料库存</view>
			<view class="header-desc">原料库存管理、自动预警</view>
		</view>
		
		<view class="warning-bar pulse-warning" v-if="warningMaterials.length > 0">
			<view class="warning-icon">⚠️</view>
			<text class="warning-text">{{ warningMaterials.length }} 种原料库存不足，请及时补货</text>
				<text class="warning-arrow">&#8250;</text>
		</view>
		
		<view class="material-list">
			<view class="material-card" v-for="material in materials" :key="material.id" :class="{ warning: material.status === 'warning' }" @click="viewDetail(material)">
				<view class="material-icon">
					{{ getMaterialIcon(material.name) }}
				</view>
				<view class="material-info">
					<view class="material-name">{{ material.name }}</view>
					<view class="material-stock">
						<text class="stock-num">{{ material.stock }}</text>
						<text class="stock-unit">{{ material.unit }}</text>
					</view>
					<view class="material-warning">
						预警值：{{ material.warningValue }} {{ material.unit }}
					</view>
				</view>
				<view class="material-status" :class="'status-' + material.status">
					{{ getStatusText(material.status) }}
				</view>
			</view>
		</view>
		
		<view class="add-btn" @click="showAddDialog">
			<text class="add-icon">+</text>
		</view>
		
		<!-- 新建原料弹窗 -->
		<view class="dialog" v-if="showAdd">
			<view class="dialog-content">
				<view class="dialog-header">
					<text class="dialog-title">添加原料</text>
					<text class="dialog-close" @click="showAdd = false">×</text>
				</view>
				<view class="dialog-body">
					<view class="form-item">
						<text class="form-label">原料名称</text>
						<input class="form-input" v-model="newMaterial.name" placeholder="请输入原料名称" />
					</view>
					<view class="form-item">
						<text class="form-label">当前库存</text>
						<input class="form-input" type="number" v-model.number="newMaterial.stock" placeholder="请输入当前库存" />
					</view>
					<view class="form-item">
						<text class="form-label">库存单位</text>
						<input class="form-input" v-model="newMaterial.unit" placeholder="请输入库存单位" />
					</view>
					<view class="form-item">
						<text class="form-label">预警值</text>
						<input class="form-input" type="number" v-model.number="newMaterial.warningValue" placeholder="请输入预警值" />
					</view>
				</view>
				<view class="dialog-footer">
					<button class="btn-cancel" @click="showAdd = false">取消</button>
					<button class="btn-confirm" @click="addMaterial">确定</button>
				</view>
			</view>
		</view>
		
		<!-- 原料详情弹窗 -->
		<view class="dialog" v-if="showDetailDialog">
			<view class="dialog-content">
				<view class="dialog-header">
					<text class="dialog-title">原料详情</text>
					<text class="dialog-close" @click="showDetailDialog = false">×</text>
				</view>
				<view class="dialog-body">
					<view class="detail-item">
						<text class="detail-label">原料名称</text>
						<text class="detail-value">{{ selectedMaterial.name }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">当前库存</text>
						<text class="detail-value">{{ selectedMaterial.stock }} {{ selectedMaterial.unit }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">预警值</text>
						<text class="detail-value">{{ selectedMaterial.warningValue }} {{ selectedMaterial.unit }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">库存状态</text>
						<text class="detail-value" :class="'status-' + selectedMaterial.status">{{ getStatusText(selectedMaterial.status) }}</text>
					</view>
					<view class="form-item" v-if="showEdit">
						<text class="form-label">调整库存</text>
						<input class="form-input" type="number" v-model.number="editStock" placeholder="请输入新库存" />
					</view>
				</view>
				<view class="dialog-footer">
					<template v-if="showEdit">
						<button class="btn-cancel" @click="showEdit = false">取消</button>
						<button class="btn-confirm" @click="updateStock">确定</button>
					</template>
					<template v-else>
						<button class="btn-cancel" @click="showDetailDialog = false">关闭</button>
						<button class="btn-confirm" @click="showEdit = true">编辑库存</button>
					</template>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mockMaterials } from '@/api/mock.js'

export default {
	data() {
		return {
			materials: [],
			showAdd: false,
			showDetailDialog: false,
			showEdit: false,
			newMaterial: {
				name: '',
				stock: 0,
				unit: '',
				warningValue: 0
			},
			selectedMaterial: {},
			editStock: 0
		}
	},
	computed: {
		warningMaterials() {
			return this.materials.filter(m => m.status === 'warning')
		}
	},
	onLoad() {
		this.materials = mockMaterials
		this.updateMaterialStatus()
	},
	methods: {
		getMaterialIcon(name) {
			if (name.includes('茶')) return '🍵'
			if (name.includes('奶') || name.includes('牛奶')) return '🥛'
			if (name.includes('糖')) return '🍬'
			if (name.includes('珍珠') || name.includes('粉圆')) return '⚪'
			if (name.includes('果')) return '🍎'
			return '📦'
		},
		
		getStatusText(status) {
			const map = { normal: '充足', warning: '预警', urgent: '紧急' }
			return map[status] || status
		},
		
		showAddDialog() {
			this.showAdd = true
		},
		
		viewDetail(material) {
			this.selectedMaterial = material
			this.editStock = material.stock
			this.showEdit = false
			this.showDetailDialog = true
		},
		
		updateMaterialStatus() {
			this.materials.forEach(material => {
				if (material.stock <= 0) {
					material.status = 'urgent'
				} else if (material.stock < material.warningValue) {
					material.status = 'warning'
				} else {
					material.status = 'normal'
				}
			})
		},
		
		addMaterial() {
			if (!this.newMaterial.name || !this.newMaterial.unit) {
				uni.showToast({
					title: '请填写原料名称和单位',
					icon: 'none'
				})
				return
			}
			
			if (this.newMaterial.stock < 0 || this.newMaterial.warningValue < 0) {
				uni.showToast({
					title: '库存和预警值不能为负数',
					icon: 'none'
				})
				return
			}
			
			const newMat = {
				id: Date.now(),
				name: this.newMaterial.name,
				stock: this.newMaterial.stock,
				unit: this.newMaterial.unit,
				warningValue: this.newMaterial.warningValue,
				status: 'normal'
			}
			
			this.materials.push(newMat)
			this.updateMaterialStatus()
			this.showAdd = false
			this.resetForm()
			uni.showToast({
				title: '原料添加成功',
				icon: 'success'
			})
		},
		
		updateStock() {
			if (this.editStock < 0) {
				uni.showToast({
					title: '库存不能为负数',
					icon: 'none'
				})
				return
			}
			
			this.selectedMaterial.stock = this.editStock
			this.updateMaterialStatus()
			this.showEdit = false
			uni.showToast({
				title: '库存更新成功',
				icon: 'success'
			})
		},
		
		resetForm() {
			this.newMaterial = {
				name: '',
				stock: 0,
				unit: '',
				warningValue: 0
			}
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

.form-input {
	width: 100%;
	padding: 20rpx;
	border: 2rpx solid #f0f0f0;
	border-radius: 12rpx;
	font-size: 26rpx;
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
	background: linear-gradient(135deg, #FFC107 0%, #FFD93D 100%);
	color: #333;
}

.detail-item {
	margin-bottom: 24rpx;
}

.detail-label {
	display: block;
	font-size: 24rpx;
	color: #999;
	margin-bottom: 8rpx;
}

.detail-value {
	display: block;
	font-size: 28rpx;
	color: #333;
}

.status-normal {
	color: #2ED573;
}

.status-warning {
	color: #FF9F43;
}

.status-urgent {
	color: #FF4757;
}

.material-card {
	cursor: pointer;
	transition: all 0.3s;
}

.material-card:active {
	transform: scale(0.98);
}
</style>

<style lang="scss" scoped>
.material-container {
	min-height: 100vh;
	background: #f5f5f5;
	padding-bottom: 120rpx;
}

.header {
	background: linear-gradient(135deg, #FFC107 0%, #FFD93D 100%);
	padding: 40rpx 30rpx;
}

.header-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.header-desc {
	font-size: 26rpx;
	color: rgba(0, 0, 0, 0.7);
}

.warning-bar {
	display: flex;
	align-items: center;
	gap: 12rpx;
	background: #FFF4E5;
	margin: 24rpx 30rpx;
	padding: 20rpx;
	border-radius: 16rpx;
}

.warning-icon {
	font-size: 32rpx;
}

.warning-text {
	flex: 1;
	font-size: 26rpx;
	color: #FF4757;
}

.material-list {
	padding: 0 30rpx;
}

.material-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 24rpx;
	display: flex;
	gap: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	transition: all 0.3s;
}

.material-card.warning {
	border: 3rpx solid #FF6B6B;
}

.material-icon {
	width: 100rpx;
	height: 100rpx;
	background: #FFF8E5;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 50rpx;
	flex-shrink: 0;
}

.material-card.warning .material-icon {
	background: #FFE5E5;
}

.material-info {
	flex: 1;
}

.material-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 12rpx;
}

.material-stock {
	margin-bottom: 8rpx;
}

.stock-num {
	font-size: 36rpx;
	font-weight: bold;
	color: #FF6B6B;
}

.stock-unit {
	font-size: 26rpx;
	color: #666;
}

.material-warning {
	font-size: 24rpx;
	color: #999;
}

.material-status {
	font-size: 24rpx;
	padding: 8rpx 16rpx;
	border-radius: 50rpx;
	height: fit-content;
}

.status-normal {
	background: #E8F8F5;
	color: #2ED573;
}

.status-warning {
	background: #FFE5E5;
	color: #FF4757;
}

.add-btn {
	position: fixed;
	bottom: 40rpx;
	right: 40rpx;
	width: 100rpx;
	height: 100rpx;
	background: linear-gradient(135deg, #FFC107 0%, #FFD93D 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 24rpx rgba(255, 193, 7, 0.4);
	z-index: 100;
}

.add-icon {
	font-size: 50rpx;
	color: #333;
	line-height: 1;
}
</style>
