<template>
  <MacOSLayout>
    <div class="page-container">
      <!-- 策略列表 -->
      <z-paging
        ref="pagingRef"
        v-model="strategyList"
        :fixed="false"
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
import type { StrategyVO } from '@/service/learning/strategy'
import { ref } from 'vue'
import MacOSLayout from '@/components/MacOSLayout.vue'
import { pageUsingGet } from '@/service/learning/strategy'

// 策略列表数据
const strategyList = ref<StrategyVO[]>([])
const pagingRef = ref()

// 查询列表数据
async function queryList(pageNo: number, pageSize: number) {
  try {
    const res = await pageUsingGet({
      params: {
        pageNo,
        pageSize,
      },
    })

    const pageData = res as unknown as { dataList: any[], total: number }

    if (pageData) {
      const dataList = pageData.dataList || []
      const formattedList: StrategyVO[] = dataList.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        isDefault: item.isDefault,
      }))
      pagingRef.value?.complete(formattedList)
    }
    else {
      uni.showToast({
        title: '加载失败',
        icon: 'none',
      })
      pagingRef.value?.complete([])
    }
  }
  catch (error) {
    console.error('加载策略列表失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
    pagingRef.value?.complete([])
  }
}

// 跳转到策略详情
function goToStrategyDetail(strategy: StrategyVO) {
  uni.navigateTo({
    url: `/pages/learning/strategy/strategy-detail?id=${strategy.id}`,
  })
}

// 跳转到新增策略页面
function goToAddStrategy() {
  uni.navigateTo({
    url: '/pages/learning/strategy/strategy-edit',
  })
}
</script>

<style scoped>
@import '../../../theme/macos.css';

.page-container {
  padding: 20px;
  max-width: 800px;
  height: 100%;
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
    padding: 5px;
    height: 100%;
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
