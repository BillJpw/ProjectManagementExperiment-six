<template>
	<view class="task-detail-container" v-if="task">
		<view class="header-card">
			<view class="task-header">
				<view class="priority-badge" :class="'priority-' + task.priority">{{ getPriorityText(task.priority) }}</view>
				<view class="status-badge" :class="'status-' + task.status">{{ getStatusText(task.status) }}</view>
			</view>
			<view class="task-title">{{ task.title }}</view>
			<view class="task-meta">
				<text>👤 {{ task.assigneeName }}</text>
				<text>📅 {{ task.deadline }}</text>
			</view>
		</view>
		
		<view class="section">
			<view class="section-title">任务描述</view>
			<view class="section-content">{{ task.content || '暂无描述' }}</view>
		</view>
		
		<view class="section">
			<view class="section-title">更新状态</view>
			<view class="status-grid">
				<view 
					class="status-item" 
					v-for="status in statusList" 
					:key="status.value"
					:class="{ active: task.status === status.value }"
					@click="changeStatus(status.value)">
					<text class="status-icon">{{ status.icon }}</text>
					<text class="status-label">{{ status.label }}</text>
				</view>
			</view>
		</view>
		
		<view class="section">
			<view class="section-header">
				<view class="section-title">评论交流</view>
				<text class="count">{{ comments.length }}</text>
			</view>
			<view class="comment-list">
				<view class="comment-item" v-for="comment in comments" :key="comment.id">
					<view class="comment-avatar">{{ comment.userName.charAt(0) }}</view>
					<view class="comment-content">
						<view class="comment-header">
							<text class="comment-name">{{ comment.userName }}</text>
							<text class="comment-time">{{ comment.time }}</text>
						</view>
						<view class="comment-text">{{ comment.content }}</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="comment-input-section">
			<input class="comment-input" v-model="newComment" placeholder="写下你的评论..." />
			<button class="send-btn" @click="sendComment">发送</button>
		</view>
		
		<view class="action-bar">
			<button class="action-btn edit-btn" @click="goToEdit">编辑任务</button>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'
import { mapState } from 'vuex'

export default {
	data() {
		return {
			taskId: null,
			task: null,
			comments: [],
			newComment: '',
			statusList: [
				{ label: '待开始', value: 'todo', icon: '📋' },
				{ label: '进行中', value: 'in_progress', icon: '🔄' },
				{ label: '待验收', value: 'review', icon: '✅' },
				{ label: '已完成', value: 'done', icon: '🎉' }
			]
		}
	},
	computed: {
		...mapState(['userInfo'])
	},
	onLoad(options) {
		this.taskId = parseInt(options.id)
		this.loadData()
	},
	methods: {
		async loadData() {
			try {
				const [taskRes, commentsRes] = await Promise.all([
					api.getTaskDetail(this.taskId),
					api.getComments(this.taskId)
				])
				if (taskRes.success) {
					this.task = taskRes.data
				}
				if (commentsRes.success) {
					this.comments = commentsRes.data
				}
			} catch (e) {
				console.error(e)
			}
		},
		
		async changeStatus(status) {
			try {
				const res = await api.updateTaskStatus(this.taskId, status)
				if (res.success) {
					this.task.status = status
					uni.showToast({
						title: '状态更新成功',
						icon: 'success'
					})
				}
			} catch (e) {
				console.error(e)
			}
		},
		
		getPriorityText(priority) {
			const map = { high: '高优先级', medium: '中优先级', low: '低优先级' }
			return map[priority] || priority
		},
		
		getStatusText(status) {
			const map = { todo: '待开始', in_progress: '进行中', review: '待验收', done: '已完成' }
			return map[status] || status
		},
		
		async sendComment() {
			if (!this.newComment.trim()) {
				uni.showToast({
					title: '请输入评论内容',
					icon: 'none'
				})
				return
			}
			
			const comment = {
				taskId: this.taskId,
				userId: this.userInfo.id,
				userName: this.userInfo.name,
				content: this.newComment,
				time: this.getCurrentTime()
			}
			
			try {
				const res = await api.addComment(comment)
				if (res.success) {
					this.comments.push(res.data)
					this.newComment = ''
					uni.showToast({
						title: '评论成功',
						icon: 'success'
					})
				}
			} catch (e) {
				console.error(e)
			}
		},
		
		getCurrentTime() {
			const now = new Date()
			const month = String(now.getMonth() + 1).padStart(2, '0')
			const day = String(now.getDate()).padStart(2, '0')
			const hours = String(now.getHours()).padStart(2, '0')
			const minutes = String(now.getMinutes()).padStart(2, '0')
			return `${month}-${day} ${hours}:${minutes}`
		},
		
		goToEdit() {
			uni.navigateTo({
				url: '/pages/task/edit?id=' + this.taskId
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.task-detail-container {
	padding-bottom: 200rpx;
}

.header-card {
	background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
	padding: 40rpx 30rpx;
}

.task-header {
	display: flex;
	gap: 12rpx;
	margin-bottom: 20rpx;
}

.priority-badge {
	font-size: 22rpx;
	padding: 6rpx 14rpx;
	border-radius: 50rpx;
	background: rgba(255, 255, 255, 0.2);
	color: #fff;
}

.status-badge {
	font-size: 22rpx;
	padding: 6rpx 14rpx;
	border-radius: 50rpx;
	background: rgba(255, 255, 255, 0.2);
	color: #fff;
}

.task-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #fff;
	margin-bottom: 20rpx;
	line-height: 1.4;
}

.task-meta {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	color: rgba(255, 255, 255, 0.9);
	font-size: 26rpx;
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

.count {
	font-size: 24rpx;
	color: #FF6B6B;
	background: #FFE5E5;
	padding: 4rpx 14rpx;
	border-radius: 50rpx;
}

.section-content {
	font-size: 28rpx;
	color: #666;
	line-height: 1.8;
}

.status-grid {
	display: flex;
	gap: 16rpx;
}

.status-item {
	flex: 1;
	background: #f5f5f5;
	border-radius: 16rpx;
	padding: 24rpx 16rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	transition: all 0.3s;
}

.status-item.active {
	background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
}

.status-icon {
	font-size: 40rpx;
}

.status-label {
	font-size: 24rpx;
	color: #666;
}

.status-item.active .status-label {
	color: #fff;
}

.comment-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.comment-item {
	display: flex;
	gap: 16rpx;
}

.comment-avatar {
	width: 64rpx;
	height: 64rpx;
	background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 28rpx;
	font-weight: bold;
	flex-shrink: 0;
}

.comment-content {
	flex: 1;
	background: #f5f5f5;
	border-radius: 16rpx;
	padding: 20rpx;
}

.comment-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 8rpx;
}

.comment-name {
	font-size: 26rpx;
	font-weight: bold;
	color: #333;
}

.comment-time {
	font-size: 22rpx;
	color: #999;
}

.comment-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
}

.comment-input-section {
	position: fixed;
	bottom: 100rpx;
	left: 0;
	right: 0;
	background: #fff;
	padding: 20rpx 30rpx;
	display: flex;
	gap: 16rpx;
	box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.comment-input {
	flex: 1;
	height: 72rpx;
	background: #f5f5f5;
	border-radius: 50rpx;
	padding: 0 24rpx;
	font-size: 26rpx;
}

.send-btn {
	width: 140rpx;
	height: 72rpx;
	background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
	color: #fff;
	border: none;
	border-radius: 50rpx;
	font-size: 26rpx;
}

.action-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #fff;
	padding: 20rpx 30rpx;
	display: flex;
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
	background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
	color: #fff;
}
</style>
