<template>
	<view class="equipment-container">
		<view class="header">
			<view class="header-title">⚙️ 设备维护</view>
			<view class="header-desc">制冰机、封口机、冰柜等设备管理</view>
		</view>
		
		<view class="stats-bar">
			<view class="stat-item">
				<view class="stat-value">{{ stats.total }}</view>
				<view class="stat-label">设备总数</view>
			</view>
			<view class="stat-item">
				<view class="stat-value text-success">{{ stats.normal }}</view>
				<view class="stat-label">正常运行</view>
			</view>
			<view class="stat-item">
				<view class="stat-value text-warning">{{ stats.maintaining }}</view>
				<view class="stat-label">维护中</view>
			</view>
		</view>
		
		<view class="equipment-list">
			<view class="equipment-card" v-for="equip in equipments" :key="equip.id" @click="viewDetail(equip)">
				<view class="equipment-icon" :class="'icon-' + equip.status">
					{{ equip.icon }}
				</view>
				<view class="equipment-info">
					<view class="equipment-name">{{ equip.name }}</view>
					<view class="equipment-location">📍 {{ equip.location }}</view>
					<view class="equipment-date">购买日期：{{ equip.purchaseDate }}</view>
					<view class="next-maintenance" :class="{ warning: isMaintenanceSoon(equip) }">
						下次维护：{{ equip.nextMaintenance }}
					</view>
				</view>
				<view class="equipment-status" :class="'status-' + equip.status">
					{{ getStatusText(equip.status) }}
				</view>
			</view>
		</view>
		
		<view class="add-btn" @click="showAddDialog">
			<text class="add-icon">+</text>
		</view>
		
		<!-- 新建/编辑设备弹窗 -->
		<view class="dialog" v-if="showDialog">
			<view class="dialog-content">
				<view class="dialog-header">
					<text class="dialog-title">{{ isEditing ? '编辑设备' : '添加设备' }}</text>
					<text class="dialog-close" @click="showDialog = false">×</text>
				</view>
				<view class="dialog-body">
					<view class="form-item">
						<text class="form-label">设备名称</text>
						<input class="form-input" v-model="form.name" placeholder="请输入设备名称" />
					</view>
					<view class="form-item">
						<text class="form-label">设备位置</text>
						<input class="form-input" v-model="form.location" placeholder="请输入设备位置" />
					</view>
					<view class="form-item">
						<text class="form-label">购买日期</text>
						<picker class="form-picker" mode="date" :value="form.purchaseDate" @change="onPurchaseDateChange">
							<view class="picker-text">{{ form.purchaseDate }}</view>
						</picker>
					</view>
					<view class="form-item">
						<text class="form-label">下次维护日期</text>
						<picker class="form-picker" mode="date" :value="form.nextMaintenance" @change="onNextMaintenanceChange">
							<view class="picker-text">{{ form.nextMaintenance }}</view>
						</picker>
					</view>
					<view class="form-item" v-if="isEditing">
						<text class="form-label">设备状态</text>
						<picker class="form-picker" :value="statusIndex" :range="statusList" @change="onStatusChange">
							<view class="picker-text">{{ statusList[statusIndex] }}</view>
						</picker>
					</view>
				</view>
				<view class="dialog-footer">
					<button class="btn-cancel" @click="showDialog = false">取消</button>
					<button class="btn-confirm" @click="saveEquipment">确定</button>
				</view>
			</view>
		</view>
		
		<!-- 设备详情弹窗 -->
		<view class="dialog" v-if="showDetailDialog">
			<view class="dialog-content">
				<view class="dialog-header">
					<text class="dialog-title">设备详情</text>
					<text class="dialog-close" @click="showDetailDialog = false">×</text>
				</view>
				<view class="dialog-body">
					<view class="detail-item">
						<text class="detail-label">设备名称</text>
						<text class="detail-value">{{ selectedEquipment.name }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">设备位置</text>
						<text class="detail-value">{{ selectedEquipment.location }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">购买日期</text>
						<text class="detail-value">{{ selectedEquipment.purchaseDate }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">下次维护</text>
						<text class="detail-value" :class="{ warning: isMaintenanceSoon(selectedEquipment) }">
							{{ selectedEquipment.nextMaintenance }}
						</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">设备状态</text>
						<text class="detail-value" :class="'status-' + selectedEquipment.status">
							{{ getStatusText(selectedEquipment.status) }}
						</text>
					</view>
				</view>
				<view class="dialog-footer">
					<button class="btn-cancel" @click="showDetailDialog = false">关闭</button>
					<button class="btn-confirm" @click="editEquipment(selectedEquipment)">编辑</button>
					<button class="btn-primary" @click="toggleMaintenance(selectedEquipment)">
						{{ selectedEquipment.status === 'maintaining' ? '结束维护' : '开始维护' }}
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mockEquipments } from '@/api/mock.js'

export default {
	data() {
		return {
			equipments: [],
			stats: {
				total: 0,
				normal: 0,
				maintaining: 0
			},
			showDialog: false,
			showDetailDialog: false,
			isEditing: false,
			form: {
				name: '',
				location: '',
				purchaseDate: new Date().toISOString().split('T')[0],
				nextMaintenance: new Date().toISOString().split('T')[0]
			},
			selectedEquipment: {},
			statusList: ['正常', '维护中', '故障'],
			statusIndex: 0
		}
	},
	onLoad() {
		this.equipments = mockEquipments.map(e => ({
			...e,
			icon: this.getEquipmentIcon(e.name)
		}))
		this.calculateStats()
	},
	methods: {
		getEquipmentIcon(name) {
			if (name.includes('制冰')) return '🧊'
			if (name.includes('封口')) return '📦'
			if (name.includes('冰柜') || name.includes('冷藏')) return '❄️'
			return '🔧'
		},
		
		calculateStats() {
			this.stats.total = this.equipments.length
			this.stats.normal = this.equipments.filter(e => e.status === 'normal').length
			this.stats.maintaining = this.equipments.filter(e => e.status === 'maintaining').length
		},
		
		getStatusText(status) {
			const map = {
				normal: '正常',
				maintaining: '维护中',
				fault: '故障'
			}
			return map[status] || status
		},
		
		isMaintenanceSoon(equip) {
			const nextDate = new Date(equip.nextMaintenance)
			const now = new Date()
			const diffDays = Math.ceil((nextDate - now) / (1000 * 60 * 60 * 24))
			return diffDays <= 7
		},
		
		showAddDialog() {
			this.isEditing = false
			this.resetForm()
			this.showDialog = true
		},
		
		viewDetail(equipment) {
			this.selectedEquipment = equipment
			this.showDetailDialog = true
		},
		
		editEquipment(equipment) {
			this.isEditing = true
			this.selectedEquipment = equipment
			this.form = {
				name: equipment.name,
				location: equipment.location,
				purchaseDate: equipment.purchaseDate,
				nextMaintenance: equipment.nextMaintenance
			}
			const statusMap = { '正常': 0, '维护中': 1, '故障': 2 }
			this.statusIndex = statusMap[this.getStatusText(equipment.status)] || 0
			this.showDialog = true
			this.showDetailDialog = false
		},
		
		onPurchaseDateChange(e) {
			this.form.purchaseDate = e.detail.value
		},
		
		onNextMaintenanceChange(e) {
			this.form.nextMaintenance = e.detail.value
		},
		
		onStatusChange(e) {
			this.statusIndex = e.detail.value
		},
		
		saveEquipment() {
			if (!this.form.name || !this.form.location) {
				uni.showToast({
					title: '请填写设备名称和位置',
					icon: 'none'
				})
				return
			}
			
			if (this.isEditing) {
				// 编辑现有设备
				this.selectedEquipment.name = this.form.name
				this.selectedEquipment.location = this.form.location
				this.selectedEquipment.purchaseDate = this.form.purchaseDate
				this.selectedEquipment.nextMaintenance = this.form.nextMaintenance
				const statusMap = { 0: 'normal', 1: 'maintaining', 2: 'fault' }
				this.selectedEquipment.status = statusMap[this.statusIndex]
				this.selectedEquipment.icon = this.getEquipmentIcon(this.form.name)
				uni.showToast({
					title: '设备编辑成功',
					icon: 'success'
				})
			} else {
				// 新建设备
				const newEquipment = {
					id: Date.now(),
					name: this.form.name,
					location: this.form.location,
					purchaseDate: this.form.purchaseDate,
					nextMaintenance: this.form.nextMaintenance,
					status: 'normal',
					icon: this.getEquipmentIcon(this.form.name)
				}
				this.equipments.push(newEquipment)
				uni.showToast({
					title: '设备添加成功',
					icon: 'success'
				})
			}
			
			this.calculateStats()
			this.showDialog = false
			this.resetForm()
		},
		
		toggleMaintenance(equipment) {
			if (equipment.status === 'maintaining') {
				uni.showModal({
					title: '结束维护',
					content: '确定要结束此设备的维护吗？',
					confirmText: '确定',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							equipment.status = 'normal'
							// 更新下次维护日期为30天后
							const nextDate = new Date()
							nextDate.setDate(nextDate.getDate() + 30)
							equipment.nextMaintenance = nextDate.toISOString().split('T')[0]
							this.calculateStats()
							uni.showToast({
								title: '维护已结束',
								icon: 'success'
							})
						}
					}
				})
			} else {
				uni.showModal({
					title: '开始维护',
					content: '确定要开始此设备的维护吗？',
					confirmText: '确定',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							equipment.status = 'maintaining'
							this.calculateStats()
							uni.showToast({
								title: '维护已开始',
								icon: 'success'
							})
						}
					}
				})
			}
		},
		
		resetForm() {
			this.form = {
				name: '',
				location: '',
				purchaseDate: new Date().toISOString().split('T')[0],
				nextMaintenance: new Date().toISOString().split('T')[0]
			}
			this.selectedEquipment = {}
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
.form-picker {
	width: 100%;
	padding: 20rpx;
	border: 2rpx solid #f0f0f0;
	border-radius: 12rpx;
	font-size: 26rpx;
}

.picker-text {
	color: #666;
}

.dialog-footer {
	display: flex;
	padding: 30rpx;
	gap: 12rpx;
	border-top: 2rpx solid #f0f0f0;
}

.btn-cancel,
.btn-confirm,
.btn-primary {
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
	background: linear-gradient(135deg, #5352ED 0%, #7B68EE 100%);
	color: #fff;
}

.btn-primary {
	background: linear-gradient(135deg, #FF9F43 0%, #FFC107 100%);
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

.detail-value.warning {
	color: #FF4757;
	font-weight: bold;
}

.equipment-card {
	cursor: pointer;
	transition: all 0.3s;
}

.equipment-card:active {
	transform: scale(0.98);
}
</style>

<style lang="scss" scoped>
.equipment-container {
	min-height: 100vh;
	background: #f5f5f5;
	padding-bottom: 120rpx;
}

.header {
	background: linear-gradient(135deg, #5352ED 0%, #7B68EE 100%);
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

.stats-bar {
	display: flex;
	background: #fff;
	margin: -30rpx 30rpx 24rpx;
	border-radius: 20rpx;
	padding: 30rpx 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.stat-item {
	flex: 1;
	text-align: center;
}

.stat-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
}

.stat-value.text-success {
	color: #2ED573;
}

.stat-value.text-warning {
	color: #FF9F43;
}

.stat-label {
	font-size: 24rpx;
	color: #999;
}

.equipment-list {
	padding: 0 30rpx;
}

.equipment-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 24rpx;
	display: flex;
	gap: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.equipment-icon {
	width: 100rpx;
	height: 100rpx;
	background: #E5F9FF;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 50rpx;
	flex-shrink: 0;
}

.equipment-icon.icon-maintaining {
	background: #FFF4E5;
}

.equipment-icon.icon-fault {
	background: #FFE5E5;
}

.equipment-info {
	flex: 1;
}

.equipment-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
}

.equipment-location,
.equipment-date {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 6rpx;
}

.next-maintenance {
	font-size: 24rpx;
	color: #666;
}

.next-maintenance.warning {
	color: #FF4757;
	font-weight: bold;
}

.equipment-status {
	font-size: 24rpx;
	padding: 8rpx 16rpx;
	border-radius: 50rpx;
	height: fit-content;
}

.status-normal {
	background: #E8F8F5;
	color: #2ED573;
}

.status-maintaining {
	background: #FFF4E5;
	color: #FF9F43;
}

.status-fault {
	background: #FFE5E5;
	color: #FF4757;
}

.add-btn {
	position: fixed;
	bottom: 40rpx;
	right: 40rpx;
	width: 100rpx;
	height: 100rpx;
	background: linear-gradient(135deg, #5352ED 0%, #7B68EE 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 24rpx rgba(83, 82, 237, 0.4);
	z-index: 100;
}

.add-icon {
	font-size: 50rpx;
	color: #fff;
	line-height: 1;
}
</style>
