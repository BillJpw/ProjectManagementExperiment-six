<template>
  <view class="index-container">
    <!-- Header -->
    <view class="header">
      <view class="header-top">
        <view class="welcome">
          <text class="greeting">{{ greetingText }}</text>
          <text class="user-name">{{ userInfo.name || '用户' }}</text>
        </view>
        <view class="header-actions">
          <view class="notify-btn" @click="goToPage('/pages/statistics/index')">
            <text class="notify-icon">🔔</text>
            <view class="notify-dot" v-if="stats.overdueTasks > 0"></view>
          </view>
        </view>
      </view>
      <text class="date-text">{{ currentDate }} · {{ weatherEmoji }} 宜高效工作</text>
    </view>

    <!-- Stats Dashboard -->
    <view class="stats-dashboard">
      <view class="stat-card" @click="goToPage('/pages/project/list')">
        <view class="stat-icon-wrap icon-gradient-purple">
          <text class="stat-icon">📋</text>
        </view>
        <view class="stat-info">
          <text class="stat-value">{{ stats.totalProjects || 0 }}</text>
          <text class="stat-label">总项目</text>
        </view>
        <text class="stat-arrow">›</text>
      </view>
      <view class="stat-card" @click="goToPage('/pages/task/kanban')">
        <view class="stat-icon-wrap icon-gradient-blue">
          <text class="stat-icon">📝</text>
        </view>
        <view class="stat-info">
          <text class="stat-value">{{ stats.totalTasks || 0 }}</text>
          <text class="stat-label">总任务</text>
        </view>
        <text class="stat-arrow">›</text>
      </view>
      <view class="stat-card">
        <view class="stat-icon-wrap icon-gradient-green">
          <text class="stat-icon">📊</text>
        </view>
        <view class="stat-info">
          <text class="stat-value highlight-green">{{ stats.taskCompletionRate || 0 }}%</text>
          <text class="stat-label">完成率</text>
        </view>
      </view>
      <view class="stat-card">
        <view class="stat-icon-wrap icon-gradient-orange">
          <text class="stat-icon">⏰</text>
        </view>
        <view class="stat-info">
          <text class="stat-value" :class="stats.overdueTasks > 0 ? 'highlight-red' : ''">{{ stats.overdueTasks || 0 }}</text>
          <text class="stat-label">延期</text>
        </view>
      </view>
    </view>

    <!-- Quick Access -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">快捷入口</text>
      </view>
      <view class="quick-grid">
        <view class="quick-item" @click="goToPage('/pages/business/product')">
          <view class="quick-icon-bg q-bg-green"><text class="quick-icon">🍵</text></view>
          <text class="quick-name">新品研发</text>
          <text class="quick-desc">配方与测试</text>
        </view>
        <view class="quick-item" @click="goToPage('/pages/business/activity')">
          <view class="quick-icon-bg q-bg-orange"><text class="quick-icon">🎉</text></view>
          <text class="quick-name">活动策划</text>
          <text class="quick-desc">促销与推广</text>
        </view>
        <view class="quick-item" @click="goToPage('/pages/business/equipment')">
          <view class="quick-icon-bg q-bg-purple"><text class="quick-icon">⚙️</text></view>
          <text class="quick-name">设备维护</text>
          <text class="quick-desc">保养与维修</text>
        </view>
        <view class="quick-item" @click="goToPage('/pages/business/material')">
          <view class="quick-icon-bg q-bg-yellow"><text class="quick-icon">📦</text></view>
          <text class="quick-name">原料库存</text>
          <text class="quick-desc">库存与预警</text>
        </view>
        <view class="quick-item" @click="goToPage('/pages/statistics/index')">
          <view class="quick-icon-bg q-bg-blue"><text class="quick-icon">📈</text></view>
          <text class="quick-name">数据报表</text>
          <text class="quick-desc">统计与分析</text>
        </view>
        <view class="quick-item" @click="goToPage('/pages/task/kanban')">
          <view class="quick-icon-bg q-bg-pink"><text class="quick-icon">📌</text></view>
          <text class="quick-name">任务看板</text>
          <text class="quick-desc">查看与跟进</text>
        </view>
      </view>
    </view>

    <!-- Pending Alerts -->
    <view class="section" v-if="stats.overdueTasks > 0">
      <view class="section-header">
        <text class="section-title">待处理</text>
        <text class="section-badge">{{ stats.overdueTasks }}</text>
      </view>
      <view class="alert-card" @click="goToPage('/pages/task/kanban')">
        <view class="alert-icon">⚠️</view>
        <view class="alert-content">
          <text class="alert-title">有 {{ stats.overdueTasks }} 个任务已延期</text>
          <text class="alert-desc">请及时查看并跟进处理</text>
        </view>
        <text class="alert-arrow">›</text>
      </view>
    </view>

    <!-- In Progress Projects -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">进行中项目</text>
        <text class="section-more" @click="goToPage('/pages/project/list')">全部 ›</text>
      </view>
      <view class="project-list">
        <view class="project-card" v-for="project in inProgressProjects" :key="project.id" @click="goToProjectDetail(project.id)">
          <view class="project-top">
            <view class="project-type-badge" :class="'type-' + project.type">{{ project.typeName }}</view>
            <text class="project-priority" :class="'p-' + project.priority">{{ getPriorityText(project.priority) }}</text>
          </view>
          <text class="project-name">{{ project.name }}</text>
          <view class="project-meta">
            <text class="meta-item">👤 {{ project.managerName }}</text>
            <text class="meta-item">📅 {{ project.endTime }}</text>
          </view>
          <view class="project-progress">
            <view class="progress-track">
              <view class="progress-fill" :style="{ width: project.progress + '%' }"></view>
            </view>
            <text class="progress-num">{{ project.progress }}%</text>
          </view>
        </view>
        <view class="empty-project" v-if="inProgressProjects.length === 0">
          <text class="empty-icon">🚀</text>
          <text class="empty-text">暂无进行中项目</text>
          <text class="empty-sub">点击右下角 + 创建新项目</text>
        </view>
      </view>
    </view>

    <!-- Bottom Navigation -->
    <view class="bottom-nav">
      <view class="nav-item active">
        <text class="nav-icon">🏠</text>
        <text class="nav-text">首页</text>
      </view>
      <view class="nav-item" @click="goToPage('/pages/project/list')">
        <text class="nav-icon">📋</text>
        <text class="nav-text">项目</text>
      </view>
      <view class="nav-item" @click="goToPage('/pages/task/kanban')">
        <text class="nav-icon">📝</text>
        <text class="nav-text">任务</text>
      </view>
      <view class="nav-item" @click="goToPage('/pages/statistics/index')">
        <text class="nav-icon">📊</text>
        <text class="nav-text">统计</text>
      </view>
      <view class="nav-item" @click="goToPage('/pages/mine/index')">
        <text class="nav-icon">👤</text>
        <text class="nav-text">我的</text>
      </view>
    </view>

    <!-- Safe area spacer -->
    <view class="bottom-spacer"></view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import api from '@/api/index.js'

export default {
  data() {
    return {
      stats: {},
      projects: [],
      currentDate: '',
      weatherEmoji: '☀️'
    }
  },
  computed: {
    ...mapState(['userInfo']),
    greetingText() {
      const hour = new Date().getHours()
      if (hour < 6) return '夜深了'
      if (hour < 9) return '早上好'
      if (hour < 12) return '上午好'
      if (hour < 14) return '中午好'
      if (hour < 18) return '下午好'
      return '晚上好'
    },
    inProgressProjects() {
      return this.projects.filter(p => p.status === 'in_progress').slice(0, 4)
    }
  },
  onLoad() {
    this.loadData()
    this.getCurrentDate()
  },
  onShow() {
    this.loadData()
  },
  methods: {
    getCurrentDate() {
      const now = new Date()
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      this.currentDate = `${now.getMonth() + 1}月${now.getDate()}日 ${weekDays[now.getDay()]}`
      const hour = now.getHours()
      if (hour >= 6 && hour < 19) this.weatherEmoji = '☀️'
      else this.weatherEmoji = '🌙'
    },

    async loadData() {
      try {
        const [statsRes, projectsRes] = await Promise.all([
          api.getStatistics(),
          api.getProjects()
        ])
        if (statsRes.success) this.stats = statsRes.data
        if (projectsRes.success) this.projects = projectsRes.data
      } catch (e) {
        console.error(e)
      }
    },

    goToPage(url) {
      uni.navigateTo({ url })
    },

    goToProjectDetail(id) {
      uni.navigateTo({ url: '/pages/project/detail?id=' + id })
    },

    getPriorityText(p) {
      return { high: '高', medium: '中', low: '低' }[p] || p
    }
  }
}
</script>

<style lang="scss" scoped>
.index-container {
  min-height: 100vh;
  background: #f5f7fa;
}

// Header
.header {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 80%, #FFB8B8 100%);
  padding: 48rpx 30rpx 52rpx;
}
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12rpx;
}
.welcome { flex: 1; }
.greeting {
  display: block;
  font-size: 28rpx;
  color: rgba(255,255,255,0.9);
  margin-bottom: 6rpx;
}
.user-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #fff;
}
.header-actions { position: relative; }
.notify-btn {
  width: 72rpx;
  height: 72rpx;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.notify-icon { font-size: 32rpx; }
.notify-dot {
  position: absolute;
  top: 8rpx;
  right: 12rpx;
  width: 16rpx;
  height: 16rpx;
  background: #FF4757;
  border-radius: 50%;
  border: 2rpx solid rgba(255,255,255,0.6);
}
.date-text {
  font-size: 24rpx;
  color: rgba(255,255,255,0.85);
}

// Stats Dashboard
.stats-dashboard {
  display: flex;
  margin: -32rpx 24rpx 0;
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx 16rpx;
  box-shadow: 0 8rpx 30rpx rgba(0,0,0,0.08);
}
.stat-card {
  flex: 1;
  text-align: center;
  cursor: pointer;
}
.stat-icon-wrap {
  width: 68rpx;
  height: 68rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12rpx;
}
.icon-gradient-purple { background: linear-gradient(135deg, #EEF0FF, #DEE0FF); }
.icon-gradient-blue { background: linear-gradient(135deg, #E5F9FF, #CCF0FF); }
.icon-gradient-green { background: linear-gradient(135deg, #E8F8F5, #D0F0E8); }
.icon-gradient-orange { background: linear-gradient(135deg, #FFF4E5, #FFE8CC); }
.stat-icon { font-size: 30rpx; }
.stat-info { display: flex; flex-direction: column; align-items: center; }
.stat-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
.stat-label {
  font-size: 20rpx;
  color: #999;
  margin-top: 2rpx;
}
.highlight-green { color: #2ED573; }
.highlight-red { color: #FF4757; }
.stat-arrow { display: none; }

// Sections
.section {
  padding: 0 24rpx;
  margin-top: 36rpx;
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
.section-badge {
  background: #FF4757;
  color: #fff;
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  border-radius: 50rpx;
}
.section-more {
  font-size: 26rpx;
  color: #999;
}

// Quick Access
.quick-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.quick-item {
  width: calc(33.33% - 11rpx);
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}
.quick-icon-bg {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14rpx;
}
.q-bg-green { background: #E8F8F5; }
.q-bg-orange { background: #FFF4E5; }
.q-bg-purple { background: #EEF0FF; }
.q-bg-yellow { background: #FFFDE5; }
.q-bg-blue { background: #E5F9FF; }
.q-bg-pink { background: #FFE5EC; }
.quick-icon { font-size: 38rpx; }
.quick-name {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 4rpx;
}
.quick-desc {
  font-size: 20rpx;
  color: #bbb;
}

// Alert Card
.alert-card {
  background: linear-gradient(135deg, #FFF5F5, #FFE5E5);
  border-radius: 20rpx;
  padding: 28rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  border: 2rpx solid #FFD0D0;
}
.alert-icon { font-size: 40rpx; }
.alert-content { flex: 1; }
.alert-title { font-size: 28rpx; color: #FF4757; font-weight: bold; display: block; }
.alert-desc { font-size: 24rpx; color: #FF6B6B; }
.alert-arrow { font-size: 36rpx; color: #FF6B6B; }

// Project List
.project-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.project-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}
.project-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14rpx;
}
.project-type-badge {
  font-size: 22rpx;
  padding: 4rpx 14rpx;
  border-radius: 8rpx;
  font-weight: bold;
}
.type-product { background: #EEF0FF; color: #5352ED; }
.type-activity { background: #FFF4E5; color: #FF9F43; }
.type-equipment { background: #E8F8F5; color: #2ED573; }
.type-training { background: #E5F9FF; color: #0099CC; }
.type-report { background: #F5F0FF; color: #7B68EE; }
.project-priority {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}
.p-high { background: #FFE5E5; color: #FF4757; }
.p-medium { background: #FFF4E5; color: #FF9F43; }
.p-low { background: #E8F8F5; color: #2ED573; }
.project-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
  line-height: 1.4;
}
.project-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18rpx;
}
.meta-item {
  font-size: 24rpx;
  color: #999;
}
.project-progress {
  display: flex;
  align-items: center;
  gap: 14rpx;
}
.progress-track {
  flex: 1;
  height: 10rpx;
  background: #f0f0f0;
  border-radius: 5rpx;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #5352ED, #7B68EE);
  border-radius: 5rpx;
  transition: width 0.5s;
}
.progress-num {
  font-size: 24rpx;
  color: #5352ED;
  font-weight: bold;
  min-width: 60rpx;
  text-align: right;
}

// Empty State
.empty-project {
  background: #fff;
  border-radius: 20rpx;
  padding: 60rpx 30rpx;
  text-align: center;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}
.empty-icon { font-size: 80rpx; display: block; margin-bottom: 16rpx; }
.empty-text { font-size: 28rpx; color: #999; display: block; }
.empty-sub { font-size: 22rpx; color: #ccc; display: block; margin-top: 8rpx; }

// Bottom Nav
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  padding: 12rpx 0;
  padding-bottom: calc(12rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid #f0f0f0;
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.04);
  z-index: 100;
}
.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  padding: 8rpx 0;
}
.nav-item.active .nav-text { color: #FF6B6B; font-weight: bold; }
.nav-icon { font-size: 38rpx; }
.nav-text { font-size: 22rpx; color: #999; }

.bottom-spacer { height: 120rpx; }
</style>
