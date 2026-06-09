<template>
	<view class="project-detail-container" v-if="project">
		<view class="header-card">
			<view class="project-type" :class="'type-' + project.type">{{ project.typeName }}</view>
			<view class="project-title">{{ project.name }}</view>
			<view class="project-meta">
				<text>👤 {{ project.managerName }}</text>
				<text>📅 {{ project.startTime }} ~ {{ project.endTime }}</text>
			</view>
			<view class="progress-section">
				<view class="progress-info">
					<text>项目进度</text>
					<text class="progress-value">{{ project.progress }}%</text>
				</view>
				<view class="progress-bar">
					<view class="progress-inner" :style="{ width: project.progress + '%' }"></view>
				</view>
			</view>
		</view>
		
		<view class="section">
			<view class="section-title">项目描述</view>
			<view class="section-content">{{ project.description || '暂无描述' }}</view>
		</view>
		
		<view class="section">
			<view class="section-header">
				<view class="section-title">相关任务</view>
				<text class="add-text" @click="goToAddTask">+ 新建任务</text>
			</view>
			<view class="task-list">
				<view class="task-item" v-for="task in projectTasks" :key="task.id" @click="goToTaskDetail(task.id)">
					<view class="task-title">{{ task.title }}</view>
					<view class="task-info">
						<text>负责人：{{ task.assigneeName }}</text>
						<text class="deadline">截止：{{ task.deadline }}</text>
					</view>
					<view class="task-status" :class="'status-' + task.status">{{ getTaskStatusText(task.status) }}</view>
				</view>
			</view>
		</view>
		
		<view class="action-bar">
			<button class="action-btn edit-btn" @click="goToEdit">编辑项目</button>
			<button class="action-btn primary-btn" @click="updateStatus">更新状态</button>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'

export default {
	data() {
		return {
			projectId: null,
			project: null,
			projectTasks: []
		}
	},
	onLoad(options) {
		this.projectId = parseInt(options.id)
		this.loadData()
	},
	methods: {
		async loadData() {
			try {
				const [projectRes, tasksRes] = await Promise.all([
					api.getProjectDetail(this.projectId),
					api.getTasks(this.projectId)
				])
				if (projectRes.success) {
					this.project = projectRes.data
				}
				if (tasksRes.success) {
					this.projectTasks = tasksRes.data
				}
			} catch (e) {
				console.error(e)
			}
		},
		
		goToTaskDetail(id) {
			uni.navigateTo({
				url: '/pages/task/detail?id=' + id
			})
		},
		
		goToAddTask() {
			uni.navigateTo({
				url: '/pages/task/edit?projectId=' + this.projectId
			})
		},
		
		goToEdit() {
			uni.navigateTo({
				url: '/pages/project/edit?id=' + this.projectId
			})
		},
		
		getTaskStatusText(status) {
			const map = { todo: '待开始', in_progress: '进行中', review: '待验收', done: '已完成' }
			return map[status] || status
		},
		
		async updateStatus() {
			const statusList = ['pending', 'in_progress', 'done']
			uni.showActionSheet({
				itemList: ['待开始', '进行中', '已完成'],
				success: (res) => {
					this.project.status = statusList[res.tapIndex]
					uni.showToast({
						title: '状态更新成功',
						icon: 'success'
					})
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.project-detail-container {
	padding-bottom: 120rpx;
}

.header-card {
	background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
	padding: 40rpx 30rpx;
}

.project-type {
	display: inline-block;
	background: rgba(255, 255, 255, 0.2);
	color: #fff;
	padding: 8rpx 20rpx;
	border-radius: 50rpx;
	font-size: 24rpx;
	margin-bottom: 20rpx;
}

.project-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #fff;
	margin-bottom: 20rpx;
}

.project-meta {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	color: rgba(255, 255, 255, 0.9);
	font-size: 26rpx;
	margin-bottom: 30rpx;
}

.progress-section {
	background: rgba(255, 255, 255, 0.15);
	border-radius: 16rpx;
	padding: 24rpx;
}

.progress-info {
	display: flex;
	justify-content: space-between;
	margin-bottom: 16rpx;
	color: #fff;
	font-size: 26rpx;
}

.progress-value {
	font-weight: bold;
	font-size: 32rpx;
}

.progress-bar {
	height: 10rpx;
	background: rgba(255, 255, 255, 0.3);
	border-radius: 5rpx;
	overflow: hidden;
}

.progress-inner {
	height: 100%;
	background: #fff;
	border-radius: 5rpx;
	transition: width 0.3s;
}

.section {
	background: #fff;
	margin: 24rpx 30rpx;
	border-radius: 20rpx;
	padding: 30rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
}

.add-text {
	font-size: 26rpx;
	color: #FF6B6B;
}

.section-content {
	font-size: 28rpx;
	color: #666;
	line-height: 1.8;
}

.task-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.task-item {
	background: #f9f9f9;
	border-radius: 16rpx;
	padding: 24rpx;
	position: relative;
}

.task-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 12rpx;
}

.task-info {
	display: flex;
	flex-direction: column;
	gap: 6rpx;
	font-size: 24rpx;
	color: #999;
}

.deadline {
	color: #FF6B6B;
}

.task-status {
	position: absolute;
	right: 24rpx;
	top: 24rpx;
	font-size: 22rpx;
	padding: 6rpx 14rpx;
	border-radius: 8rpx;
}

.status-todo {
	background: #FFF4E5;
	color: #FF9F43;
}

.status-in_progress {
	background: #E5F9FF;
	color: #5352ED;
}

.status-review {
	background: #FFF8E5;
	color: #FFC107;
}

.status-done {
	background: #E8F8F5;
	color: #2ED573;
}

.action-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #fff;
	padding: 20rpx 30rpx;
	display: flex;
	gap: 20rpx;
	box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.action-btn {
	flex: 1;
	height: 88rpx;
	border-radius: 50rpx;
	font-size: 30rpx;
	border: none;
}

.edit-btn {
	background: #f5f5f5;
	color: #333;
}

.primary-btn {
	background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
	color: #fff;
}
</style>
