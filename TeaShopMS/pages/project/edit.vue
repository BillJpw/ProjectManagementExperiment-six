<template>
	<view class="edit-container">
		<view class="form-section">
			<view class="form-item">
				<view class="form-label">项目名称 <text class="required">*</text></view>
				<input class="form-input" v-model="form.name" placeholder="请输入项目名称" />
			</view>
			
			<view class="form-item">
				<view class="form-label">项目类型 <text class="required">*</text></view>
				<picker mode="selector" :range="typeList" range-key="label" @change="onTypeChange">
					<view class="picker-value">{{ form.typeName || '请选择项目类型' }}</view>
				</picker>
			</view>
			
			<view class="form-item">
				<view class="form-label">负责人 <text class="required">*</text></view>
				<picker mode="selector" :range="userList" range-key="name" @change="onManagerChange">
					<view class="picker-value">{{ form.managerName || '请选择负责人' }}</view>
				</picker>
			</view>
			
			<view class="form-item">
				<view class="form-label">开始时间 <text class="required">*</text></view>
				<picker mode="date" @change="onStartDateChange">
					<view class="picker-value">{{ form.startTime || '请选择开始时间' }}</view>
				</picker>
			</view>
			
			<view class="form-item">
				<view class="form-label">结束时间 <text class="required">*</text></view>
				<picker mode="date" @change="onEndDateChange">
					<view class="picker-value">{{ form.endTime || '请选择结束时间' }}</view>
				</picker>
			</view>
			
			<view class="form-item">
				<view class="form-label">优先级 <text class="required">*</text></view>
				<view class="priority-select">
					<view 
						class="priority-item" 
						v-for="item in priorityList" 
						:key="item.value"
						:class="{ active: form.priority === item.value }"
						@click="form.priority = item.value">
						{{ item.label }}
					</view>
				</view>
			</view>
			
			<view class="form-item">
				<view class="form-label">项目描述</view>
				<textarea class="form-textarea" v-model="form.description" placeholder="请输入项目描述" />
			</view>
		</view>
		
		<view class="submit-section">
			<button class="submit-btn" :loading="loading" @click="handleSubmit">保存</button>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'
import { mockUsers } from '@/api/mock.js'

export default {
	data() {
		return {
			loading: false,
			projectId: null,
			typeList: [
				{ label: '新品研发', value: 'product' },
				{ label: '门店活动', value: 'activity' },
				{ label: '设备维护', value: 'equipment' },
				{ label: '培训计划', value: 'training' }
			],
			priorityList: [
				{ label: '高优先级', value: 'high' },
				{ label: '中优先级', value: 'medium' },
				{ label: '低优先级', value: 'low' }
			],
			userList: [],
			form: {
				name: '',
				type: '',
				typeName: '',
				managerId: null,
				managerName: '',
				startTime: '',
				endTime: '',
				priority: 'medium',
				description: '',
				status: 'pending',
				progress: 0
			}
		}
	},
	onLoad(options) {
		this.userList = mockUsers
		if (options.id) {
			this.projectId = parseInt(options.id)
			this.loadProject()
		}
	},
	methods: {
		async loadProject() {
			try {
				const res = await api.getProjectDetail(this.projectId)
				if (res.success) {
					this.form = { ...res.data }
				}
			} catch (e) {
				console.error(e)
			}
		},
		
		onTypeChange(e) {
			const index = e.detail.value
			this.form.type = this.typeList[index].value
			this.form.typeName = this.typeList[index].label
		},
		
		onManagerChange(e) {
			const index = e.detail.value
			this.form.managerId = this.userList[index].id
			this.form.managerName = this.userList[index].name
		},
		
		onStartDateChange(e) {
			this.form.startTime = e.detail.value
		},
		
		onEndDateChange(e) {
			this.form.endTime = e.detail.value
		},
		
		async handleSubmit() {
			if (!this.form.name) {
				uni.showToast({
					title: '请输入项目名称',
					icon: 'none'
				})
				return
			}
			
			this.loading = true
			try {
				const res = await api.saveProject(this.form)
				if (res.success) {
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 500)
				}
			} catch (e) {
				uni.showToast({
					title: '保存失败',
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
.edit-container {
	min-height: 100vh;
	background: #f5f5f5;
	padding-bottom: 40rpx;
}

.form-section {
	background: #fff;
	padding: 30rpx;
	margin-bottom: 24rpx;
}

.form-item {
	margin-bottom: 40rpx;
}

.form-item:last-child {
	margin-bottom: 0;
}

.form-label {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 16rpx;
}

.required {
	color: #FF6B6B;
}

.form-input {
	width: 100%;
	height: 88rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
}

.picker-value {
	height: 88rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
	padding: 0 24rpx;
	display: flex;
	align-items: center;
	font-size: 28rpx;
	color: #333;
}

.priority-select {
	display: flex;
	gap: 20rpx;
}

.priority-item {
	flex: 1;
	height: 72rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	color: #666;
	transition: all 0.3s;
}

.priority-item.active {
	background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
	color: #fff;
}

.form-textarea {
	width: 100%;
	min-height: 200rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
	padding: 24rpx;
	font-size: 28rpx;
}

.submit-section {
	padding: 0 30rpx;
}

.submit-btn {
	width: 100%;
	height: 96rpx;
	background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
	color: #fff;
	border: none;
	border-radius: 50rpx;
	font-size: 32rpx;
	font-weight: bold;
}
</style>
