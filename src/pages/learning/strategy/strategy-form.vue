<template>
  <MacOSLayout>
    <div class="page-container">
      <div class="strategy-detail">
        <!-- 策略信息区域 (30%高度) -->
        <div class="strategy-info-section">
          <!-- 右上角编辑图标 -->
          <div class="edit-icon-wrapper" @click="editStrategy">
            <div class="i-carbon-edit text-black" />
          </div>

          <div class="strategy-content">
            <div class="strategy-name">
              {{ strategyInfo.name }}
            </div>
            <div class="strategy-description">
              {{ strategyInfo.description }}
            </div>
            <div class="strategy-meta">
              <div v-if="strategyInfo.isDefault" class="default-badge-large">
                <div class="i-carbon-star-filled text-yellow" />
                默认策略
              </div>
            </div>
          </div>
        </div>

        <!-- 间隔配置列表区域 (70%高度) -->
        <div class="interval-section">
          <div class="section-header">
            <div class="section-title">间隔配置</div>
            <div class="add-interval-btn" @click="addInterval">
              <div class="i-carbon-add text-white" />
            </div>
          </div>
          <div class="interval-list">
            <div
              v-for="interval in intervalList"
              :key="interval.id"
              class="interval-card anime-element card-base"
            >
              <div class="interval-header">
                <div class="interval-sequence">
                  <div class="sequence-badge">
                    {{ interval.sequence }}
                  </div>
                  <div class="interval-title">第 {{ interval.sequence }} 阶段</div>
                </div>
                <div class="interval-actions">
                  <div class="action-icon" @click="editInterval(interval)">
                    <div class="i-carbon-edit text-macos-blue" />
                  </div>
                  <div class="action-icon" @click="deleteInterval(interval)">
                    <div class="i-carbon-trash-can text-red-500" />
                  </div>
                </div>
              </div>
              <div class="interval-info">
                <div class="info-row">
                  <span class="info-label">间隔时间：</span>
                  <span class="info-value">{{ interval.intervalHours }} 小时</span>
                </div>
                <div class="info-row">
                  <span class="info-label">掌握程度：</span>
                  <span class="info-value mastery-badge" :class="getMasteryClass(interval.requiredMasteryLevel)">
                    {{ getMasteryText(interval.requiredMasteryLevel) }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="intervalList.length === 0" class="empty-state">
              <div class="empty-icon">
                <div class="i-carbon-list text-macos-gray" />
              </div>
              <div class="empty-text">
                暂无间隔配置，点击右上角添加
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MacOSLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MacOSLayout from '@/components/MacOSLayout.vue'

interface Strategy {
  id: number
  name: string
  description: string
  isDefault: boolean
}

interface Interval {
  id: number
  sequence: number
  intervalHours: number
  requiredMasteryLevel: 0 | 1 | 2 | 3
}

const strategyId = ref<number>(0)

// 策略信息
const strategyInfo = ref<Strategy>({
  id: 0,
  name: '',
  description: '',
  isDefault: false,
})

// 间隔配置列表
const intervalList = ref<Interval[]>([])

// 页面加载
onLoad((options: any) => {
  if (options.id) {
    strategyId.value = Number.parseInt(options.id, 10)
    loadStrategyDetail()
  } else {
    loadStrategyDetail()
  }
})

// 加载策略详情
function loadStrategyDetail() {
  // 模拟数据
  strategyInfo.value = {
    id: strategyId.value,
    name: strategyId.value ? `学习策略${strategyId.value} - 艾宾浩斯记忆法` : '学习策略 - 艾宾浩斯记忆法',
    description: '基于艾宾浩斯遗忘曲线，通过间隔重复复习来提高记忆效果。适合需要长期记忆的知识点。',
    isDefault: strategyId.value === 1,
  }

  // 模拟间隔配置数据
  intervalList.value = [
    { id: 1, sequence: 1, intervalHours: 1, requiredMasteryLevel: 0 },
    { id: 2, sequence: 2, intervalHours: 12, requiredMasteryLevel: 1 },
    { id: 3, sequence: 3, intervalHours: 24, requiredMasteryLevel: 2 },
    { id: 4, sequence: 4, intervalHours: 72, requiredMasteryLevel: 3 },
  ]
}

// 编辑策略
function editStrategy() {
  console.log('编辑策略:', strategyId.value)
  uni.navigateTo({
    url: `/pages/learning/strategy/strategy-form?id=${strategyId.value}`,
  })
}

// 添加间隔配置
function addInterval() {
  console.log('添加间隔配置')
  uni.navigateTo({
    url: `/pages/learning/strategy/strategy-interval?strategyId=${strategyId.value}`,
  })
}

// 编辑间隔配置
function editInterval(interval: Interval) {
  console.log('编辑间隔配置:', interval.id)
  uni.navigateTo({
    url: `/pages/learning/strategy/strategy-interval?strategyId=${strategyId.value}&id=${interval.id}`,
  })
}

// 删除间隔配置
function deleteInterval(interval: Interval) {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个间隔配置吗？',
    success: (res) => {
      if (res.confirm) {
        const index = intervalList.value.findIndex(item => item.id === interval.id)
        if (index > -1) {
          intervalList.value.splice(index, 1)
          uni.showToast({
            title: '删除成功',
            icon: 'success',
          })
        }
      }
    },
  })
}

// 获取掌握程度文本
function getMasteryText(level: number) {
  const map = {
    0: '陌生',
    1: '熟悉',
    2: '掌握',
    3: '精通',
  }
  return map[level as keyof typeof map] || '未知'
}

// 获取掌握程度样式类
function getMasteryClass(level: number) {
  const map = {
    0: 'mastery-stranger',
    1: 'mastery-familiar',
    2: 'mastery-understand',
    3: 'mastery-master',
  }
  return map[level as keyof typeof map] || ''
}
</script>

<style scoped>
@import '../../../theme/macos.css';

.page-container {
  padding: 0;
  max-width: 800px;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.strategy-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 策略信息区域 - 占30%高度 */
.strategy-info-section {
  position: relative;
  height: 30%;
  min-height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  display: flex;
  flex-direction: column;
}

/* 编辑图标 */
.edit-icon-wrapper {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.edit-icon-wrapper:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

/* 策略内容 */
.strategy-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
}

.strategy-name {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.strategy-description {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.strategy-meta {
  display: flex;
  align-items: center;
}

.default-badge-large {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

/* 间隔配置列表区域 - 占70%高度 */
.interval-section {
  flex: 1;
  overflow: hidden;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid var(--macos-gray);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.add-interval-btn {
  width: 32px;
  height: 32px;
  background: var(--macos-blue);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-interval-btn:hover {
  background: #0066cc;
  transform: scale(1.1);
}

.interval-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 20px;
}

.interval-card {
  padding: 16px;
  margin-bottom: 12px;
}

/* 公共卡片样式 */
.card-base {
  background: white;
  border-radius: var(--macos-radius-large);
  border: 2px solid #000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
}

.card-base:hover {
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.15);
  transform: translate(-2px, -2px);
}

.interval-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.interval-sequence {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sequence-badge {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.interval-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.interval-actions {
  display: flex;
  gap: 8px;
}

.action-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.05);
}

.action-icon:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

.interval-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 42px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.info-label {
  color: var(--macos-gray);
}

.info-value {
  color: #333;
  font-weight: 500;
}

.mastery-badge {
  padding: 2px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
}

.mastery-stranger {
  background: #f5f5f5;
  color: #666;
}

.mastery-familiar {
  background: #e3f2fd;
  color: #2196f3;
}

.mastery-understand {
  background: #fff3e0;
  color: #ff9800;
}

.mastery-master {
  background: #e8f5e9;
  color: #4caf50;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--macos-gray);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
}

/* 动画效果 */
.anime-element {
  transition: all 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .strategy-info-section {
    min-height: 180px;
    padding: 20px;
  }

  .strategy-name {
    font-size: 18px;
  }

  .strategy-description {
    font-size: 13px;
  }

  .interval-list {
    padding: 12px 16px 16px;
  }
}
</style>
