<template>
  <view class="stats-container">
    <!-- Header -->
    <view class="header">
      <view class="header-title">统计报表</view>
      <view class="header-desc">数据驱动决策，让管理更科学</view>
    </view>

    <!-- Tab Bar -->
    <view class="tab-bar">
      <view
        class="tab-item"
        v-for="(tab, idx) in tabs"
        :key="idx"
        :class="{ active: currentTab === idx }"
        @click="switchTab(idx)"
      >
        <text class="tab-text">{{ tab }}</text>
        <view class="tab-line" v-if="currentTab === idx"></view>
      </view>
    </view>

    <!-- Tab 0: 概览 -->
    <view class="tab-content" v-if="currentTab === 0">
      <!-- Overview Cards -->
      <view class="overview-grid">
        <view class="overview-card card-primary">
          <view class="overview-icon-bg">
            <text class="overview-icon-text">📋</text>
          </view>
          <view class="overview-right">
            <text class="overview-value">{{ stats.totalProjects }}</text>
            <text class="overview-label">总项目数</text>
          </view>
        </view>
        <view class="overview-card card-success">
          <view class="overview-icon-bg">
            <text class="overview-icon-text">✅</text>
          </view>
          <view class="overview-right">
            <text class="overview-value">{{ stats.doneProjects }}</text>
            <text class="overview-label">已完成</text>
          </view>
        </view>
        <view class="overview-card card-info">
          <view class="overview-icon-bg">
            <text class="overview-icon-text">📝</text>
          </view>
          <view class="overview-right">
            <text class="overview-value">{{ stats.totalTasks }}</text>
            <text class="overview-label">总任务数</text>
          </view>
        </view>
        <view class="overview-card card-warning">
          <view class="overview-icon-bg">
            <text class="overview-icon-text">⏰</text>
          </view>
          <view class="overview-right">
            <text class="overview-value">{{ stats.overdueTasks }}</text>
            <text class="overview-label">延期任务</text>
          </view>
        </view>
      </view>

      <!-- Completion Rate Cards -->
      <view class="rate-cards">
        <view class="rate-card">
          <view class="rate-header">
            <text class="rate-title">项目完成率</text>
            <text class="rate-value text-primary">{{ stats.projectCompletionRate }}%</text>
          </view>
          <view class="rate-bar">
            <view class="rate-fill rate-fill-primary" :style="{ width: stats.projectCompletionRate + '%' }"></view>
          </view>
          <view class="rate-detail">
            <text class="rate-done">已完成 {{ stats.doneProjects }}</text>
            <text class="rate-total">共 {{ stats.totalProjects }} 个</text>
          </view>
        </view>
        <view class="rate-card">
          <view class="rate-header">
            <text class="rate-title">任务完成率</text>
            <text class="rate-value text-info">{{ stats.taskCompletionRate }}%</text>
          </view>
          <view class="rate-bar">
            <view class="rate-fill rate-fill-info" :style="{ width: stats.taskCompletionRate + '%' }"></view>
          </view>
          <view class="rate-detail">
            <text class="rate-done">已完成 {{ stats.doneTasks }}</text>
            <text class="rate-total">共 {{ stats.totalTasks }} 个</text>
          </view>
        </view>
      </view>

      <!-- Revenue Trend Line Chart -->
      <line-chart
        ref="revenueChart"
        title="月度营收趋势（万元）"
        :labels="revenueLabels"
        :datasets="revenueDatasets"
        :legend="revenueLegend"
      ></line-chart>

      <!-- Quick Insights -->
      <view class="insight-section">
        <view class="section-title-sm">数据洞察</view>
        <view class="insight-card">
          <view class="insight-item">
            <view class="insight-dot dot-success"></view>
            <text class="insight-text">本月已完成 <text class="highlight">{{ stats.doneTasks }}</text> 个任务，完成率 {{ stats.taskCompletionRate }}%</text>
          </view>
          <view class="insight-item">
            <view class="insight-dot dot-warning"></view>
            <text class="insight-text">还有 <text class="highlight">{{ stats.totalTasks - stats.doneTasks }}</text> 个任务待完成</text>
          </view>
          <view class="insight-item" v-if="stats.overdueTasks > 0">
            <view class="insight-dot dot-danger"></view>
            <text class="insight-text"><text class="highlight">{{ stats.overdueTasks }}</text> 个任务已延期，请及时跟进</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Tab 1: 图表分析 -->
    <view class="tab-content" v-if="currentTab === 1">
      <!-- Task Distribution Pie Chart -->
      <pie-chart
        ref="taskPieChart"
        title="任务状态分布"
        :data="taskDistData"
      ></pie-chart>

      <!-- Task Completion Trend -->
      <line-chart
        ref="completionTrendChart"
        title="任务完成趋势"
        :labels="trendLabels"
        :datasets="trendDatasets"
        :legend="trendLegend"
      ></line-chart>

      <!-- Team Task Bar Chart -->
      <bar-chart
        ref="teamBarChart"
        title="团队成员任务量对比"
        :labels="teamLabels"
        :data="teamData"
        color="#5352ED"
      ></bar-chart>

      <!-- Project Progress -->
      <view class="project-progress-section">
        <view class="section-title-sm">项目进度总览</view>
        <view class="project-mini-list">
          <view class="project-mini-card" v-for="project in projects" :key="project.id">
            <view class="mini-top">
              <text class="mini-name">{{ project.name }}</text>
              <text class="mini-status" :class="'mini-' + project.status">{{ getStatusText(project.status) }}</text>
            </view>
            <view class="mini-bar-bg">
              <view
                class="mini-bar-fill"
                :class="'bar-' + project.status"
                :style="{ width: project.progress + '%' }"
              ></view>
            </view>
            <text class="mini-percent">{{ project.progress }}%</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Tab 2: 团队效能 -->
    <view class="tab-content" v-if="currentTab === 2">
      <!-- Radar Chart -->
      <radar-chart
        ref="teamRadarChart"
        title="团队能力雷达"
        :labels="radarLabels"
        :datasets="radarDatasets"
        :legend="radarLegend"
        :maxValue="100"
      ></radar-chart>

      <!-- Team Ranking -->
      <view class="ranking-section">
        <view class="section-title-sm">工作量排行</view>
        <view class="ranking-list">
          <view class="ranking-item" v-for="(member, idx) in teamRanking" :key="member.id">
            <view class="rank-badge" :class="'rank-' + (idx + 1)">{{ idx + 1 }}</view>
            <view class="rank-avatar" :style="{ background: member.avatarBg }">{{ member.name.charAt(0) }}</view>
            <view class="rank-info">
              <text class="rank-name">{{ member.name }}</text>
              <text class="rank-role">{{ member.roleName }}</text>
            </view>
            <view class="rank-stats">
              <view class="rank-stat-item">
                <text class="rank-stat-value">{{ member.taskCount }}</text>
                <text class="rank-stat-label">任务</text>
              </view>
              <view class="rank-stat-item">
                <text class="rank-stat-value">{{ member.doneCount }}</text>
                <text class="rank-stat-label">完成</text>
              </view>
              <view class="rank-stat-item">
                <text class="rank-stat-value">{{ member.efficiency }}%</text>
                <text class="rank-stat-label">效率</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import api from '@/api/index.js'
import { mockUsers, mockTasks } from '@/api/mock.js'
import LineChart from '@/components/chart/line-chart.vue'
import PieChart from '@/components/chart/pie-chart.vue'
import BarChart from '@/components/chart/bar-chart.vue'
import RadarChart from '@/components/chart/radar-chart.vue'

export default {
  components: { LineChart, PieChart, BarChart, RadarChart },
  data() {
    return {
      currentTab: 0,
      tabs: ['📊 数据概览', '📈 图表分析', '👥 团队效能'],
      stats: {
        totalProjects: 0,
        doneProjects: 0,
        totalTasks: 0,
        doneTasks: 0,
        overdueTasks: 0,
        projectCompletionRate: 0,
        taskCompletionRate: 0
      },
      projects: [],
      revenueLabels: [],
      revenueDatasets: [],
      revenueLegend: [],
      trendLabels: [],
      trendDatasets: [],
      trendLegend: [],
      taskDistData: [],
      teamLabels: [],
      teamData: [],
      radarLabels: [],
      radarDatasets: [],
      radarLegend: [],
      teamRanking: []
    }
  },
  onLoad() {
    this.loadStats()
  },
  onShow() {
    this.loadStats()
  },
  methods: {
    async loadStats() {
      try {
        const [statsRes, projectsRes] = await Promise.all([
          api.getStatistics(),
          api.getProjects()
        ])
        if (statsRes.success) {
          const d = statsRes.data
          this.stats = d

          // Revenue chart data
          this.revenueLabels = d.monthlyRevenue.labels
          this.revenueDatasets = [
            { data: d.monthlyRevenue.revenue, color: '#5352ED' },
            { data: d.monthlyRevenue.cost, color: '#FF6B6B' },
            { data: d.monthlyRevenue.profit, color: '#2ED573' }
          ]
          this.revenueLegend = [
            { name: '营收', color: '#5352ED' },
            { name: '成本', color: '#FF6B6B' },
            { name: '利润', color: '#2ED573' }
          ]

          // Trend chart data
          this.trendLabels = d.monthlyTrend.labels
          this.trendDatasets = [
            { data: d.monthlyTrend.tasksDone, color: '#5352ED' },
            { data: d.monthlyTrend.tasksTotal, color: '#FF9F43' }
          ]
          this.trendLegend = [
            { name: '已完成', color: '#5352ED' },
            { name: '总任务', color: '#FF9F43' }
          ]

          // Task distribution
          this.taskDistData = d.taskDistribution

          // Team bar chart
          this.teamLabels = d.teamTaskCounts.labels
          this.teamData = d.teamTaskCounts.data

          // Radar chart
          this.radarLabels = d.teamRadar.labels
          this.radarDatasets = d.teamRadar.datasets
          this.radarLegend = d.teamRadar.datasets.map(ds => ({
            name: ds.name,
            color: ds.color
          }))
        }
        if (projectsRes.success) {
          this.projects = projectsRes.data
        }

        this.buildTeamRanking()
      } catch (e) {
        console.error(e)
      }
    },

    buildTeamRanking() {
      const roleMap = { manager: '店长', staff: '店员', developer: '研发' }
      const avatarColors = ['#5352ED', '#FF6B6B', '#FF9F43', '#2ED573', '#7B68EE']
      const ranking = mockUsers.map((user, idx) => {
        const userTasks = mockTasks.filter(t => t.assigneeId === user.id)
        const doneTasks = userTasks.filter(t => t.status === 'done')
        const total = userTasks.length
        const done = doneTasks.length
        return {
          ...user,
          roleName: roleMap[user.role] || user.role,
          taskCount: total,
          doneCount: done,
          efficiency: total > 0 ? Math.round((done / total) * 100) : 0,
          avatarBg: avatarColors[idx % avatarColors.length]
        }
      })
      ranking.sort((a, b) => b.taskCount - a.taskCount)
      this.teamRanking = ranking
    },

    switchTab(idx) {
      this.currentTab = idx
    },

    getStatusText(status) {
      const map = { pending: '待开始', in_progress: '进行中', done: '已完成' }
      return map[status] || status
    }
  }
}
</script>

<style lang="scss" scoped>
.stats-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 40rpx;
}

// Header
.header {
  background: linear-gradient(135deg, #5352ED 0%, #7B68EE 100%);
  padding: 40rpx 30rpx 36rpx;
}
.header-title {
  font-size: 38rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8rpx;
}
.header-desc {
  font-size: 26rpx;
  color: rgba(255,255,255,0.85);
}

// Tab Bar
.tab-bar {
  display: flex;
  background: #fff;
  padding: 0 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
  position: sticky;
  top: 0;
  z-index: 10;
}
.tab-item {
  flex: 1;
  text-align: center;
  padding: 28rpx 0 20rpx;
  position: relative;
}
.tab-text {
  font-size: 28rpx;
  color: #999;
  transition: color 0.3s;
}
.tab-item.active .tab-text {
  color: #5352ED;
  font-weight: bold;
}
.tab-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 6rpx;
  background: #5352ED;
  border-radius: 3rpx;
}

.tab-content {
  padding: 24rpx 24rpx 0;
}

// Overview Cards
.overview-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 20rpx;
}
.overview-card {
  width: calc(50% - 8rpx);
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}
.overview-icon-bg {
  width: 88rpx;
  height: 88rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-primary .overview-icon-bg { background: #EEF0FF; }
.card-success .overview-icon-bg { background: #E8F8F5; }
.card-info .overview-icon-bg { background: #E5F9FF; }
.card-warning .overview-icon-bg { background: #FFF4E5; }
.overview-icon-text { font-size: 40rpx; }
.overview-right { flex: 1; }
.overview-value {
  font-size: 44rpx;
  font-weight: bold;
  color: #333;
  display: block;
}
.overview-label {
  font-size: 24rpx;
  color: #999;
  margin-top: 4rpx;
}

// Rate Cards
.rate-cards {
  display: flex;
  gap: 16rpx;
  margin-bottom: 20rpx;
}
.rate-card {
  flex: 1;
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}
.rate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}
.rate-title { font-size: 26rpx; color: #666; }
.rate-value { font-size: 32rpx; font-weight: bold; }
.text-primary { color: #FF6B6B; }
.text-info { color: #5352ED; }
.rate-bar {
  height: 12rpx;
  background: #f0f0f0;
  border-radius: 6rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
}
.rate-fill {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.8s ease;
}
.rate-fill-primary { background: linear-gradient(90deg, #FF6B6B, #FF8E8E); }
.rate-fill-info { background: linear-gradient(90deg, #5352ED, #7B68EE); }
.rate-detail {
  display: flex;
  justify-content: space-between;
  font-size: 22rpx;
  color: #999;
}
.rate-done { color: #2ED573; }

// Insight Section
.insight-section {
  margin-bottom: 20rpx;
}
.section-title-sm {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
  padding-left: 4rpx;
}
.insight-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx 28rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}
.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  padding: 12rpx 0;
}
.insight-item + .insight-item {
  border-top: 1rpx solid #f5f5f5;
}
.insight-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  margin-top: 8rpx;
  flex-shrink: 0;
}
.dot-success { background: #2ED573; }
.dot-warning { background: #FF9F43; }
.dot-danger { background: #FF4757; }
.insight-text { font-size: 26rpx; color: #666; line-height: 1.5; }
.highlight { color: #333; font-weight: bold; }

// Project Mini List
.project-progress-section {
  margin-bottom: 20rpx;
}
.project-mini-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.project-mini-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}
.mini-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14rpx;
}
.mini-name {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
  flex: 1;
}
.mini-status {
  font-size: 22rpx;
  padding: 4rpx 14rpx;
  border-radius: 20rpx;
}
.mini-pending { background: #FFF4E5; color: #FF9F43; }
.mini-in_progress { background: #E5F9FF; color: #5352ED; }
.mini-done { background: #E8F8F5; color: #2ED573; }
.mini-bar-bg {
  height: 10rpx;
  background: #f0f0f0;
  border-radius: 5rpx;
  overflow: hidden;
  margin-bottom: 8rpx;
}
.mini-bar-fill {
  height: 100%;
  border-radius: 5rpx;
  transition: width 0.6s;
}
.bar-pending { background: linear-gradient(90deg, #FF9F43, #FFC107); }
.bar-in_progress { background: linear-gradient(90deg, #5352ED, #7B68EE); }
.bar-done { background: linear-gradient(90deg, #2ED573, #5FD068); }
.mini-percent {
  font-size: 22rpx;
  color: #999;
  text-align: right;
  display: block;
}

// Ranking Section
.ranking-section {
  margin-bottom: 20rpx;
}
.ranking-list {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}
.ranking-item {
  display: flex;
  align-items: center;
  padding: 24rpx 24rpx;
  gap: 16rpx;
  border-bottom: 1rpx solid #f5f5f5;
}
.ranking-item:last-child { border-bottom: none; }
.rank-badge {
  width: 48rpx;
  height: 48rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: bold;
  color: #fff;
  flex-shrink: 0;
}
.rank-1 { background: linear-gradient(135deg, #FFD700, #FFA500); }
.rank-2 { background: linear-gradient(135deg, #C0C0C0, #999); }
.rank-3 { background: linear-gradient(135deg, #CD7F32, #A0522D); }
.rank-4, .rank-5 { background: #ddd; color: #666; }
.rank-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28rpx;
  font-weight: bold;
  flex-shrink: 0;
}
.rank-info {
  flex: 1;
}
.rank-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  display: block;
}
.rank-role {
  font-size: 22rpx;
  color: #999;
}
.rank-stats {
  display: flex;
  gap: 20rpx;
}
.rank-stat-item {
  text-align: center;
}
.rank-stat-value {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  display: block;
}
.rank-stat-label {
  font-size: 20rpx;
  color: #999;
}
</style>
