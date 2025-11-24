<template>
  <MacOSLayout>
    <view class="learning-page">
      <!-- 学习头部 -->
      <view class="learning-header">
        <view class="progress-section">
          <text class="progress-title">学习进度</text>
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: learningProgress + '%' }"></view>
          </view>
          <text class="progress-text">{{ learningProgress }}%</text>
        </view>
        
        <view class="stats-grid">
          <view class="stat-item">
            <text class="stat-number">{{ learningStats.days }}</text>
            <text class="stat-label">连续学习</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ learningStats.hours }}</text>
            <text class="stat-label">学习时长</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ learningStats.courses }}</text>
            <text class="stat-label">完成课程</text>
          </view>
        </view>
      </view>

      <!-- 学习计划 -->
      <view class="learning-plan">
        <view class="section-title">
          <text>今日学习计划</text>
          <text class="add-plan" @click="showAddPlan = true">+ 添加计划</text>
        </view>
        
        <view class="plan-list">
          <view v-for="plan in todayPlans" :key="plan.id" class="plan-item">
            <view class="plan-checkbox" @click="togglePlan(plan.id)">
              <text v-if="plan.completed" class="checked">✓</text>
              <text v-else class="unchecked"></text>
            </view>
            
            <view class="plan-content">
              <text class="plan-title">{{ plan.title }}</text>
              <text class="plan-time">{{ plan.time }}</text>
              <text class="plan-duration">{{ plan.duration }}</text>
            </view>
            
            <view class="plan-actions">
              <text class="plan-edit" @click="editPlan(plan)">编辑</text>
              <text class="plan-delete" @click="deletePlan(plan.id)">删除</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 推荐课程 -->
      <view class="recommended-courses">
        <view class="section-title">推荐课程</view>
        
        <scroll-view class="courses-scroll" scroll-x="true">
          <view class="courses-list">
            <view v-for="course in recommendedCourses" :key="course.id" class="course-card">
              <image :src="course.cover" class="course-cover" mode="aspectFill" />
              <view class="course-info">
                <text class="course-title">{{ course.title }}</text>
                <text class="course-desc">{{ course.description }}</text>
                <view class="course-meta">
                  <text class="course-level">{{ course.level }}</text>
                  <text class="course-duration">{{ course.duration }}</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 学习记录 -->
      <view class="learning-history">
        <view class="section-title">学习记录</view>
        
        <view class="history-list">
          <view v-for="record in learningHistory" :key="record.id" class="history-item">
            <view class="history-icon">📚</view>
            <view class="history-content">
              <text class="history-title">{{ record.title }}</text>
              <text class="history-time">{{ record.time }}</text>
            </view>
            <view class="history-duration">{{ record.duration }}</view>
          </view>
        </view>
      </view>

      <!-- 添加计划模态框 -->
      <view v-if="showAddPlan" class="add-plan-modal">
        <view class="modal-content">
          <text class="modal-title">添加学习计划</text>
          
          <view class="form-group">
            <text class="label">计划内容</text>
            <input v-model="newPlan.title" placeholder="输入学习内容" class="plan-input" />
          </view>

          <view class="form-group">
            <text class="label">学习时间</text>
            <picker mode="time" @change="onTimeChange">
              <view class="time-picker">{{ newPlan.time || '选择时间' }}</view>
            </picker>
          </view>

          <view class="form-group">
            <text class="label">学习时长</text>
            <view class="duration-selector">
              <button 
                v-for="duration in durations" 
                :key="duration" 
                :class="['duration-btn', newPlan.duration === duration ? 'active' : '']"
                @click="newPlan.duration = duration"
              >
                {{ duration }}
              </button>
            </view>
          </view>

          <view class="modal-actions">
            <button @click="showAddPlan = false" class="cancel-btn">取消</button>
            <button @click="addPlan" class="confirm-btn">确认</button>
          </view>
        </view>
      </view>
    </view>
  </MacOSLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import MacOSLayout from '@/components/MacOSLayout.vue'

interface LearningPlan {
  id: number
  title: string
  time: string
  duration: string
  completed: boolean
}

interface Course {
  id: number
  title: string
  description: string
  cover: string
  level: string
  duration: string
}

interface LearningRecord {
  id: number
  title: string
  time: string
  duration: string
}

const learningProgress = ref(65)

const learningStats = reactive({
  days: 13,
  hours: '28.5',
  courses: 7
})

const todayPlans = ref<LearningPlan[]>([
  {
    id: 1,
    title: 'Vue.js 组件开发',
    time: '09:00',
    duration: '2小时',
    completed: true
  },
  {
    id: 2,
    title: 'TypeScript 高级类型',
    time: '14:00',
    duration: '1.5小时',
    completed: false
  },
  {
    id: 3,
    title: '算法与数据结构',
    time: '19:00',
    duration: '1小时',
    completed: false
  }
])

const recommendedCourses = ref<Course[]>([
  {
    id: 1,
    title: '前端工程化',
    description: '学习现代前端开发工具链',
    cover: '/static/course-1.jpg',
    level: '中级',
    duration: '15小时'
  },
  {
    id: 2,
    title: 'React Hooks',
    description: '掌握React函数式编程',
    cover: '/static/course-2.jpg',
    level: '中级',
    duration: '12小时'
  },
  {
    id: 3,
    title: 'Node.js实战',
    description: '构建高性能后端服务',
    cover: '/static/course-3.jpg',
    level: '高级',
    duration: '20小时'
  }
])

const learningHistory = ref<LearningRecord[]>([
  {
    id: 1,
    title: 'JavaScript 异步编程',
    time: '昨天 20:30',
    duration: '45分钟'
  },
  {
    id: 2,
    title: 'CSS Grid布局',
    time: '昨天 15:20',
    duration: '1小时'
  },
  {
    id: 3,
    title: 'Vue3 Composition API',
    time: '前天 19:00',
    duration: '2小时'
  }
])

const showAddPlan = ref(false)
const newPlan = reactive({
  title: '',
  time: '',
  duration: ''
})

const durations = ['30分钟', '1小时', '1.5小时', '2小时', '2.5小时', '3小时']

const togglePlan = (id: number) => {
  const plan = todayPlans.value.find(p => p.id === id)
  if (plan) {
    plan.completed = !plan.completed
    
    // 更新学习进度
    const completedCount = todayPlans.value.filter(p => p.completed).length
    learningProgress.value = Math.round((completedCount / todayPlans.value.length) * 100)
  }
}

const editPlan = (plan: LearningPlan) => {
  newPlan.title = plan.title
  newPlan.time = plan.time
  newPlan.duration = plan.duration
  showAddPlan.value = true
  
  // 在实际项目中，这里需要记录要编辑的plan id
}

const deletePlan = (id: number) => {
  uni.showModal({
    title: '删除计划',
    content: '确定要删除这个学习计划吗？',
    success: (res) => {
      if (res.confirm) {
        todayPlans.value = todayPlans.value.filter(p => p.id !== id)
      }
    }
  })
}

const onTimeChange = (e: any) => {
  newPlan.time = e.detail.value
}

const addPlan = () => {
  if (!newPlan.title.trim() || !newPlan.time || !newPlan.duration) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    })
    return
  }

  const plan: LearningPlan = {
    id: Date.now(),
    title: newPlan.title,
    time: newPlan.time,
    duration: newPlan.duration,
    completed: false
  }

  todayPlans.value.push(plan)
  
  // 重置表单
  newPlan.title = ''
  newPlan.time = ''
  newPlan.duration = ''
  showAddPlan.value = false
  
  uni.showToast({
    title: '添加成功',
    icon: 'success'
  })
}
</script>

<style lang="scss" scoped>
.learning-page {
  padding: 20rpx;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.learning-header {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.progress-section {
  margin-bottom: 30rpx;
}

.progress-title {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
}

.progress-bar {
  width: 100%;
  height: 12rpx;
  background: #f0f0f0;
  border-radius: 6rpx;
  overflow: hidden;
  margin-bottom: 10rpx;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 6rpx;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 24rpx;
  color: #667eea;
  font-weight: bold;
}

.stats-grid {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 22rpx;
  color: #666;
}

.learning-plan,
.recommended-courses,
.learning-history {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  
  & > text:first-child {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
  }
  
  .add-plan {
    font-size: 24rpx;
    color: #667eea;
  }
}

.plan-list {
  .plan-item {
    display: flex;
    align-items: center;
    padding: 25rpx 0;
    border-bottom: 1rpx solid #f8f8f8;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .plan-checkbox {
    margin-right: 20rpx;
    
    .checked {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40rpx;
      height: 40rpx;
      background: #4CAF50;
      color: white;
      border-radius: 50%;
      font-size: 24rpx;
    }
    
    .unchecked {
      display: block;
      width: 40rpx;
      height: 40rpx;
      border: 2rpx solid #ddd;
      border-radius: 50%;
    }
  }
  
  .plan-content {
    flex: 1;
  }
  
  .plan-title {
    display: block;
    font-size: 26rpx;
    color: #333;
    margin-bottom: 5rpx;
  }
  
  .plan-time,
  .plan-duration {
    display: block;
    font-size: 22rpx;
    color: #666;
  }
  
  .plan-actions {
    display: flex;
    gap: 20rpx;
  }
  
  .plan-edit,
  .plan-delete {
    font-size: 22rpx;
    color: #667eea;
  }
  
  .plan-delete {
    color: #F44336;
  }
}

.courses-scroll {
  white-space: nowrap;
}

.courses-list {
  display: inline-flex;
  gap: 20rpx;
}

.course-card {
  width: 280rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  overflow: hidden;
}

.course-cover {
  width: 100%;
  height: 160rpx;
}

.course-info {
  padding: 20rpx;
}

.course-title {
  display: block;
  font-size: 24rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.course-desc {
  display: block;
  font-size: 20rpx;
  color: #666;
  margin-bottom: 10rpx;
  white-space: normal;
}

.course-meta {
  display: flex;
  justify-content: space-between;
}

.course-level,
.course-duration {
  font-size: 18rpx;
  color: #999;
}

.history-list {
  .history-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f8f8f8;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .history-icon {
    font-size: 32rpx;
    margin-right: 20rpx;
  }
  
  .history-content {
    flex: 1;
  }
  
  .history-title {
    display: block;
    font-size: 24rpx;
    color: #333;
    margin-bottom: 5rpx;
  }
  
  .history-time {
    font-size: 20rpx;
    color: #999;
  }
  
  .history-duration {
    font-size: 22rpx;
    color: #667eea;
  }
}

.add-plan-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  width: 80%;
  max-width: 600rpx;
}

.modal-title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
  color: #333;
}

.form-group {
  margin-bottom: 30rpx;
}

.label {
  display: block;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.plan-input {
  width: 100%;
  padding: 20rpx;
  border: 2rpx solid #ddd;
  border-radius: 10rpx;
  font-size: 26rpx;
}

.time-picker {
  padding: 20rpx;
  border: 2rpx solid #ddd;
  border-radius: 10rpx;
  background: white;
}

.duration-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10rpx;
}

.duration-btn {
  padding: 15rpx;
  border: 2rpx solid #ddd;
  border-radius: 8rpx;
  background: white;
  font-size: 22rpx;
  color: #666;
  
  &.active {
    border-color: #667eea;
    background: #667eea;
    color: white;
  }
}

.modal-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 10rpx;
  font-size: 26rpx;
}

.cancel-btn {
  background: #f0f0f0;
  color: #666;
}

.confirm-btn {
  background: #667eea;
  color: white;
}
</style>