export const mockUsers = [
  { id: 1, username: 'admin', password: '123456', name: '张店长', role: 'manager', phone: '13800138001', avatar: '' },
  { id: 2, username: 'staff1', password: '123456', name: '李店员', role: 'staff', phone: '13800138002', avatar: '' },
  { id: 3, username: 'developer', password: '123456', name: '王研发', role: 'developer', phone: '13800138003', avatar: '' },
  { id: 4, username: 'staff2', password: '123456', name: '赵服务员', role: 'staff', phone: '13800138004', avatar: '' },
  { id: 5, username: 'designer', password: '123456', name: '陈设计', role: 'developer', phone: '13800138005', avatar: '' }
]

export const mockProjects = [
  {
    id: 1, name: '春季新品研发：樱花系列', type: 'product', typeName: '新品研发',
    managerId: 3, managerName: '王研发',
    startTime: '2026-04-01', endTime: '2026-04-30',
    description: '开发春季限定樱花系列奶茶研发项目，包括樱花粉奶茶、樱花拿铁等5款新品',
    priority: 'high', status: 'in_progress', progress: 60
  },
  {
    id: 2, name: '五一劳动节促销活动', type: 'activity', typeName: '门店活动',
    managerId: 1, managerName: '张店长',
    startTime: '2026-04-25', endTime: '2026-05-05',
    description: '五一劳动节门店促销活动策划与执行，买一送一优惠',
    priority: 'medium', status: 'pending', progress: 20
  },
  {
    id: 3, name: '制冰机季度维护', type: 'equipment', typeName: '设备维护',
    managerId: 2, managerName: '李店员',
    startTime: '2026-04-20', endTime: '2026-04-22',
    description: '门店制冰机季度保养维护，更换滤芯和清洁冷凝器',
    priority: 'high', status: 'in_progress', progress: 50
  },
  {
    id: 4, name: '夏季冰沙系列研发', type: 'product', typeName: '新品研发',
    managerId: 5, managerName: '陈设计',
    startTime: '2026-05-10', endTime: '2026-06-15',
    description: '夏季冰沙系列饮品开发，包含芒果冰沙、西瓜冰沙、蓝莓冰沙',
    priority: 'medium', status: 'pending', progress: 10
  },
  {
    id: 5, name: '店员服务标准化培训', type: 'training', typeName: '员工培训',
    managerId: 1, managerName: '张店长',
    startTime: '2026-03-01', endTime: '2026-03-30',
    description: '制定标准化服务流程，培训新老员工规范化操作',
    priority: 'low', status: 'done', progress: 100
  },
  {
    id: 6, name: '端午节粽子礼盒策划', type: 'activity', typeName: '门店活动',
    managerId: 4, managerName: '赵服务员',
    startTime: '2026-05-15', endTime: '2026-06-20',
    description: '端午节限定粽子礼盒搭配茶饮套餐活动策划',
    priority: 'medium', status: 'pending', progress: 5
  },
  {
    id: 7, name: '冷藏柜升级更换', type: 'equipment', typeName: '设备维护',
    managerId: 2, managerName: '李店员',
    startTime: '2026-05-01', endTime: '2026-05-20',
    description: '更新旧冷藏柜，采购新型节能冷藏设备',
    priority: 'high', status: 'in_progress', progress: 35
  },
  {
    id: 8, name: '第一季度营收分析', type: 'report', typeName: '数据分析',
    managerId: 1, managerName: '张店长',
    startTime: '2026-04-01', endTime: '2026-04-15',
    description: '汇总分析第一季度门店营收数据，制定第二季度经营策略',
    priority: 'medium', status: 'done', progress: 100
  }
]

export const mockTasks = [
  { id: 1, projectId: 1, title: '樱花粉配方调试', content: '调试樱花粉奶茶口味配方，确定最佳甜度配比', assigneeId: 3, assigneeName: '王研发', deadline: '2026-04-15', priority: 'high', status: 'done', attachments: [] },
  { id: 2, projectId: 1, title: '杯贴视觉设计', content: '设计樱花系列专属杯贴和包装', assigneeId: 5, assigneeName: '陈设计', deadline: '2026-04-20', priority: 'medium', status: 'done', attachments: [] },
  { id: 3, projectId: 1, title: '樱花酱供应商筛选', content: '对比3家樱花酱供应商报价和品质', assigneeId: 2, assigneeName: '李店员', deadline: '2026-04-22', priority: 'high', status: 'done', attachments: [] },
  { id: 4, projectId: 1, title: '内部试饮评测', content: '组织店员对新品进行盲测打分', assigneeId: 1, assigneeName: '张店长', deadline: '2026-04-25', priority: 'high', status: 'in_progress', attachments: [] },
  { id: 5, projectId: 1, title: '成本核算与定价', content: '核算原材料成本，制定最终售价', assigneeId: 1, assigneeName: '张店长', deadline: '2026-04-28', priority: 'medium', status: 'todo', attachments: [] },
  { id: 6, projectId: 2, title: '活动方案撰写', content: '撰写五一活动详细方案和预算', assigneeId: 1, assigneeName: '张店长', deadline: '2026-04-26', priority: 'high', status: 'done', attachments: [] },
  { id: 7, projectId: 2, title: '宣传物料制作', content: '制作活动海报、横幅、宣传单', assigneeId: 5, assigneeName: '陈设计', deadline: '2026-04-29', priority: 'high', status: 'in_progress', attachments: [] },
  { id: 8, projectId: 2, title: '优惠系统设置', content: '在收银系统中设置买一送一优惠规则', assigneeId: 4, assigneeName: '赵服务员', deadline: '2026-04-30', priority: 'medium', status: 'todo', attachments: [] },
  { id: 9, projectId: 3, title: '联系维修厂家', content: '联系制冰机厂家预约上门维护时间', assigneeId: 2, assigneeName: '李店员', deadline: '2026-04-21', priority: 'high', status: 'done', attachments: [] },
  { id: 10, projectId: 3, title: '更换滤芯', content: '更换制冰机水过滤系统滤芯', assigneeId: 2, assigneeName: '李店员', deadline: '2026-04-22', priority: 'high', status: 'done', attachments: [] },
  { id: 11, projectId: 4, title: '市场竞品调研', content: '调研周边竞品冰沙产品价格和口味', assigneeId: 4, assigneeName: '赵服务员', deadline: '2026-05-15', priority: 'medium', status: 'todo', attachments: [] },
  { id: 12, projectId: 4, title: '芒果冰沙配方开发', content: '调试芒果冰沙口味，确定果肉比例', assigneeId: 3, assigneeName: '王研发', deadline: '2026-05-25', priority: 'high', status: 'todo', attachments: [] },
  { id: 13, projectId: 7, title: '旧冰柜清理搬运', content: '清理旧冰柜库存，联系物流搬运', assigneeId: 2, assigneeName: '李店员', deadline: '2026-05-05', priority: 'high', status: 'in_progress', attachments: [] },
  { id: 14, projectId: 7, title: '新冰柜采购比价', content: '对比3家供应商报价和售后方案', assigneeId: 2, assigneeName: '李店员', deadline: '2026-05-10', priority: 'medium', status: 'todo', attachments: [] },
  { id: 15, projectId: 6, title: '粽子供应商联系', content: '联系粽子供应商洽谈团购价格', assigneeId: 4, assigneeName: '赵服务员', deadline: '2026-05-20', priority: 'medium', status: 'todo', attachments: [] },
  { id: 16, projectId: 5, title: '服务流程文档编写', content: '编写标准化服务流程SOP文档', assigneeId: 1, assigneeName: '张店长', deadline: '2026-03-15', priority: 'high', status: 'done', attachments: [] },
  { id: 17, projectId: 5, title: '员工实操考核', content: '对全体员工进行服务流程实操考核', assigneeId: 1, assigneeName: '张店长', deadline: '2026-03-28', priority: 'high', status: 'done', attachments: [] },
  { id: 18, projectId: 8, title: '数据汇总整理', content: '从收银系统导出并整理Q1所有数据', assigneeId: 4, assigneeName: '赵服务员', deadline: '2026-04-10', priority: 'medium', status: 'done', attachments: [] },
  { id: 19, projectId: 8, title: '营收报告撰写', content: '基于数据撰写Q1营收分析报告', assigneeId: 1, assigneeName: '张店长', deadline: '2026-04-14', priority: 'high', status: 'done', attachments: [] },
  { id: 20, projectId: 8, title: 'Q2策略建议', content: '基于Q1分析结果提出Q2经营改善建议', assigneeId: 1, assigneeName: '张店长', deadline: '2026-04-20', priority: 'medium', status: 'done', attachments: [] }
]

export const mockComments = [
  { id: 1, taskId: 4, userId: 1, content: '测评结果樱花粉奶茶得分最高，建议优先上线', time: '2026-04-18 10:30', userName: '张店长' },
  { id: 2, taskId: 4, userId: 3, content: '收到，我根据测评结果调整配方', time: '2026-04-18 11:00', userName: '王研发' },
  { id: 3, taskId: 7, userId: 5, content: '海报初稿已完成，需要店长确认', time: '2026-04-27 14:00', userName: '陈设计' },
  { id: 4, taskId: 7, userId: 1, content: '整体风格不错，把价格字体放大一些', time: '2026-04-27 15:20', userName: '张店长' }
]

export const mockProducts = [
  { id: 1, name: '樱花粉奶茶', formula: '红茶底 + 樱花酱 + 牛奶 + 淡奶油', materials: ['红茶', '樱花酱', '牛奶', '淡奶油'], testRecords: ['2026-04-10测试通过', '2026-04-15定版'], status: 'testing' },
  { id: 2, name: '芒果冰沙', formula: '芒果果肉 + 冰块 + 椰奶 + 炼乳', materials: ['芒果', '椰奶', '炼乳'], testRecords: ['2026-05-20测试中'], status: 'concept' }
]

export const mockEquipments = [
  { id: 1, name: '制冰机', location: '操作间', purchaseDate: '2025-01-15', nextMaintenance: '2026-04-20', status: 'maintaining' },
  { id: 2, name: '封口机', location: '操作台', purchaseDate: '2025-03-20', nextMaintenance: '2026-05-15', status: 'normal' },
  { id: 3, name: '冰柜', location: '储藏室', purchaseDate: '2024-11-10', nextMaintenance: '2026-06-01', status: 'normal' },
  { id: 4, name: '冷藏柜', location: '操作间', purchaseDate: '2025-06-05', nextMaintenance: '2026-05-20', status: 'maintaining' },
  { id: 5, name: '咖啡机', location: '吧台', purchaseDate: '2025-08-12', nextMaintenance: '2026-06-15', status: 'normal' }
]

export const mockMaterials = [
  { id: 1, name: '红茶', stock: 50, unit: 'kg', warningValue: 10, status: 'normal' },
  { id: 2, name: '牛奶', stock: 8, unit: '箱', warningValue: 10, status: 'warning' },
  { id: 3, name: '珍珠', stock: 3, unit: 'kg', warningValue: 5, status: 'warning' },
  { id: 4, name: '樱花酱', stock: 15, unit: '瓶', warningValue: 5, status: 'normal' },
  { id: 5, name: '芒果', stock: 2, unit: 'kg', warningValue: 8, status: 'warning' },
  { id: 6, name: '椰奶', stock: 20, unit: '罐', warningValue: 6, status: 'normal' },
  { id: 7, name: '淡奶油', stock: 5, unit: '盒', warningValue: 3, status: 'normal' }
]

// Monthly completion trend data (Jan - Jun 2026)
export const mockMonthlyTrend = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  projectsDone: [1, 2, 3, 5, 6, 8],
  tasksDone: [3, 6, 10, 16, 18, 20],
  projectsTotal: [3, 4, 5, 6, 7, 8],
  tasksTotal: [5, 8, 14, 18, 20, 20]
}

// Task status distribution
export const mockTaskDistribution = [
  { label: '待开始', value: 6, color: '#FF9F43' },
  { label: '进行中', value: 3, color: '#5352ED' },
  { label: '待验收', value: 0, color: '#7B68EE' },
  { label: '已完成', value: 11, color: '#2ED573' }
]

// Team member task counts
export const mockTeamTaskCounts = {
  labels: ['张店长', '李店员', '王研发', '赵服务员', '陈设计'],
  data: [8, 5, 3, 4, 3]
}

// Team radar performance data (scores 0-100)
export const mockTeamRadar = {
  labels: ['执行力', '专业度', '沟通力', '创新力', '协作力', '责任心'],
  datasets: [
    { name: '张店长', data: [92, 85, 90, 78, 88, 95], color: '#5352ED' },
    { name: '王研发', data: [80, 95, 70, 92, 75, 88], color: '#FF6B6B' },
    { name: '李店员', data: [88, 72, 82, 68, 85, 90], color: '#FF9F43' }
  ]
}

// Monthly revenue data (万元)
export const mockMonthlyRevenue = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  revenue: [4.2, 3.8, 5.1, 5.8, 6.3, 6.7],
  cost: [2.1, 1.9, 2.4, 2.7, 2.9, 3.1],
  profit: [2.1, 1.9, 2.7, 3.1, 3.4, 3.6]
}
