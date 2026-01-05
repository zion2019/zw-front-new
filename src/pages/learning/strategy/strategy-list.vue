<template>
  <MacOSLayout>
    <div class="page-container">
      <!-- 策略列表 -->
      <z-paging
        ref="pagingRef"
        v-model="strategyList"
        :auto-show-back-to-top="true"
        @query="queryList"
      >
        <div class="strategy-list">
          <div
            v-for="strategy in strategyList"
            :key="strategy.id"
            class="strategy-card anime-element card-base"
            @click="goToStrategyDetail(strategy)"
          >
            <div class="strategy-header">
              <div class="strategy-name">
                {{ strategy.name }}
              </div>
              <div v-if="strategy.isDefault" class="default-badge">
                <div class="i-carbon-star-filled text-yellow" />
                默认
              </div>
            </div>
            <div class="strategy-description">
              {{ strategy.description }}
            </div>
          </div>
        </div>
      </z-paging>

      <!-- 右下角悬浮新增按钮 -->
      <div class="floating-add-btn" @click="goToAddStrategy">
        <div class="i-carbon-add text-white" />
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

// 策略列表数据
const strategyList = ref<Strategy[]>([])
const pagingRef = ref()

// 查询列表数据
function queryList(pageNo: number, pageSize: number) {
  // 模拟异步请求
  setTimeout(() => {
    const mockData: Strategy[] = Array.from({ length: pageSize }, (_, index) => {
      const id = (pageNo - 1) * pageSize + index + 1
      return {
        id,
        name: `学习策略${id} - 艾宾浩斯记忆法`,
        description: '基于艾宾浩斯遗忘曲线，通过间隔重复复习来提高记忆效果。适合需要长期记忆的知识点。',
        isDefault: id === 1,
      }
    })

    pagingRef.value?.complete(mockData)
  }, 500)
}

// 跳转到策略详情
function goToStrategyDetail(strategy: Strategy) {
  console.log('跳转到策略详情:', strategy.id)
  uni.navigateTo({
    url: `/pages/learning/strategy/strategy-form?id=${strategy.id}`,
  })
}

// 跳转到新增策略页面
function goToAddStrategy() {
  uni.navigateTo({
    url: '/pages/learning/strategy/strategy-form',
  })
}
</script>

<style scoped>
@import '../../../theme/macos.css';

.page-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  top: 10px;
}

/* 策略列表 */
.strategy-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.strategy-card {
  padding: 20px;
  cursor: pointer;
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

.strategy-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.strategy-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.default-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
  margin-left: 12px;
  box-shadow: 0 2px 4px rgba(255, 170, 0, 0.3);
}

.strategy-description {
  font-size: 14px;
  color: var(--macos-dark-gray);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 动画效果 */
.anime-element {
  transition: all 0.3s ease;
}

/* 右下角悬浮新增按钮 */
.floating-add-btn {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 56px;
  height: 56px;
  background: var(--macos-blue);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  background: rgba(0, 122, 255, 0.85);
  z-index: 100;
}

.floating-add-btn:hover {
  background: rgba(0, 122, 255, 1);
  transform: scale(1.1);
}

.floating-add-btn:active {
  transform: scale(1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .strategy-card {
    padding: 16px;
  }

  .strategy-name {
    font-size: 16px;
  }

  .strategy-description {
    font-size: 13px;
  }

  .floating-add-btn {
    right: 20px;
    bottom: 20px;
    width: 50px;
    height: 50px;
  }
}
</style>
