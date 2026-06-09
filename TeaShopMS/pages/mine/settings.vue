<template>
	<view class="settings-container">
		<view class="header">
			<view class="header-left">
				<text class="back-icon" @click="goBack">‹</text>
				<text class="header-title">设置</text>
			</view>
		</view>
		
		<view class="menu-section">
			<view class="section-title">个人信息</view>
			<view class="menu-item" @click="editProfile">
				<view class="menu-left">
					<text class="menu-icon">👤</text>
					<text class="menu-title">个人资料</text>
				</view>
				<view class="menu-right">
					<text class="menu-value">{{ userInfo.name || '未设置' }}</text>
					<text class="menu-arrow">›</text>
				</view>
			</view>
			<view class="menu-item" @click="changePassword">
				<view class="menu-left">
					<text class="menu-icon">🔒</text>
					<text class="menu-title">修改密码</text>
				</view>
				<text class="menu-arrow">›</text>
			</view>
		</view>
		
		<view class="menu-section">
			<view class="section-title">通知设置</view>
			<view class="menu-item">
				<view class="menu-left">
					<text class="menu-icon">🔔</text>
					<text class="menu-title">消息通知</text>
				</view>
				<view class="switch-container">
					<switch :checked="notificationEnabled" @change="toggleNotification" />
				</view>
			</view>
			<view class="menu-item">
				<view class="menu-left">
					<text class="menu-icon">📢</text>
					<text class="menu-title">系统通知</text>
				</view>
				<view class="switch-container">
					<switch :checked="systemNotificationEnabled" @change="toggleSystemNotification" />
				</view>
			</view>
		</view>
		
		<view class="menu-section">
			<view class="section-title">账号安全</view>
			<view class="menu-item" @click="bindPhone">
				<view class="menu-left">
					<text class="menu-icon">📱</text>
					<text class="menu-title">绑定手机号</text>
				</view>
				<view class="menu-right">
					<text class="menu-value">{{ userInfo.phone ? '已绑定' : '未绑定' }}</text>
					<text class="menu-arrow">›</text>
				</view>
			</view>
			<view class="menu-item" @click="clearCache">
				<view class="menu-left">
					<text class="menu-icon">🗑️</text>
					<text class="menu-title">清理缓存</text>
				</view>
				<text class="menu-value">{{ cacheSize }}</text>
			</view>
		</view>
		
		<view class="menu-section">
			<view class="section-title">其他设置</view>
			<view class="menu-item" @click="goToAbout">
				<view class="menu-left">
					<text class="menu-icon">ℹ️</text>
					<text class="menu-title">关于</text>
				</view>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="checkUpdate">
				<view class="menu-left">
					<text class="menu-icon">🔄</text>
					<text class="menu-title">检查更新</text>
				</view>
				<text class="menu-value">v1.0.0</text>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex'

export default {
	data() {
		return {
			notificationEnabled: true,
			systemNotificationEnabled: true,
			cacheSize: '1.2MB'
		}
	},
	computed: {
		...mapState(['userInfo'])
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		
		editProfile() {
			uni.showToast({
				title: '编辑个人资料功能开发中',
				icon: 'none'
			})
		},
		
		changePassword() {
			uni.showToast({
				title: '修改密码功能开发中',
				icon: 'none'
			})
		},
		
		toggleNotification(e) {
			this.notificationEnabled = e.detail.value
			uni.showToast({
				title: this.notificationEnabled ? '消息通知已开启' : '消息通知已关闭',
				icon: 'none'
			})
		},
		
		toggleSystemNotification(e) {
			this.systemNotificationEnabled = e.detail.value
			uni.showToast({
				title: this.systemNotificationEnabled ? '系统通知已开启' : '系统通知已关闭',
				icon: 'none'
			})
		},
		
		bindPhone() {
			if (this.userInfo.phone) {
				uni.showModal({
					title: '提示',
					content: '手机号已绑定，是否重新绑定？',
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								title: '重新绑定功能开发中',
								icon: 'none'
							})
						}
					}
				})
			} else {
				uni.showToast({
					title: '绑定手机号功能开发中',
					icon: 'none'
				})
			}
		},
		
		clearCache() {
			uni.showModal({
				title: '提示',
				content: '确定要清理缓存吗？',
				success: (res) => {
					if (res.confirm) {
						this.cacheSize = '0KB'
						uni.showToast({
							title: '缓存已清理',
							icon: 'success'
						})
					}
				}
			})
		},
		
		goToAbout() {
			uni.navigateTo({
				url: '/pages/mine/about'
			})
		},
		
		checkUpdate() {
			uni.showToast({
				title: '当前已是最新版本',
				icon: 'success'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.settings-container {
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

.menu-section {
	background: #fff;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 24rpx;
	color: #999;
	padding: 20rpx 30rpx 10rpx;
}

.menu-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx;
	border-bottom: 2rpx solid #f0f0f0;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-left {
	display: flex;
	align-items: center;
	flex: 1;
}

.menu-icon {
	font-size: 36rpx;
	margin-right: 16rpx;
}

.menu-title {
	font-size: 28rpx;
	color: #333;
}

.menu-right {
	display: flex;
	align-items: center;
}

.menu-value {
	font-size: 26rpx;
	color: #999;
	margin-right: 12rpx;
}

.menu-arrow {
	font-size: 36rpx;
	color: #ccc;
}

.switch-container {
	display: flex;
	align-items: center;
}

.switch {
	transform: scale(0.8);
}
</style>