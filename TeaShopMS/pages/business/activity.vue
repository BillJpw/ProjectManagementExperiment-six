<template>
	<view class="activity-container">
		<view class="header">
			<view class="header-title">🎉 活动策划</view>
			<view class="header-desc">节日促销、新品上线活动管理</view>
		</view>
		
		<view class="activity-list">
			<view class="activity-card" v-for="activity in activities" :key="activity.id">
				<view class="activity-banner" :style="{ background: activity.bannerBg }">
					<text class="activity-type">{{ activity.typeName }}</text>
				</view>
				<view class="activity-content">
					<view class="activity-title">{{ activity.name }}</view>
					<view class="activity-date">📅 {{ activity.startDate }} ~ {{ activity.endDate }}</view>
					<view class="activity-desc">{{ activity.description }}</view>
					<view class="activity-meta">
						<text class="meta-item">👤 {{ activity.manager }}</text>
						<text class="meta-item">📊 {{ activity.statusName }}</text>
					</view>
					<view class="activity-actions">
						<button class="action-btn" size="mini" @click="viewDetail(activity)">查看详情</button>
						<button class="action-btn primary" size="mini" v-if="activity.status === 'planning'" @click="startActivity(activity)">启动活动</button>
					</view>
				</view>
			</view>
		</view>
		
		<view class="add-btn" @click="showAddDialog">
			<text class="add-icon">+</text>
		</view>
		
		<!-- 新建活动弹窗 -->
		<view class="dialog" v-if="showAdd">
			<view class="dialog-content">
				<view class="dialog-header">
					<text class="dialog-title">新建活动</text>
					<text class="dialog-close" @click="showAdd = false">×</text>
				</view>
				<view class="dialog-body">
					<view class="form-item">
						<text class="form-label">活动名称</text>
						<input class="form-input" v-model="newActivity.name" placeholder="请输入活动名称" />
					</view>
					<view class="form-item">
						<text class="form-label">活动类型</text>
						<picker class="form-picker" :value="activityTypeIndex" :range="activityTypes" @change="onTypeChange">
							<view class="picker-text">{{ activityTypes[activityTypeIndex] }}</view>
						</picker>
					</view>
					<view class="form-item">
						<text class="form-label">开始日期</text>
						<picker class="form-picker" mode="date" :value="newActivity.startDate" @change="onStartDateChange">
							<view class="picker-text">{{ newActivity.startDate }}</view>
						</picker>
					</view>
					<view class="form-item">
						<text class="form-label">结束日期</text>
						<picker class="form-picker" mode="date" :value="newActivity.endDate" @change="onEndDateChange">
							<view class="picker-text">{{ newActivity.endDate }}</view>
						</picker>
					</view>
					<view class="form-item">
						<text class="form-label">活动描述</text>
						<textarea class="form-textarea" v-model="newActivity.description" placeholder="请输入活动描述" />
					</view>
				</view>
				<view class="dialog-footer">
					<button class="btn-cancel" @click="showAdd = false">取消</button>
					<button class="btn-confirm" @click="addActivity">确定</button>
				</view>
			</view>
		</view>
		
		<!-- 活动详情弹窗 -->
		<view class="dialog" v-if="showDetailDialog">
			<view class="dialog-content">
				<view class="dialog-header">
					<text class="dialog-title">活动详情</text>
					<text class="dialog-close" @click="showDetailDialog = false">×</text>
				</view>
				<view class="dialog-body">
					<view class="detail-item">
						<text class="detail-label">活动名称</text>
						<text class="detail-value">{{ selectedActivity.name }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">活动类型</text>
						<text class="detail-value">{{ selectedActivity.typeName }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">活动时间</text>
						<text class="detail-value">{{ selectedActivity.startDate }} ~ {{ selectedActivity.endDate }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">活动描述</text>
						<text class="detail-value">{{ selectedActivity.description }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">负责人</text>
						<text class="detail-value">{{ selectedActivity.manager }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">活动状态</text>
						<text class="detail-value" :class="'status-' + selectedActivity.status">{{ selectedActivity.statusName }}</text>
					</view>
				</view>
				<view class="dialog-footer">
					<button class="btn-confirm" @click="showDetailDialog = false">关闭</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			activities: [
				{
					id: 1,
					name: '五一劳动节买一送一',
					type: 'promotion',
					typeName: '节日促销',
					bannerBg: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
					startDate: '2026-05-01',
					endDate: '2026-05-05',
					description: '全场奶茶买一送一，第二杯半价活动',
					manager: '张店长',
					status: 'planning',
					statusName: '筹备中'
				},
				{
					id: 2,
					name: '樱花系列新品上市',
					type: 'product',
					typeName: '新品上线',
					bannerBg: 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)',
					startDate: '2026-04-15',
					endDate: '2026-04-30',
					description: '樱花系列新品限时8折优惠',
					manager: '李店员',
					status: 'ongoing',
					statusName: '进行中'
				}
			],
			showAdd: false,
			showDetailDialog: false,
			newActivity: {
				name: '',
				type: 'promotion',
				startDate: new Date().toISOString().split('T')[0],
				endDate: new Date().toISOString().split('T')[0],
				description: ''
			},
			selectedActivity: {},
			activityTypes: ['节日促销', '新品上线'],
			activityTypeIndex: 0
		}
	},
	methods: {
		showAddDialog() {
			this.showAdd = true
		},
		
		viewDetail(activity) {
			this.selectedActivity = activity
			this.showDetailDialog = true
		},
		
		startActivity(activity) {
			uni.showModal({
				title: '启动活动',
				content: '确定要启动此活动吗？',
				confirmText: '确定',
				cancelText: '取消',
				success: (res) => {
					if (res.confirm) {
						activity.status = 'ongoing'
						activity.statusName = '进行中'
						uni.showToast({
							title: '活动已启动',
							icon: 'success'
						})
					}
				}
			})
		},
		
		onTypeChange(e) {
			this.activityTypeIndex = e.detail.value
			this.newActivity.type = e.detail.value === 0 ? 'promotion' : 'product'
		},
		
		onStartDateChange(e) {
			this.newActivity.startDate = e.detail.value
		},
		
		onEndDateChange(e) {
			this.newActivity.endDate = e.detail.value
		},
		
		addActivity() {
			if (!this.newActivity.name || !this.newActivity.description) {
				uni.showToast({
					title: '请填写活动名称和描述',
					icon: 'none'
				})
				return
			}
			
			if (new Date(this.newActivity.startDate) > new Date(this.newActivity.endDate)) {
				uni.showToast({
					title: '开始日期不能晚于结束日期',
					icon: 'none'
				})
				return
			}
			
			const newAct = {
				id: Date.now(),
				name: this.newActivity.name,
				type: this.newActivity.type,
				typeName: this.activityTypes[this.activityTypeIndex],
				bannerBg: this.newActivity.type === 'promotion' ? 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)' : 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)',
				startDate: this.newActivity.startDate,
				endDate: this.newActivity.endDate,
				description: this.newActivity.description,
				manager: '当前用户',
				status: 'planning',
				statusName: '筹备中'
			}
			
			this.activities.push(newAct)
			this.showAdd = false
			this.resetForm()
			uni.showToast({
				title: '活动创建成功',
				icon: 'success'
			})
		},
		
		resetForm() {
			this.newActivity = {
				name: '',
				type: 'promotion',
				startDate: new Date().toISOString().split('T')[0],
				endDate: new Date().toISOString().split('T')[0],
				description: ''
			}
			this.activityTypeIndex = 0
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
	background: linear-gradient(135deg, #FF9F43 0%, #FFC107 100%);
	color: #fff;
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

.status-planning {
	color: #FF9F43;
}

.status-ongoing {
	color: #2ED573;
}

.status-ended {
	color: #999;
}
</style>

<style lang="scss" scoped>
.activity-container {
	min-height: 100vh;
	background: #f5f5f5;
	padding-bottom: 120rpx;
}

.header {
	background: linear-gradient(135deg, #FF9F43 0%, #FFC107 100%);
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

.activity-list {
	padding: 30rpx;
}

.activity-card {
	background: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	margin-bottom: 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.activity-banner {
	height: 160rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.activity-type {
	background: rgba(255, 255, 255, 0.3);
	color: #fff;
	padding: 10rpx 30rpx;
	border-radius: 50rpx;
	font-size: 26rpx;
	font-weight: bold;
}

.activity-content {
	padding: 30rpx;
}

.activity-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 12rpx;
}

.activity-date {
	font-size: 26rpx;
	color: #FF6B6B;
	margin-bottom: 12rpx;
}

.activity-desc {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
	margin-bottom: 20rpx;
}

.activity-meta {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20rpx;
}

.meta-item {
	font-size: 24rpx;
	color: #999;
}

.activity-actions {
	display: flex;
	gap: 16rpx;
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
	background: linear-gradient(135deg, #FF9F43 0%, #FFC107 100%);
	color: #fff;
}

.add-btn {
	position: fixed;
	bottom: 40rpx;
	right: 40rpx;
	width: 100rpx;
	height: 100rpx;
	background: linear-gradient(135deg, #FF9F43 0%, #FFC107 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 24rpx rgba(255, 159, 67, 0.4);
	z-index: 100;
}

.add-icon {
	font-size: 50rpx;
	color: #fff;
	line-height: 1;
}
</style>
