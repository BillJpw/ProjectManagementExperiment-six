<template>
	<view class="projects-container">
		<view class="header">
			<view class="header-left">
				<text class="back-icon" @click="goBack">‹</text>
				<text class="header-title">我的项目</text>
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
		
		<view class="project-list">
			<view class="project-card" v-for="project in filteredProjects" :key="project.id" @click="goToDetail(project.id)">
				<view class="project-header">
					<text class="type-tag" :class="'type-' + project.type">{{ project.typeName }}</text>
					<text class="priority-tag" :class="'priority-' + project.priority">{{ getPriorityText(project.priority) }}</text>
				</view>
				<view class="project-name">{{ project.name }}</view>
				<view class="project-desc" v-if="project.description">{{ project.description }}</view>
				<view class="project-footer">
					<view class="footer-left">
						<text class="manager">👤 {{ project.managerName }}</text>
						<text class="date">{{ project.startTime }} ~ {{ project.endTime }}</text>
					</view>
					<view class="status-badge" :class="'status-' + project.status">{{ getStatusText(project.status) }}</view>
				</view>
				<view class="progress-wrapper">
					<view class="progress-bar">
						<view class="progress-inner" :style="{ width: project.progress + '%' }"></view>
					</view>
					<text class="progress-text">{{ project.progress }}%</text>
				</view>
			</view>
		</view>
		
		<view class="empty" v-if="filteredProjects.length === 0">
			<text class="empty-icon">📁</text>
			<text class="empty-text">暂无项目</text>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'
import { mapState } from 'vuex'

export default {
	data() {
		return {
			currentFilter: 'all',
			filterList: [
				{ label: '全部', value: 'all' },
				{ label: '待开始', value: 'pending' },
				{ label: '进行中', value: 'in_progress' },
				{ label: '已完成', value: 'done' }
			],
			projects: []
		}
	},
	computed: {
		...mapState(['userInfo']),
		filteredProjects() {
			let filtered = this.projects.filter(project => project.managerId === this.userInfo.id)
			if (this.currentFilter !== 'all') {
				filtered = filtered.filter(project => project.status === this.currentFilter)
			}
			return filtered
		}
	},
	onLoad() {
		this.loadProjects()
	},
	onShow() {
		this.loadProjects()
	},
	methods: {
		async loadProjects() {
			try {
				const res = await api.getProjects()
				if (res.success) {
					this.projects = res.data
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
				url: '/pages/project/detail?id=' + id
			})
		},
		
		getPriorityText(priority) {
			const map = { high: '高优先级', medium: '中优先级', low: '低优先级' }
			return map[priority] || priority
		},
		
		getStatusText(status) {
			const map = { pending: '待开始', in_progress: '进行中', done: '已完成' }
			return map[status] || status
		}
	}
}
</script>

<style lang="scss" scoped>
.projects-container {
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

.project-list {
	padding: 30rpx;
}

.project-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.project-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.type-tag {
	font-size: 24rpx;
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
}

.type-product {
	background: #E5F9FF;
	color: #5352ED;
}

.type-activity {
	background: #FFF4E5;
	color: #FF9F43;
}

.type-equipment {
	background: #F5F5F5;
	color: #666;
}

.type-training {
	background: #E8F8F5;
	color: #2ED573;
}

.priority-tag {
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

.project-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 12rpx;
}

.project-desc {
	font-size: 26rpx;
	color: #999;
	margin-bottom: 20rpx;
	line-height: 1.6;
}

.project-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.footer-left {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.manager {
	font-size: 24rpx;
	color: #666;
}

.date {
	font-size: 22rpx;
	color: #999;
}

.status-badge {
	font-size: 24rpx;
	padding: 8rpx 20rpx;
	border-radius: 50rpx;
}

.status-pending {
	background: #FFF4E5;
	color: #FF9F43;
}

.status-in_progress {
	background: #E5F9FF;
	color: #5352ED;
}

.status-done {
	background: #E8F8E8;
	color: #2ED573;
}

.progress-wrapper {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.progress-bar {
	flex: 1;
	height: 8rpx;
	background: #f0f0f0;
	border-radius: 4rpx;
	overflow: hidden;
}

.progress-inner {
	height: 100%;
	background: linear-gradient(90deg, #FF6B6B 0%, #FF8E8E 100%);
	border-radius: 4rpx;
	transition: width 0.3s;
}

.progress-text {
	font-size: 24rpx;
	color: #FF6B6B;
	min-width: 60rpx;
	text-align: right;
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