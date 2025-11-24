<template>
  <MacOSLayout>
    <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">✅ 任务管理</h1>
      <p class="page-subtitle">高效管理您的待办事项</p>
    </div>

    <!-- 任务统计 -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card anime-element">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <div class="stat-value">{{ taskStats.total }}</div>
            <div class="stat-label">总任务数</div>
          </div>
        </div>
        
        <div class="stat-card anime-element">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ taskStats.completed }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </div>
        
        <div class="stat-card anime-element">
          <div class="stat-icon">⏰</div>
          <div class="stat-content">
            <div class="stat-value">{{ taskStats.pending }}</div>
            <div class="stat-label">待完成</div>
          </div>
        </div>
        
        <div class="stat-card anime-element">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <div class="stat-value">{{ taskStats.overdue }}</div>
            <div class="stat-label">已逾期</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务过滤 -->
    <div class="filter-section">
      <div class="filter-tabs">
        <button 
          v-for="tab in filterTabs" 
          :key="tab.value"
          :class="['filter-tab', { active: activeFilter === tab.value }]"
          @click="setFilter(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索任务..."
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="tasks-section">
      <div class="section-header">
        <h2>{{ getFilterTitle() }}</h2>
        <button class="add-btn" @click="showAddTaskModal = true">+ 添加任务</button>
      </div>
      
      <div v-if="filteredTasks.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <p>暂无任务</p>
        <button class="macos-button" @click="showAddTaskModal = true">创建第一个任务</button>
      </div>
      
      <div v-else class="tasks-list">
        <div 
          v-for="task in filteredTasks" 
          :key="task.id"
          :class="['task-card', { 
            completed: task.completed,
            overdue: task.isOverdue,
            'high-priority': task.priority === 'high'
          }]"
          class="anime-element"
        >
          <div class="task-main">
            <div class="task-checkbox" @click="toggleTask(task.id)">
              <span v-if="task.completed">✓</span>
            </div>
            
            <div class="task-content">
              <div class="task-title">{{ task.title }}</div>
              <div class="task-description">{{ task.description }}</div>
              
              <div class="task-meta">
                <span class="task-priority" :class="task.priority">
                  {{ getPriorityLabel(task.priority) }}
                </span>
                <span class="task-due">截止: {{ formatDate(task.dueDate) }}</span>
              </div>
            </div>
            
            <div class="task-actions">
              <button class="action-btn" @click="editTask(task)">✏️</button>
              <button class="action-btn" @click="deleteTask(task.id)">🗑️</button>
            </div>
          </div>
          
          <div v-if="task.tags && task.tags.length > 0" class="task-tags">
            <span 
              v-for="tag in task.tags" 
              :key="tag"
              class="task-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加任务模态框 -->
    <div v-if="showAddTaskModal" class="modal-overlay" @click="showAddTaskModal = false">
      <div class="modal-content anime-element" @click.stop>
        <div class="modal-header">
          <h3>{{ editingTask ? '编辑任务' : '添加新任务' }}</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="saveTask" class="task-form">
          <div class="form-group">
            <label>任务标题 *</label>
            <input 
              v-model="taskForm.title" 
              type="text" 
              placeholder="输入任务标题"
              required
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>任务描述</label>
            <textarea 
              v-model="taskForm.description" 
              placeholder="任务详细描述（可选）"
              class="form-textarea"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>优先级</label>
              <select v-model="taskForm.priority" class="form-select">
                <option value="low">低</option>
                <option value="normal">普通</option>
                <option value="high">高</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>截止日期</label>
              <input 
                v-model="taskForm.dueDate" 
                type="date" 
                class="form-input"
              />
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="cancel-btn">取消</button>
            <button type="submit" class="macos-button save-btn">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</MacOSLayout>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'

interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'normal' | 'high'
  dueDate: string
  tags: string[]
  isOverdue: boolean
  createdAt: string
}

interface TaskStats {
  total: number
  completed: number
  pending: number
  overdue: number
}

// 任务数据
const tasks = ref<Task[]>([
  {
    id: 1,
    title: '完成项目需求文档',
    description: '整理项目需求并编写详细文档',
    completed: true,
    priority: 'high',
    dueDate: '2025-11-10',
    tags: ['工作', '文档'],
    isOverdue: false,
    createdAt: '2025-11-08'
  },
  {
    id: 2,
    title: '学习Vue 3新特性',
    description: '掌握Composition API和响应式系统',
    completed: false,
    priority: 'normal',
    dueDate: '2025-11-20',
    tags: ['学习', '技术'],
    isOverdue: false,
    createdAt: '2025-11-09'
  },
  {
    id: 3,
    title: '准备技术分享会议',
    description: '准备下周团队技术分享的内容',
    completed: false,
    priority: 'high',
    dueDate: '2025-11-08',
    tags: ['会议', '分享'],
    isOverdue: true,
    createdAt: '2025-11-05'
  }
])

// 任务统计
const taskStats = computed<TaskStats>(() => {
  const total = tasks.value.length
  const completed = tasks.value.filter(t => t.completed).length
  const pending = total - completed
  const overdue = tasks.value.filter(t => t.isOverdue && !t.completed).length
  
  return { total, completed, pending, overdue }
})

// 过滤和搜索
const activeFilter = ref<'all' | 'active' | 'completed' | 'overdue'>('all')
const searchQuery = ref('')

const filterTabs = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'overdue', label: '已逾期' }
]

const filteredTasks = computed(() => {
  let filtered = tasks.value
  
  // 按状态过滤
  if (activeFilter.value === 'active') {
    filtered = filtered.filter(t => !t.completed)
  } else if (activeFilter.value === 'completed') {
    filtered = filtered.filter(t => t.completed)
  } else if (activeFilter.value === 'overdue') {
    filtered = filtered.filter(t => t.isOverdue)
  }
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  return filtered.sort((a, b) => {
    // 高优先级和逾期任务优先显示
    if (a.priority === 'high' && b.priority !== 'high') return -1
    if (a.priority !== 'high' && b.priority === 'high') return 1
    if (a.isOverdue && !b.isOverdue) return -1
    if (!a.isOverdue && b.isOverdue) return 1
    
    // 按截止日期排序
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })
})

// 任务表单
const taskForm = reactive({
  title: '',
  description: '',
  priority: 'normal' as 'low' | 'normal' | 'high',
  dueDate: ''
})

const showAddTaskModal = ref(false)
const editingTask = ref<Task | null>(null)

// 操作方法
const setFilter = (filter: 'all' | 'active' | 'completed' | 'overdue') => {
  activeFilter.value = filter
}

const getFilterTitle = () => {
  const tab = filterTabs.find(t => t.value === activeFilter.value)
  return tab ? tab.label + '任务' : '所有任务'
}

const getPriorityLabel = (priority: string) => {
  const labels = { low: '低', normal: '普通', high: '高' }
  return labels[priority as keyof typeof labels]
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const toggleTask = (taskId: number) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.completed = !task.completed
  }
}

const addTask = () => {
  editingTask.value = null
  Object.assign(taskForm, {
    title: '',
    description: '',
    priority: 'normal',
    dueDate: new Date().toISOString().split('T')[0]
  })
  showAddTaskModal.value = true
}

const editTask = (task: Task) => {
  editingTask.value = task
  Object.assign(taskForm, {
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate
  })
  showAddTaskModal.value = true
}

const saveTask = () => {
  if (!taskForm.title.trim()) {
    alert('请输入任务标题')
    return
  }
  
  if (editingTask.value) {
    // 编辑现有任务
    Object.assign(editingTask.value, {
      title: taskForm.title,
      description: taskForm.description,
      priority: taskForm.priority,
      dueDate: taskForm.dueDate
    })
  } else {
    // 添加新任务
    const newTask: Task = {
      id: Date.now(),
      title: taskForm.title,
      description: taskForm.description,
      completed: false,
      priority: taskForm.priority,
      dueDate: taskForm.dueDate,
      tags: [],
      isOverdue: new Date(taskForm.dueDate) < new Date(),
      createdAt: new Date().toISOString().split('T')[0]
    }
    tasks.value.unshift(newTask)
  }
  
  closeModal()
}

const deleteTask = (taskId: number) => {
  if (confirm('确定要删除这个任务吗？')) {
    tasks.value = tasks.value.filter(t => t.id !== taskId)
  }
}

const closeModal = () => {
  showAddTaskModal.value = false
  editingTask.value = null
}

// 页面加载时检查任务逾期状态
onMounted(() => {
  tasks.value.forEach(task => {
    task.isOverdue = new Date(task.dueDate) < new Date() && !task.completed
  })
})
</script>

<style scoped>
@import '../theme/macos.css';

.page-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: var(--macos-radius);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 32px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: var(--macos-dark-gray);
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-tab {
  padding: 8px 16px;
  border: 1px solid var(--macos-gray);
  border-radius: var(--macos-radius);
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tab.active {
  background: var(--macos-green);
  color: white;
  border-color: var(--macos-green);
}

.search-box {
  position: relative;
  width: 250px;
}

.search-input {
  width: 100%;
  padding: 8px 16px 8px 40px;
  border: 1px solid var(--macos-gray);
  border-radius: var(--macos-radius);
  font-size: 14px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.tasks-section {
  margin-bottom: 30px;
}

.task-card {
  background: white;
  border-radius: var(--macos-radius);
  padding: 20px;
  margin-bottom: 16px;
  border-left: 4px solid transparent;
}

.task-card.high-priority {
  border-left-color: var(--macos-red);
}

.task-card.overdue:not(.completed) {
  border-left-color: var(--macos-yellow);
}

.task-card.completed {
  opacity: 0.6;
}

.task-main {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.task-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.task-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
}

.task-priority {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  color: white;
}

.task-priority.low {
  background: var(--macos-green);
}

.task-priority.normal {
  background: var(--macos-yellow);
}

.task-priority.high {
  background: var(--macos-red);
}

.task-due {
  color: var(--macos-dark-gray);
}

.task-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.task-tag {
  background: var(--macos-gray);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  color: #666;
}

/* 模态框样式 */
.modal-content {
  background: white;
  border-radius: var(--macos-radius-large);
  padding: 30px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-textarea {
  width: 100%;
  height: 80px;
  padding: 12px;
  border: 1px solid var(--macos-gray);
  border-radius: var(--macos-radius);
  font-size: 14px;
  resize: vertical;
}

.form-select {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--macos-gray);
  border-radius: var(--macos-radius);
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

.cancel-btn {
  padding: 10px 20px;
  border: 1px solid var(--macos-gray);
  border-radius: var(--macos-radius);
  background: white;
  cursor: pointer;
}

.save-btn {
  padding: 10px 20px;
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    width: 100%;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>