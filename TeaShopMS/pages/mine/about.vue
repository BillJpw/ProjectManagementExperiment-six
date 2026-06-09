<template>
	<view class="about-container">
		<view class="header">
			<view class="header-left">
				<text class="back-icon" @click="goBack">‹</text>
				<text class="header-title">关于</text>
			</view>
		</view>
		
		<view class="app-info">
			<view class="app-logo">🍵</view>
			<view class="app-name">茶店项目协作</view>
			<view class="app-version">v1.0.0</view>
		</view>
		
		<view class="section">
			<view class="section-title">应用介绍</view>
			<view class="section-content">
				<text class="content-text">茶店项目协作是专为奶茶店设计的项目管理工具，帮助门店管理者和员工更高效地协作完成各项任务。</text>
			</view>
		</view>
		
		<view class="section">
			<view class="section-title">主要功能</view>
			<view class="feature-list">
				<view class="feature-item">
					<text class="feature-icon">📋</text>
					<text class="feature-text">项目管理：创建、编辑和跟踪项目进度</text>
				</view>
				<view class="feature-item">
					<text class="feature-icon">📝</text>
					<text class="feature-text">任务管理：分配任务、设置截止日期、跟踪完成情况</text>
				</view>
				<view class="feature-item">
					<text class="feature-icon">🍵</text>
					<text class="feature-text">新品研发：管理产品研发流程和配方</text>
				</view>
				<view class="feature-item">
					<text class="feature-icon">🎉</text>
					<text class="feature-text">活动策划：创建和管理门店活动</text>
				</view>
				<view class="feature-item">
					<text class="feature-icon">⚙️</text>
					<text class="feature-text">设备维护：管理设备维护计划和状态</text>
				</view>
				<view class="feature-item">
					<text class="feature-icon">📦</text>
					<text class="feature-text">原料库存：管理原料库存和预警</text>
				</view>
				<view class="feature-item">
					<text class="feature-icon">📊</text>
					<text class="feature-text">统计报表：查看项目和任务完成情况</text>
				</view>
			</view>
		</view>
		
		<view class="section">
			<view class="section-title">开发团队</view>
			<view class="team-list">
				<view class="team-member">
					<text class="member-name">产品经理</text>
					<text class="member-role">负责产品规划和需求分析</text>
				</view>
				<view class="team-member">
					<text class="member-name">前端开发</text>
					<text class="member-role">负责应用界面和交互开发</text>
				</view>
				<view class="team-member">
					<text class="member-name">后端开发</text>
					<text class="member-role">负责服务器和数据库开发</text>
				</view>
			</view>
		</view>
		
		<view class="section">
			<view class="section-title">法律信息</view>
			<view class="legal-info">
				<view class="legal-item">
					<text class="legal-label">版权所有</text>
					<text class="legal-value">© 2026 茶店项目协作</text>
				</view>
				<view class="legal-item">
					<text class="legal-label">隐私政策</text>
					<text class="legal-value" @click="showPrivacyPolicy">查看</text>
				</view>
				<view class="legal-item">
					<text class="legal-label">用户协议</text>
					<text class="legal-value" @click="showUserAgreement">查看</text>
				</view>
			</view>
		</view>
		
		<view class="footer">
			<text class="footer-text">感谢您使用茶店项目协作！</text>
		</view>
	</view>
</template>

<script>
export default {
	methods: {
		goBack() {
			uni.navigateBack()
		},
		
		showPrivacyPolicy() {
			uni.showModal({
				title: '隐私政策',
				content: '我们重视您的隐私，您的个人信息将被严格保护。',
				showCancel: false
			})
		},
		
		showUserAgreement() {
			uni.showModal({
				title: '用户协议',
				content: '使用本应用即表示您同意我们的用户协议。',
				showCancel: false
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.about-container {
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

.app-info {
	background: #fff;
	padding: 60rpx 30rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 20rpx;
}

.app-logo {
	font-size: 120rpx;
	margin-bottom: 24rpx;
}

.app-name {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 12rpx;
}

.app-version {
	font-size: 26rpx;
	color: #999;
}

.section {
	background: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 24rpx;
}

.section-content {
	
}

.content-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
}

.feature-list {
	
}

.feature-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 24rpx;
}

.feature-item:last-child {
	margin-bottom: 0;
}

.feature-icon {
	font-size: 36rpx;
	margin-right: 16rpx;
	margin-top: 4rpx;
}

.feature-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
	flex: 1;
}

.team-list {
	
}

.team-member {
	margin-bottom: 24rpx;
}

.team-member:last-child {
	margin-bottom: 0;
}

.member-name {
	display: block;
	font-size: 26rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
}

.member-role {
	display: block;
	font-size: 24rpx;
	color: #666;
}

.legal-info {
	
}

.legal-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.legal-item:last-child {
	margin-bottom: 0;
}

.legal-label {
	font-size: 26rpx;
	color: #333;
}

.legal-value {
	font-size: 26rpx;
	color: #FF6B6B;
}

.footer {
	padding: 40rpx 30rpx;
	text-align: center;
}

.footer-text {
	font-size: 26rpx;
	color: #999;
}
</style>