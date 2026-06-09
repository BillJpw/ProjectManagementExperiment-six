<template>
	<view class="tasks-container">
		<view class="header">
			<view class="header-left">
				<text class="back-icon" @click="goBack">‹</text>
				<text class="header-title">我的任务</text>
			</view>
		</view>
		
		<view class="filter-bar">
			<view class="filter-item" 
				v-for="(item, index) in filterList" 
				:key="index"
				:class="{ active: currentFilter === item.value }"
				@click="currentFilter = item.value">
				{{ item.label }}
			</view>
		</view>
		
		<view class="task-list">
			<view class="task-card" v-for="task in filteredTasks" :key="task.id" @click="goToDetail(task.id)">
				<view class="task-header">
					<text class="task-priority" :class="'priority-' + task.priority">{{ getPriorityText(task.priority) }}</text>
					<text class="task-project">{{ getProjectName(task.projectId) }}</text>
				</view>
				<view class="task-title">{{ task.title }}</view>
				<view class="task-footer">
					<text class="assignee">👤 {{ task.assigneeName }}</text>
					<text class="deadline" :class="{ overdue: isOverdue(task) }">截止：{{ task.deadline }}</text>
				</view>
				<view class="task-status" :class="'status-' + task.status">
					{{ getStatusText(task.status) }}
				</view>
			</view>
		</view>
		
		<view class="empty" v-if="filteredTasks.length === 0">
			<text class="empty-icon">📝</text>
			<text class="empty-text">暂无任务</text>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'
import { mapState } from 'vuex'
import { mockProjects } from '@/api/mock.js'

export default {
	data() {
		return {
			currentFilter: 'all',
			filterList: [
				{ label: '全部', value: 'all' },
				{ label: '待开始', value: 'todo' },
				{ label: '进行中', value: 'in_progress' },
				{ label: '待验收', value: 'review' },
				{ label: '已完成', value: 'done' }
			],
			tasks: [],
			projects: mockProjects
		}
	},
	computed: {
		...mapState(['userInfo']),
		filteredTasks() {
			let filtered = this.tasks.filter(task => task.assigneeId === this.userInfo.id)
			if (this.currentFilter !== 'all') {
				filtered = filtered.filter(task => task.status === this.currentFilter)
			}
			return filtered
		}
	},
	onLoad() {
		this.loadTasks()
	},
	onShow() {
		this.loadTasks()
	},
	methods: {
		async loadTasks() {
			try {
				const res = await api.getTasks()
				if (res.success) {
					this.tasks = res.data
				}
			} catch (e) {
				console.error(e)
			}
		},
		
		goBack() {
			uni.navigateBack()
		},
		
		goToDetail(id) {
			uni.navigateTo({
				url: '/pages/task/detail?id=' + id
			})
		},
		
		getProjectName(projectId) {
			const project = this.projects.find(p => p.id === projectId)
			return project ? project.name : ''
		},
		
		getPriorityText(priority) {
			const map = { high: '高', medium: '中', low: '低' }
			return map[priority] || priority
		},
		
		getStatusText(status) {
			const map = { todo: '待开始', in_progress: '进行中', review: '待验收', done: '已完成' }
			return map[status] || status
		},
		
		isOverdue(task) {
			if (task.status === 'done') return false
			return new Date(task.deadline) < new Date()
		}
	}
}
</script>

<style lang="scss" scoped>
.tasks-container {
	min-height: 100vh;
	background: #f5f5f5;
}

.header {
	background: #fff;
	padding: 30rpx;
	border-bottom: 2rpx solid #f0f0f0;
	position: sticky;
	top: 0;
	z-index: 10;
}

.header-left {
	display: flex;
	align-items: center;
}

.back-icon {
	font-size: 40rpx;
	color: #333;
	margin-right: 20rpx;
}

.header-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.filter-bar {
	background: #fff;
	padding: 20rpx 30rpx;
	display: flex;
	gap: 16rpx;
	overflow-x: auto;
	position: sticky;
	top: 100rpx;
	z-index: 5;
}

.filter-item {
	padding: 12rpx 24rpx;
	font-size: 26rpx;
	color: #666;
	background: #f5f5f5;
	border-radius: 50rpx;
	white-space: nowrap;
	transition: all 0.3s;
}

.filter-item.active {
	background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
	color: #fff;
}

.task-list {
	padding: 30rpx;
}

.task-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.task-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.task-priority {
	font-size: 22rpx;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
}

.priority-high {
	background: #FFE5E5;
	color: #FF4757;
}

.priority-medium {
	background: #FFF4E5;
	color: #FF9F43;
}

.priority-low {
	background: #E5F9FF;
	color: #2ED573;
}

.task-project {
	font-size: 22rpx;
	color: #999;
}

.task-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	line-height: 1.5;
}

.task-footer {
	display: flex;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.assignee {
	font-size: 24rpx;
	color: #666;
}

.deadline {
	font-size: 24rpx;
	color: #999;
}

.deadline.overdue {
	color: #FF4757;
}

.task-status {
	font-size: 24rpx;
	padding: 8rpx 20rpx;
	border-radius: 50rpx;
	display: inline-block;
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
	background: #F5F5F5;
	color: #666;
}

.status-done {
	background: #E8F8F5;
	color: #2ED573;
}

.empty {
	text-align: center;
	padding: 120rpx 0;
}

.empty-icon {
	display: block;
	font-size: 100rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}
</style>