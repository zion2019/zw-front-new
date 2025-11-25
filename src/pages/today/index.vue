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

      <!-- summary -->
      <div class="today-overview">
        <div class="overview-card anime-element card-base">
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

      <!-- task window -->
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

      <!-- learning window -->
      <div class="learning-section anime-element card-base">
        <div class="learning-header-custom">
          <div class="header-left">
            <span class="review-count" :class="reviewCountClass">
              <template v-if="reviewStatus.todaySubjectTotalCnt === 0">
                There is no subject to review today,enjoy!
              </template>
              <template v-else-if="reviewStatus.todaySubjectTotalCnt - reviewStatus.todayFinishedSubjectCnt === 0">
                Great! all subjects have been reviewed!
              </template>
              <template v-else>
                Today's subjects to review:
                <span class="number-bubble">{{ reviewStatus.todaySubjectTotalCnt - reviewStatus.todayFinishedSubjectCnt }}</span>
              </template>
            </span>
          </div>
          <div class="header-right" @click="goToLearning">
            <span class="learning-home-link">More →</span>
          </div>
        </div>

        <div class="learning-body-custom">
          <div v-if="reviewSubjects.length === 0" class="empty-learning-custom">
            <div class="empty-card">
              <div class="empty-icon">
                +
              </div>
            </div>
          </div>
          <div v-else class="subjects-container-custom">
            <div class="subjects-scroll-custom">
              <div
                v-for="subject in reviewSubjects"
                :key="subject.id"
                class="subject-card-custom"
                :style="{ backgroundImage: `url(${subject.coverImage})` }"
                @click="goToReview(subject)"
              >
                <div class="subject-overlay">
                  <div class="subject-title-custom">
                    {{ subject.title }}
                  </div>
                  <div class="subject-progress">
                    {{ subject.todayFinishedKnowledgeCnt }}/{{ subject.todayKnowledgeTotalCnt }}
                  </div>
                  <div class="review-btn" @click.stop="goToReview(subject)">
                    review >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- bill window -->
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
            class="bill-card anime-element card-base"
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
import type { ReviewSubject } from '@/api/learning'
import { computed, onMounted, ref } from 'vue'
import { getTodayReview } from '@/api/learning'
import MacOSLayout from '@/components/MacOSLayout.vue'

interface Task {
  id: number
  title: string
  completed: boolean
  time: string
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

// 学习复习数据
const reviewSubjects = ref<ReviewSubject[]>([])

// 复习数量文案和样式
const reviewStatus = ref({
  todayFinishedSubjectCnt: 0,
  todaySubjectTotalCnt: 0,
})

const reviewCountClass = computed(() => {
  const finished = reviewStatus.value.todayFinishedSubjectCnt
  const total = reviewStatus.value.todaySubjectTotalCnt
  const remaining = total - finished

  if (total === 0 || remaining === 0) {
    return 'text-green'
  }
  return 'text-warning'
})

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

// 获取今日复习数据
async function loadTodayReview() {
  try {
    const response = await getTodayReview()
    reviewSubjects.value = response.data.reviewSubjects
    reviewStatus.value = {
      todayFinishedSubjectCnt: response.data.todayFinishedSubjectCnt,
      todaySubjectTotalCnt: response.data.todaySubjectTotalCnt,
    }
    console.log('今日复习数据加载成功:', response.data)
  }
  catch (error) {
    console.error('加载今日复习数据失败:', error)
  }
}

// 去学习按钮点击处理
function goToLearning() {
  console.log('跳转到学习页面')
  // 这里可以添加路由跳转逻辑
  // router.push('/learning')
}

// 去复习点击处理
function goToReview(subject: ReviewSubject) {
  console.log('跳转到复习页面:', subject.title)
  // 这里可以添加路由跳转逻辑
  // router.push(`/review/${subject.id}`)
}

// 页面加载时初始化数据
onMounted(() => {
  loadTodayReview()
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

/* 公共卡片样式 */
.card-base {
  background: white;
  border-radius: var(--macos-radius-large);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.card-base:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
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

/* 学习计划新样式 */
.learning-section {
  height: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 30px;
  position: relative;
}

.learning-header-custom {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #f0f0f0;
}

.header-left .review-count {
  font-size: 18px;
  font-weight: 700;
}

.header-left .review-count.text-green {
  color: #4caf50;
}

.header-left .review-count.text-warning {
  color: #333;
}

.number-bubble {
  display: inline-block;
  background: #ff4757;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 13px;
  font-weight: 700;
  margin-left: 4px;
  min-width: 20px;
  text-align: center;
}

.header-right .learning-home-link {
  font-size: 15px;
  color: #999;
  cursor: pointer;
  transition: color 0.3s ease;
}

.header-right .learning-home-link:hover {
  color: #666;
}

/* 主体任务区 */
.learning-body-custom {
  flex: 1;
  overflow: hidden;
}

.empty-learning-custom {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.empty-card {
  width: 200px;
  height: 150px;
  background: #f8f8f8;
  border: 2px dashed #ddd;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-card .empty-icon {
  font-size: 48px;
  color: #ccc;
}

.subjects-container-custom {
  height: 100%;
  padding-left: 20px;
  overflow-x: auto;
  overflow-y: hidden;
}

.subjects-scroll-custom {
  display: flex;
  gap: 20px;
  height: 100%;
  align-items: center;
  padding: 8px 0;
}

.subject-card-custom {
  flex: 0 0 auto;
  width: 200px;
  height: 200px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.subject-card-custom:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.subject-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.subject-progress {
  font-size: 12px;
  color: white;
  font-weight: 600;
}

.subject-title-custom {
  font-size: 14px;
  color: white;
  font-weight: 500;
  flex: 1;
}

.review-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: #4caf50;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 10px;
  color: white;
  cursor: pointer;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
  font-weight: 500;
}

.review-btn:hover {
  background: #45a049;
  transform: scale(1.05);
}

/* 动画效果 */
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* 滚动条样式 - 简洁黑色圆角轨道 */
.subjects-container-custom::-webkit-scrollbar {
  height: 4px;
}

.subjects-container-custom::-webkit-scrollbar-track {
  background: #e0e0e0;
  border-radius: 2px;
}

.subjects-container-custom::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 2px;
}

.subjects-container-custom::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.bill-reminders {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bill-card {
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
