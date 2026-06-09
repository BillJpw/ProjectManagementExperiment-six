<template>
	<view class="edit-container">
		<view class="form-section">
			<view class="form-item">
				<view class="form-label">任务标题 <text class="required">*</text></view>
				<input class="form-input" v-model="form.title" placeholder="请输入任务标题" />
			</view>
			
			<view class="form-item">
				<view class="form-label">所属项目 <text class="required">*</text></view>
				<picker mode="selector" :range="projectList" range-key="name" @change="onProjectChange">
					<view class="picker-value">{{ getProjectName(form.projectId) || '请选择项目' }}</view>
				</picker>
			</view>
			
			<view class="form-item">
				<view class="form-label">负责人 <text class="required">*</text></view>
				<picker mode="selector" :range="userList" range-key="name" @change="onAssigneeChange">
					<view class="picker-value">{{ form.assigneeName || '请选择负责人' }}</view>
				</picker>
			</view>
			
			<view class="form-item">
				<view class="form-label">截止时间 <text class="required">*</text></view>
				<picker mode="date" @change="onDeadlineChange">
					<view class="picker-value">{{ form.deadline || '请选择截止时间' }}</view>
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
				<view class="form-label">任务描述</view>
				<textarea class="form-textarea" v-model="form.content" placeholder="请输入任务描述" />
			</view>
		</view>
		
		<view class="submit-section">
			<button class="submit-btn" :loading="loading" @click="handleSubmit">保存</button>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'
import { mockUsers, mockProjects } from '@/api/mock.js'

export default {
	data() {
		return {
			loading: false,
			taskId: null,
			priorityList: [
				{ label: '高优先级', value: 'high' },
				{ label: '中优先级', value: 'medium' },
				{ label: '低优先级', value: 'low' }
			],
			userList: [],
			projectList: [],
			form: {
				title: '',
				projectId: null,
				assigneeId: null,
				assigneeName: '',
				deadline: '',
				priority: 'medium',
				content: '',
				status: 'todo',
				attachments: []
			}
		}
	},
	onLoad(options) {
		this.userList = mockUsers
		this.projectList = mockProjects
		
		if (options.projectId) {
			this.form.projectId = parseInt(options.projectId)
		}
		
		if (options.id) {
			this.taskId = parseInt(options.id)
			this.loadTask()
		}
	},
	methods: {
		async loadTask() {
			try {
				const res = await api.getTaskDetail(this.taskId)
				if (res.success) {
					this.form = { ...res.data }
				}
			} catch (e) {
				console.error(e)
			}
		},
		
		getProjectName(projectId) {
			const project = this.projectList.find(p => p.id === projectId)
			return project ? project.name : ''
		},
		
		onProjectChange(e) {
			const index = e.detail.value
			this.form.projectId = this.projectList[index].id
		},
		
		onAssigneeChange(e) {
			const index = e.detail.value
			this.form.assigneeId = this.userList[index].id
			this.form.assigneeName = this.userList[index].name
		},
		
		onDeadlineChange(e) {
			this.form.deadline = e.detail.value
		},
		
		async handleSubmit() {
			if (!this.form.title) {
				uni.showToast({
					title: '请输入任务标题',
					icon: 'none'
				})
				return
			}
			
			this.loading = true
			try {
				const res = await api.saveTask(this.form)
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
