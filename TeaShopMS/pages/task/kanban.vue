<template>
	<view class="kanban-container">
		<scroll-view scroll-x class="kanban-scroll">
			<view class="kanban-wrapper">
				<view class="kanban-column" v-for="column in columns" :key="column.status">
					<view class="column-header">
						<text class="column-title">{{ column.label }}</text>
						<text class="column-count">{{ getColumnTaskCount(column.status) }}</text>
					</view>
					<view class="column-body">
						<view 
							class="task-card" 
							v-for="task in getColumnTasks(column.status)" :class="'priority-' + task.priority" 
							:key="task.id"
							:draggable="true"
							@click="goToDetail(task.id)">
							<view class="task-header">
								<text class="task-priority" :class="'priority-' + task.priority">{{ getPriorityText(task.priority) }}</text>
								<text class="task-project">{{ getProjectName(task.projectId) }}</text>
							</view>
							<view class="task-title">{{ task.title }}</view>
							<view class="task-footer">
								<text class="assignee">👤 {{ task.assigneeName }}</text>
								<text class="deadline" :class="{ overdue: isOverdue(task) }">{{ task.deadline }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<view class="add-btn" @click="goToEdit">
			<text class="add-icon">+</text>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'
import { mockProjects } from '@/api/mock.js'

export default {
	data() {
		return {
			tasks: [],
			projects: mockProjects,
			columns: [
				{ label: '待开始', status: 'todo' },
				{ label: '进行中', status: 'in_progress' },
				{ label: '待验收', status: 'review' },
				{ label: '已完成', status: 'done' }
			]
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
		
		getColumnTasks(status) {
			return this.tasks.filter(t => t.status === status)
		},
		
		getColumnTaskCount(status) {
			return this.getColumnTasks(status).length
		},
		
		getProjectName(projectId) {
			const project = this.projects.find(p => p.id === projectId)
			return project ? project.name : ''
		},
		
		getPriorityText(priority) {
			const map = { high: '高', medium: '中', low: '低' }
			return map[priority] || priority
		},
		
		isOverdue(task) {
			if (task.status === 'done') return false
			return new Date(task.deadline) < new Date()
		},
		
		goToDetail(id) {
			uni.navigateTo({
				url: '/pages/task/detail?id=' + id
			})
		},
		
		goToEdit() {
			uni.navigateTo({
				url: '/pages/task/edit'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.kanban-container {
	height: 100vh;
	background: #f5f5f5;
}

.kanban-scroll {
	height: 100%;
	white-space: nowrap;
}

.kanban-wrapper {
	display: inline-flex;
	padding: 20rpx;
	gap: 20rpx;
}

.kanban-column {
	width: 520rpx;
	display: inline-flex;
	flex-direction: column;
	background: #f0f0f0;
	border-radius: 20rpx;
	overflow: hidden;
}

.column-header {
	padding: 24rpx 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #fff;
	border-bottom: 2rpx solid #f0f0f0;
}

.column-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
}

.column-count {
	background: #FF6B6B;
	color: #fff;
	padding: 4rpx 16rpx;
	border-radius: 50rpx;
	font-size: 24rpx;
}

.column-body {
	flex: 1;
	padding: 20rpx;
	overflow-y: auto;
	min-height: 400rpx;
}

.task-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.task-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 12rpx;
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
	margin-bottom: 16rpx;
	line-height: 1.5;
	word-break: break-all;
}

.task-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
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

.add-btn {
	position: fixed;
	bottom: 40rpx;
	right: 40rpx;
	width: 100rpx;
	height: 100rpx;
	background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 24rpx rgba(255, 107, 107, 0.4);
	z-index: 100;
}

.add-icon {
	font-size: 50rpx;
	color: #fff;
	line-height: 1;
}
</style>
