<template>
  <div class="stage-container">
    <z-paging
      ref="pagingRef"
      v-model="stageList"
      :fixed="false"
      height="400px"
      :auto-show-back-to-top="true"
      @query="queryList"
    >
      <div class="stage-list">
        <div
          v-for="stage in stageList"
          :key="stage.id"
          class="stage-card anime-element card-base"
        >
          <div class="stage-name">
            {{ stage.name }}
          </div>
          <div class="stage-description">
            {{ stage.description }}
          </div>
          <div class="stage-meta">
            <div class="meta-item">
              <span class="meta-label">知识点数：</span>
              <span class="meta-value">{{ stage.knowledgePointCnt }}</span>
            </div>
            <div class="status-bubble" :class="[`status-${stage.status}`]">
              {{ getStatusText(stage.status) }}
            </div>
          </div>
        </div>
      </div>
    </z-paging>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Stage {
  id: number
  name: string
  description: string
  knowledgePointCnt: number
  status: 'learning' | 'delayed' | 'mastered'
}

defineProps<{
  subjectId: number
}>()

// 阶段列表数据
const stageList = ref<Stage[]>([])
const pagingRef = ref()

// 获取状态文本
function getStatusText(status: string) {
  const statusMap: { [key: string]: string } = {
    learning: '学习中',
    delayed: '延期',
    mastered: '已掌握',
  }
  return statusMap[status] || '学习中'
}

// 查询列表数据
function queryList(pageNo: number, pageSize: number) {
  // 模拟异步请求
  setTimeout(() => {
    const mockData: Stage[] = Array.from({ length: pageSize }, (_, index) => ({
      id: (pageNo - 1) * pageSize + index + 1,
      name: `阶段 ${(pageNo - 1) * pageSize + index + 1}，这是一个很长的阶段名称测试，用于展示缩略效果`,
      description: `这是阶段 ${(pageNo - 1) * pageSize + index + 1} 的描述信息，用于展示阶段详情`,
      knowledgePointCnt: Math.floor(Math.random() * 50) + 10,
      status: ['learning', 'delayed', 'mastered'][Math.floor(Math.random() * 3)] as any,
    }))

    pagingRef.value?.complete(mockData)
  }, 500)
}
</script>

<style scoped>
@import '../../../theme/macos.css';

.stage-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 阶段列表 */
.stage-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 20px;
}

.stage-card {
  padding: 16px;
  cursor: pointer;
  border: 2px solid #000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stage-card:hover {
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.15);
  transform: translate(-2px, -2px);
}

/* 公共卡片样式 */
.card-base {
  background: white;
  border-radius: var(--macos-radius-large);
}

.stage-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stage-description {
  font-size: 13px;
  color: var(--macos-dark-gray);
  margin-bottom: 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

.stage-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-item {
  font-size: 12px;
  color: var(--macos-dark-gray);
}

.meta-label {
  color: var(--macos-gray);
}

.meta-value {
  color: #333;
  font-weight: 500;
}

/* 状态气泡 */
.status-bubble {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.status-learning {
  background: #e3f2fd;
  color: var(--macos-blue);
}

.status-delayed {
  background: #fff3e0;
  color: #f57c00;
}

.status-mastered {
  background: #e8f5e9;
  color: #43a047;
}

/* 动画效果 */
.anime-element {
  transition: all 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stage-card {
    padding: 14px;
  }

  .stage-name {
    font-size: 15px;
  }

  .stage-description {
    font-size: 12px;
  }
}
</style>
