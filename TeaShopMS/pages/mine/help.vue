<template>
	<view class="help-container">
		<view class="header">
			<view class="header-left">
				<text class="back-icon" @click="goBack">‹</text>
				<text class="header-title">帮助与反馈</text>
			</view>
		</view>
		
		<view class="section">
			<view class="section-title">常见问题</view>
			<view class="faq-list">
				<view class="faq-item" v-for="(faq, index) in faqList" :key="index" @click="toggleFaq(index)">
					<view class="faq-header">
						<text class="faq-question">{{ faq.question }}</text>
						<text class="faq-arrow" :class="{ expanded: expandedFaq === index }">▼</text>
					</view>
					<view class="faq-answer" v-if="expandedFaq === index">
						{{ faq.answer }}
					</view>
				</view>
			</view>
		</view>
		
		<view class="section">
			<view class="section-title">反馈问题</view>
			<view class="feedback-form">
				<view class="form-item">
					<text class="form-label">问题类型</text>
					<picker class="form-picker" :value="feedbackTypeIndex" :range="feedbackTypes" @change="onFeedbackTypeChange">
						<view class="picker-text">{{ feedbackTypes[feedbackTypeIndex] }}</view>
					</picker>
				</view>
				<view class="form-item">
					<text class="form-label">问题描述</text>
					<textarea class="form-textarea" v-model="feedbackContent" placeholder="请详细描述您遇到的问题" />
				</view>
				<view class="form-item">
					<text class="form-label">联系方式</text>
					<input class="form-input" v-model="contactInfo" placeholder="请留下您的手机号或邮箱" />
				</view>
				<view class="form-item">
					<text class="form-label">上传截图</text>
					<view class="upload-container">
						<view class="upload-item" v-for="(image, index) in uploadedImages" :key="index">
							<image :src="image" class="upload-image" />
							<text class="upload-remove" @click="removeImage(index)">×</text>
						</view>
						<view class="upload-add" @click="chooseImage" v-if="uploadedImages.length < 3">
							<text class="upload-icon">+</text>
							<text class="upload-text">添加图片</text>
						</view>
					</view>
				</view>
				<button class="submit-btn" @click="submitFeedback">提交反馈</button>
			</view>
		</view>
		
		<view class="section">
			<view class="section-title">联系我们</view>
			<view class="contact-info">
				<view class="contact-item">
					<text class="contact-icon">📧</text>
					<text class="contact-text">support@teashop.com</text>
				</view>
				<view class="contact-item">
					<text class="contact-icon">📞</text>
					<text class="contact-text">400-123-4567</text>
				</view>
				<view class="contact-item">
					<text class="contact-icon">🕐</text>
					<text class="contact-text">工作时间：9:00-18:00</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			expandedFaq: -1,
			faqList: [
				{
					question: '如何创建新项目？',
					answer: '在项目页面点击右下角的+按钮，填写项目名称、类型、负责人等信息，然后点击保存即可创建新项目。'
				},
				{
					question: '如何分配任务？',
					answer: '在任务页面点击+按钮，填写任务标题、描述、截止日期等信息，选择任务负责人，然后点击保存即可分配任务。'
				},
				{
					question: '如何修改个人信息？',
					answer: '在个人中心页面点击设置，然后选择个人资料，即可修改个人信息。'
				},
				{
					question: '如何查看项目进度？',
					answer: '在项目详情页面可以查看项目的进度条，也可以在统计页面查看所有项目的进度情况。'
				}
			],
			feedbackTypes: ['功能建议', 'Bug反馈', '使用问题', '其他'],
			feedbackTypeIndex: 0,
			feedbackContent: '',
			contactInfo: '',
			uploadedImages: []
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		
		toggleFaq(index) {
			if (this.expandedFaq === index) {
				this.expandedFaq = -1
			} else {
				this.expandedFaq = index
			}
		},
		
		onFeedbackTypeChange(e) {
			this.feedbackTypeIndex = e.detail.value
		},
		
		chooseImage() {
			uni.chooseImage({
				count: 3 - this.uploadedImages.length,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					this.uploadedImages = [...this.uploadedImages, ...res.tempFilePaths]
				}
			})
		},
		
		removeImage(index) {
			this.uploadedImages.splice(index, 1)
		},
		
		submitFeedback() {
			if (!this.feedbackContent) {
				uni.showToast({
					title: '请填写问题描述',
					icon: 'none'
				})
				return
			}
			
			uni.showModal({
				title: '提示',
				content: '确定要提交反馈吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '反馈提交成功',
							icon: 'success'
						})
						// 重置表单
						this.feedbackTypeIndex = 0
						this.feedbackContent = ''
						this.contactInfo = ''
						this.uploadedImages = []
					}
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.help-container {
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

.section {
	background: #fff;
	margin-bottom: 20rpx;
	padding: 30rpx;
}

.section-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 24rpx;
}

.faq-list {
	
}

.faq-item {
	border-bottom: 2rpx solid #f0f0f0;
	padding: 24rpx 0;
}

.faq-item:last-child {
	border-bottom: none;
}

.faq-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.faq-question {
	font-size: 26rpx;
	color: #333;
	flex: 1;
	margin-right: 20rpx;
}

.faq-arrow {
	font-size: 24rpx;
	color: #999;
	transition: transform 0.3s;
}

.faq-arrow.expanded {
	transform: rotate(180deg);
}

.faq-answer {
	font-size: 24rpx;
	color: #666;
	line-height: 1.6;
	margin-top: 16rpx;
	padding-left: 0;
}

.feedback-form {
	
}

.form-item {
	margin-bottom: 30rpx;
}

.form-label {
	display: block;
	font-size: 26rpx;
	color: #333;
	margin-bottom: 12rpx;
}

.form-input,
.form-textarea {
	width: 100%;
	padding: 20rpx;
	border: 2rpx solid #f0f0f0;
	border-radius: 12rpx;
	font-size: 26rpx;
}

.form-textarea {
	min-height: 200rpx;
}

.form-picker {
	width: 100%;
	height: 88rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
	padding: 0 24rpx;
	display: flex;
	align-items: center;
	font-size: 26rpx;
	color: #333;
}

.upload-container {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.upload-item {
	position: relative;
	width: 160rpx;
	height: 160rpx;
	border-radius: 12rpx;
	overflow: hidden;
}

.upload-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.upload-remove {
	position: absolute;
	top: 10rpx;
	right: 10rpx;
	width: 40rpx;
	height: 40rpx;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 28rpx;
}

.upload-add {
	width: 160rpx;
	height: 160rpx;
	border: 2rpx dashed #ddd;
	border-radius: 12rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.upload-icon {
	font-size: 48rpx;
	color: #999;
	margin-bottom: 8rpx;
}

.upload-text {
	font-size: 24rpx;
	color: #999;
}

.submit-btn {
	width: 100%;
	height: 88rpx;
	background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
	color: #fff;
	border: none;
	border-radius: 50rpx;
	font-size: 30rpx;
	font-weight: bold;
	margin-top: 20rpx;
}

.contact-info {
	
}

.contact-item {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.contact-item:last-child {
	margin-bottom: 0;
}

.contact-icon {
	font-size: 36rpx;
	margin-right: 16rpx;
}

.contact-text {
	font-size: 26rpx;
	color: #666;
}
</style>