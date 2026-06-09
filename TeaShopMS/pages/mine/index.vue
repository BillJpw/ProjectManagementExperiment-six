<template>
	<view class="mine-container">
		<view class="user-header">
			<view class="user-avatar">{{ userInfo.name ? userInfo.name.charAt(0) : '?' }}</view>
			<view class="user-info">
				<view class="user-name">{{ userInfo.name || '未登录' }}</view>
				<view class="user-role">{{ getRoleText(userInfo.role) }}</view>
				<view class="user-phone" v-if="userInfo.phone">{{ userInfo.phone }}</view>
			</view>
		</view>
		
		<view class="menu-list">
			<view class="menu-section">
				<view class="menu-item" @click="goToMyTasks">
					<view class="menu-left">
						<text class="menu-icon">📋</text>
						<text class="menu-title">我的任务</text>
					</view>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @click="goToMyProjects">
					<view class="menu-left">
						<text class="menu-icon">📁</text>
						<text class="menu-title">我的项目</text>
					</view>
					<text class="menu-arrow">›</text>
				</view>
			</view>
			
			<view class="menu-section">
				<view class="menu-item" @click="goToSettings">
					<view class="menu-left">
						<text class="menu-icon">⚙️</text>
						<text class="menu-title">设置</text>
					</view>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @click="goToHelp">
					<view class="menu-left">
						<text class="menu-icon">❓</text>
						<text class="menu-title">帮助与反馈</text>
					</view>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @click="goToAbout">
					<view class="menu-left">
						<text class="menu-icon">ℹ️</text>
						<text class="menu-title">关于</text>
					</view>
					<text class="menu-arrow">›</text>
				</view>
			</view>
		</view>
		
		<view class="logout-section">
			<button class="logout-btn" @click="handleLogout">退出登录</button>
		</view>
		
		<view class="version-info">
			<text>茶店项目协作 v1.0.0</text>
		</view>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
	data() {
		return {}
	},
	computed: {
		...mapState(['userInfo'])
	},
	methods: {
		...mapActions(['logout']),
		
		getRoleText(role) {
			const map = {
				manager: '店长',
				staff: '店员',
				developer: '研发'
			}
			return map[role] || '用户'
		},
		
		goToMyTasks() {
			uni.navigateTo({
				url: '/pages/mine/tasks'
			})
		},
		
		goToMyProjects() {
			uni.navigateTo({
				url: '/pages/mine/projects'
			})
		},
		
		goToSettings() {
			uni.navigateTo({
				url: '/pages/mine/settings'
			})
		},
		
		goToHelp() {
			uni.navigateTo({
				url: '/pages/mine/help'
			})
		},
		
		goToAbout() {
			uni.navigateTo({
				url: '/pages/mine/about'
			})
		},
		
		handleLogout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						this.logout()
						uni.reLaunch({
							url: '/pages/login/login'
						})
					}
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.mine-container {
	min-height: 100vh;
	background: #f5f5f5;
}

.user-header {
	background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
	padding: 60rpx 30rpx 80rpx;
	display: flex;
	align-items: center;
}

.user-avatar {
	width: 120rpx;
	height: 120rpx;
	background: rgba(255, 255, 255, 0.3);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 48rpx;
	font-weight: bold;
	margin-right: 24rpx;
	border: 4rpx solid rgba(255, 255, 255, 0.5);
}

.user-info {
	flex: 1;
}

.user-name {
	font-size: 36rpx;
	font-weight: bold;
	color: #fff;
	margin-bottom: 8rpx;
}

.user-role {
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.9);
	margin-bottom: 6rpx;
}

.user-phone {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
}

.menu-list {
	margin-top: -40rpx;
	padding: 0 30rpx;
}

.menu-section {
	background: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 30rpx;
	border-bottom: 2rpx solid #f0f0f0;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-left {
	flex: 1;
	display: flex;
	align-items: center;
}

.menu-icon {
	font-size: 36rpx;
	margin-right: 16rpx;
}

.menu-title {
	font-size: 28rpx;
	color: #333;
}

.menu-arrow {
	font-size: 36rpx;
	color: #ccc;
}

.logout-section {
	padding: 40rpx 30rpx;
}

.logout-btn {
	width: 100%;
	height: 88rpx;
	background: #fff;
	color: #FF4757;
	border: none;
	border-radius: 50rpx;
	font-size: 30rpx;
}

.version-info {
	text-align: center;
	padding: 20rpx 0 40rpx;
}

.version-info text {
	font-size: 24rpx;
	color: #ccc;
}
</style>
