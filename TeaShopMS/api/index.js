import {
  mockUsers, mockProjects, mockTasks, mockComments,
  mockProducts, mockEquipments, mockMaterials,
  mockMonthlyTrend, mockTaskDistribution, mockTeamTaskCounts,
  mockTeamRadar, mockMonthlyRevenue
} from './mock.js'

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

export const api = {
  async login(username, password) {
    await delay()
    const user = mockUsers.find(u => u.username === username && u.password === password)
    if (user) {
      const { password: _, ...userInfo } = user
      return { success: true, data: userInfo }
    }
    return { success: false, message: '用户名或密码错误' }
  },

  async getProjects() {
    await delay()
    return { success: true, data: [...mockProjects] }
  },

  async getProjectDetail(id) {
    await delay()
    const project = mockProjects.find(p => p.id === id)
    return { success: true, data: project }
  },

  async saveProject(project) {
    await delay()
    if (!project.id) {
      project.id = Date.now()
      mockProjects.push(project)
    }
    return { success: true, data: project }
  },

  async getTasks(projectId) {
    await delay()
    let tasks = [...mockTasks]
    if (projectId) {
      tasks = tasks.filter(t => t.projectId === projectId)
    }
    return { success: true, data: tasks }
  },

  async getTaskDetail(id) {
    await delay()
    const task = mockTasks.find(t => t.id === id)
    return { success: true, data: task }
  },

  async updateTaskStatus(taskId, status) {
    await delay()
    const task = mockTasks.find(t => t.id === taskId)
    if (task) {
      task.status = status
    }
    return { success: true, data: task }
  },

  async saveTask(task) {
    await delay()
    if (!task.id) {
      task.id = Date.now()
      mockTasks.push(task)
    }
    return { success: true, data: task }
  },

  async getComments(taskId) {
    await delay()
    const comments = mockComments.filter(c => c.taskId === taskId)
    return { success: true, data: comments }
  },

  async addComment(comment) {
    await delay()
    comment.id = Date.now()
    mockComments.push(comment)
    return { success: true, data: comment }
  },

  async getProducts() {
    await delay()
    return { success: true, data: [...mockProducts] }
  },

  async getEquipments() {
    await delay()
    return { success: true, data: [...mockEquipments] }
  },

  async getMaterials() {
    await delay()
    return { success: true, data: [...mockMaterials] }
  },

  async getStatistics() {
    await delay()
    const totalProjects = mockProjects.length
    const doneProjects = mockProjects.filter(p => p.status === 'done').length
    const totalTasks = mockTasks.length
    const doneTasks = mockTasks.filter(t => t.status === 'done').length
    const overdueTasks = mockTasks.filter(t => t.status !== 'done' && new Date(t.deadline) < new Date()).length
    const inProgressTasks = mockTasks.filter(t => t.status === 'in_progress').length
    const reviewTasks = mockTasks.filter(t => t.status === 'review').length

    return {
      success: true,
      data: {
        totalProjects,
        doneProjects,
        totalTasks,
        doneTasks,
        overdueTasks,
        inProgressTasks,
        reviewTasks,
        projectCompletionRate: totalProjects > 0 ? Math.round((doneProjects / totalProjects) * 100) : 0,
        taskCompletionRate: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
        // Enriched chart data
        monthlyTrend: { ...mockMonthlyTrend },
        taskDistribution: [...mockTaskDistribution],
        teamTaskCounts: { ...mockTeamTaskCounts },
        teamRadar: {
          labels: [...mockTeamRadar.labels],
          datasets: mockTeamRadar.datasets.map(ds => ({ ...ds, data: [...ds.data] }))
        },
        monthlyRevenue: {
          labels: [...mockMonthlyRevenue.labels],
          revenue: [...mockMonthlyRevenue.revenue],
          cost: [...mockMonthlyRevenue.cost],
          profit: [...mockMonthlyRevenue.profit]
        }
      }
    }
  }
}

export default api
