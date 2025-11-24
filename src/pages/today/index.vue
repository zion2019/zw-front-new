<template>
  <MacOSLayout>
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">
          📅 今日
        </h1>
        <p class="page-subtitle">
          {{ formattedDate }}
        </p>
      </div>

      <!-- 今日概览 -->
      <div class="today-overview">
        <div class="overview-card anime-element">
          <div class="overview-item">
            <div class="overview-icon">
              📚
            </div>
            <div class="overview-content">
              <div class="overview-label">
                学习进度
              </div>
              <div class="overview-value">
                {{ todayStats.learningProgress }}%
              </div>
            </div>
          </div>

          <div class="overview-item">
            <div class="overview-icon">
              ✅
            </div>
            <div class="overview-content">
              <div class="overview-label">
                任务完成
              </div>
              <div class="overview-value">
                {{ todayStats.tasksCompleted }} / {{ todayStats.totalTasks }}
              </div>
            </div>
          </div>

          <div class="overview-item">
            <div class="overview-icon">
              💰
            </div>
            <div class="overview-content">
              <div class="overview-label">
                今日支出
              </div>
              <div class="overview-value">
                ¥{{ todayStats.todaySpending }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 待办事项 -->
      <div class="section">
        <div class="section-header">
          <h2>待办事项</h2>
          <button class="add-btn" @click="addTask">
            + 添加
          </button>
        </div>

        <div v-if="tasks.length === 0" class="empty-state">
          <div class="empty-icon">
            📝
          </div>
          <p>暂无待办事项</p>
          <button class="macos-button" @click="addTask">
            创建第一个任务
          </button>
        </div>

        <div v-else class="tasks-list">
          <div
            v-for="task in tasks"
            :key="task.id"
            :class="[{ completed: task.completed }]"
            class="anime-element task-item"
          >
            <div class="task-checkbox" @click="toggleTask(task.id)">
              <span v-if="task.completed">✓</span>
            </div>
            <div class="task-content">
              <div class="task-title">
                {{ task.title }}
              </div>
              <div class="task-time">
                {{ task.time }}
              </div>
            </div>
            <div class="task-actions">
              <button class="action-btn" @click="editTask(task)">
                ✏️
              </button>
              <button class="action-btn" @click="deleteTask(task.id)">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 学习计划 -->
      <div class="section">
        <div class="section-header">
          <h2>学习计划</h2>
          <button class="add-btn" @click="addLearningPlan">
            + 添加
          </button>
        </div>

        <div v-if="learningPlans.length === 0" class="empty-state">
          <div class="empty-icon">
            📖
          </div>
          <p>暂无学习计划</p>
          <button class="macos-button" @click="addLearningPlan">
            制定学习计划
          </button>
        </div>

        <div v-else class="learning-plans">
          <div
            v-for="plan in learningPlans"
            :key="plan.id"
            class="plan-card anime-element"
          >
            <div class="plan-header">
              <h3>{{ plan.subject }}</h3>
              <span class="plan-time">{{ plan.duration }}分钟</span>
            </div>
            <p class="plan-description">
              {{ plan.description }}
            </p>
            <div class="plan-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: `${plan.progress}%` }"
                />
              </div>
              <span class="progress-text">{{ plan.progress }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 账单提醒 -->
      <div class="section">
        <div class="section-header">
          <h2>账单提醒</h2>
        </div>

        <div v-if="billReminders.length === 0" class="empty-state">
          <div class="empty-icon">
            💳
          </div>
          <p>暂无账单提醒</p>
        </div>

        <div v-else class="bill-reminders">
          <div
            v-for="bill in billReminders"
            :key="bill.id"
            class="bill-card anime-element"
          >
            <div class="bill-info">
              <div class="bill-title">
                {{ bill.title }}
              </div>
              <div class="bill-amount">
                ¥{{ bill.amount }}
              </div>
            </div>
            <div class="bill-due">
              <span class="due-date">{{ bill.dueDate }}</span>
              <span class="due-status" :class="[{ overdue: bill.isOverdue }]">
                {{ bill.isOverdue ? '已逾期' : '待支付' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MacOSLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MacOSLayout from '@/components/MacOSLayout.vue'

interface Task {
  id: number
  title: string
  completed: boolean
  time: string
}

interface LearningPlan {
  id: number
  subject: string
  description: string
  duration: number
  progress: number
}

interface BillReminder {
  id: number
  title: string
  amount: number
  dueDate: string
  isOverdue: boolean
}

// 今日数据
const todayStats = ref({
  learningProgress: 65,
  tasksCompleted: 3,
  totalTasks: 5,
  todaySpending: 128.5,
})

// 任务列表
const tasks = ref<Task[]>([
  { id: 1, title: '完成Vue项目开发', completed: true, time: '09:00' },
  { id: 2, title: '学习React Hooks', completed: false, time: '14:00' },
  { id: 3, title: '整理项目文档', completed: false, time: '16:00' },
])

// 学习计划
const learningPlans = ref<LearningPlan[]>([
  { id: 1, subject: 'JavaScript高级编程', description: '学习闭包和原型链', duration: 60, progress: 75 },
  { id: 2, subject: 'TypeScript实战', description: '类型系统和泛型', duration: 45, progress: 30 },
])

// 账单提醒
const billReminders = ref<BillReminder[]>([
  { id: 1, title: '电费', amount: 156.8, dueDate: '2025-11-15', isOverdue: false },
  { id: 2, title: '网费', amount: 89, dueDate: '2025-11-10', isOverdue: true },
])

// 计算格式化日期
const formattedDate = computed(() => {
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }
  return now.toLocaleDateString('zh-CN', options)
})

// 任务操作
function toggleTask(taskId: number) {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.completed = !task.completed
    // 更新统计数据
    todayStats.value.tasksCompleted = tasks.value.filter(t => t.completed).length
  }
}

function addTask() {
  const newTask: Task = {
    id: Date.now(),
    title: '新任务',
    completed: false,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  }
  tasks.value.unshift(newTask)
  todayStats.value.totalTasks = tasks.value.length
}

function editTask(task: Task) {
  const newTitle = prompt('修改任务标题:', task.title)
  if (newTitle) {
    task.title = newTitle
  }
}

function deleteTask(taskId: number) {
  tasks.value = tasks.value.filter(t => t.id !== taskId)
  todayStats.value.totalTasks = tasks.value.length
  todayStats.value.tasksCompleted = tasks.value.filter(t => t.completed).length
}

// 学习计划操作
function addLearningPlan() {
  const newPlan: LearningPlan = {
    id: Date.now(),
    subject: '新学科',
    description: '学习描述',
    duration: 30,
    progress: 0,
  }
  learningPlans.value.unshift(newPlan)
}

// 页面加载时初始化数据
onMounted(() => {
  console.log('今日页面加载完成')
})
</script>

<style scoped>
@import '../../theme/macos.css';

.page-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #333;
}

.page-subtitle {
  font-size: 16px;
  color: var(--macos-dark-gray);
  margin: 0;
}

.today-overview {
  margin-bottom: 30px;
}

.overview-card {
  background: white;
  border-radius: var(--macos-radius-large);
  padding: 24px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.overview-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.overview-icon {
  font-size: 32px;
}

.overview-content {
  display: flex;
  flex-direction: column;
}

.overview-label {
  font-size: 14px;
  color: var(--macos-dark-gray);
  margin-bottom: 4px;
}

.overview-value {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.add-btn {
  background: var(--macos-green);
  color: white;
  border: none;
  border-radius: var(--macos-radius);
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: #22b835;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--macos-dark-gray);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  background: white;
  border-radius: var(--macos-radius);
  padding: 16px;
  gap: 12px;
}

.task-item.completed {
  opacity: 0.6;
}

.task-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--macos-gray);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.task-checkbox:hover {
  border-color: var(--macos-green);
}

.task-checkbox span {
  color: var(--macos-green);
  font-weight: bold;
}

.task-content {
  flex: 1;
}

.task-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.task-time {
  font-size: 12px;
  color: var(--macos-dark-gray);
}

.task-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.action-btn:hover {
  opacity: 1;
}

.learning-plans {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.plan-card {
  background: white;
  border-radius: var(--macos-radius);
  padding: 20px;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.plan-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.plan-time {
  font-size: 14px;
  color: var(--macos-dark-gray);
}

.plan-description {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 14px;
}

.plan-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--macos-gray);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--macos-green);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: var(--macos-dark-gray);
  min-width: 40px;
}

.bill-reminders {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bill-card {
  background: white;
  border-radius: var(--macos-radius);
  padding: 16px;
}

.bill-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.bill-title {
  font-weight: 500;
}

.bill-amount {
  font-weight: 600;
  color: #e74c3c;
}

.bill-due {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.due-date {
  color: var(--macos-dark-gray);
}

.due-status {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  color: white;
  background: var(--macos-green);
}

.due-status.overdue {
  background: var(--macos-red);
}

@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .overview-card {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }

  .overview-item {
    justify-content: space-between;
    width: 100%;
  }

  .page-title {
    font-size: 24px;
  }
}
</style>
