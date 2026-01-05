<template>
  <div class="knowledge-container">
    <z-paging
      ref="pagingRef"
      v-model="knowledgeList"
      :fixed="false"
      :height="listHeight"
      :auto-show-back-to-top="true"
      @query="queryList"
    >
      <div class="knowledge-list">
        <div
          v-for="knowledge in knowledgeList"
          :key="knowledge.id"
          class="knowledge-card anime-element card-base"
          @click="goToKnowledgeDetail(knowledge)"
        >
          <div class="knowledge-name">
            {{ knowledge.name }}
          </div>
          <div class="knowledge-description">
            {{ knowledge.description }}
          </div>
          <div class="knowledge-meta">
            <div class="status-bubble" :class="[`status-${knowledge.status}`]">
              {{ getStatusText(knowledge.status) }}
            </div>
          </div>
        </div>
      </div>
    </z-paging>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Knowledge {
  id: number
  name: string
  description: string
  status: 'learning' | 'mastered' | 'reviewing'
}

defineProps<{
  stageId: number
}>()

// 知识点列表数据
const knowledgeList = ref<Knowledge[]>([])
const pagingRef = ref()

// 列表高度（由父组件传入）
const listHeight = ref('400px')

// 获取状态文本
function getStatusText(status: string) {
  const statusMap: { [key: string]: string } = {
    learning: '学习中',
    mastered: '已掌握',
    reviewing: '复习中',
  }
  return statusMap[status] || '学习中'
}

// 查询列表数据
function queryList(pageNo: number, pageSize: number) {
  // 模拟异步请求
  setTimeout(() => {
    const mockData: Knowledge[] = Array.from({ length: pageSize }, (_, index) => ({
      id: (pageNo - 1) * pageSize + index + 1,
      name: `知识点 ${(pageNo - 1) * pageSize + index + 1}，这是一个很长的知识点名称测试，用于展示缩略效果`,
      description: `这是知识点 ${(pageNo - 1) * pageSize + index + 1} 的描述信息，用于展示知识点详情`,
      status: ['learning', 'mastered', 'reviewing'][Math.floor(Math.random() * 3)] as any,
    }))

    pagingRef.value?.complete(mockData)
  }, 500)
}

// 跳转到知识点详情
function goToKnowledgeDetail(knowledge: Knowledge) {
  console.log('跳转到知识点详情:', knowledge.id)
  uni.navigateTo({
    url: `/pages/learning/knowledge/knowledge-det?id=${knowledge.id}`,
  })
}
</script>

<style scoped>
@import '../../../theme/macos.css';

.knowledge-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 知识点列表 */
.knowledge-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 20px;
}

.knowledge-card {
  padding: 16px;
  cursor: pointer;
}

.knowledge-card:hover {
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.15);
  transform: translate(-2px, -2px);
}

/* 公共卡片样式 */
.card-base {
  background: white;
  border-radius: var(--macos-radius-large);
}

.knowledge-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.knowledge-description {
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

.knowledge-meta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
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

.status-mastered {
  background: #e8f5e9;
  color: #43a047;
}

.status-reviewing {
  background: #fff3e0;
  color: #f57c00;
}

/* 动画效果 */
.anime-element {
  transition: all 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .knowledge-card {
    padding: 14px;
  }

  .knowledge-name {
    font-size: 15px;
  }

  .knowledge-description {
    font-size: 12px;
  }
}
</style>
