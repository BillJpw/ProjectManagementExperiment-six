<template>
	<view class="login-container">
		<view class="login-header">
			<view class="logo">
				<view class="logo-icon">🧋</view>
				<text class="logo-text">茶店项目协作</text>
			</view>
			<view class="slogan">奶茶门店 · 轻松管理 · 高效协作</view>
		</view>
		
		<view class="login-form">
			<view class="form-item">
				<view class="input-wrapper">
					<text class="icon">👤</text>
					<input class="input" v-model="form.username" placeholder="请输入用户名" />
				</view>
			</view>
			<view class="form-item">
				<view class="input-wrapper">
					<text class="icon">🔒</text>
					<input class="input" v-model="form.password" type="password" placeholder="请输入密码" />
				</view>
			</view>
			<button class="login-btn" :loading="loading" @click="handleLogin">登录</button>
		</view>
		
		<view class="tips">
			<text class="tips-text">测试账号：admin/123456（店长）</text>
			<text class="tips-text">staff1/123456（店员）</text>
			<text class="tips-text">developer/123456（研发）</text>
		</view>
	</view>
</template>

<script>
import { mapActions } from 'vuex'
import api from '@/api/index.js'

export default {
	data() {
		return {
			loading: false,
			form: {
				username: '',
				password: ''
			}
		}
	},
	methods: {
		...mapActions(['login']),
		
		async handleLogin() {
			if (!this.form.username || !this.form.password) {
				uni.showToast({
					title: '请输入用户名和密码',
					icon: 'none'
				})
				return
			}
			
			this.loading = true
			try {
				const res = await api.login(this.form.username, this.form.password)
				if (res.success) {
					this.login({ userInfo: res.data })
					uni.showToast({
						title: '登录成功',
						icon: 'success'
					})
					setTimeout(() => {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			}, 500)
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			} catch (e) {
				uni.showToast({
					title: '登录失败',
					icon: 'none'
				})
			} finally {
				this.loading = false
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.login-container {
	min-height: 100vh;
	background: linear-gradient(160deg, #FF6B6B 0%, #FF8E8E 40%, #5352ED 100%);
	padding: 100rpx 60rpx;
}

.login-header {
	text-align: center;
	padding: 80rpx 0;
}

.logo {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
}

.logo-icon {
	font-size: 80rpx;
	margin-right: 20rpx;
}

.logo-text {
	font-size: 44rpx;
	font-weight: bold;
	color: #fff;
}

.slogan {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.9);
}

.login-form {
	background: #fff;
	border-radius: 32rpx;
	padding: 60rpx 40rpx;
}

.form-item {
	margin-bottom: 40rpx;
}

.input-wrapper {
	display: flex;
	align-items: center;
	background: #f5f5f5;
	border-radius: 16rpx;
	padding: 24rpx 30rpx;
}

.icon {
	font-size: 36rpx;
	margin-right: 20rpx;
}

.input {
	flex: 1;
	font-size: 28rpx;
}

.login-btn {
	width: 100%;
	height: 90rpx;
	background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
	color: #fff;
	border: none;
	border-radius: 50rpx;
	font-size: 32rpx;
	font-weight: bold;
	margin-top: 20rpx;
}

.tips {
	margin-top: 60rpx;
	text-align: center;
}

.tips-text {
	display: block;
	color: rgba(255, 255, 255, 0.9);
	font-size: 24rpx;
	margin-bottom: 10rpx;
}
</style>
