<template>
  <div class="break-down-container">
    <z-paging
      ref="pagingRef"
      v-model="breakDownList"
      :fixed="false"
      height="57vh"
      :auto-show-back-to-top="true"
      @query="queryList"
    >
      <div class="break-down-list">
        <div
          v-for="breakDown in breakDownList"
          :key="breakDown.id"
          class="break-down-card anime-element card-base"
          @click="goToBreakDownDetail(breakDown)"
        >
          <div class="break-down-name">
            {{ breakDown.name }}
          </div>
          <div class="break-down-content" v-html="stripHtmlTags(breakDown.content)" />
          <div class="break-down-meta">
            <div class="status-bubble" :class="[`status-${breakDown.status}`]">
              {{ getStatusText(breakDown.status) }}
            </div>
          </div>
        </div>
      </div>
    </z-paging>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface BreakDown {
  id: number
  name: string
  content: string
  status: 'pending' | 'completed'
}

defineProps<{
  knowledgeId: number
}>()

// 拆解列表数据
const breakDownList = ref<BreakDown[]>([])
const pagingRef = ref()

// 移除 HTML 标签，提取纯文本内容
function stripHtmlTags(html: string) {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || ''
}

// 获取状态文本
function getStatusText(status: string) {
  const statusMap: { [key: string]: string } = {
    pending: '待完成',
    completed: '已完成',
  }
  return statusMap[status] || '待完成'
}

// 查询列表数据
function queryList(pageNo: number, pageSize: number) {
  // 模拟异步请求
  setTimeout(() => {
    const mockData: BreakDown[] = Array.from({ length: pageSize }, (_, index) => ({
      id: (pageNo - 1) * pageSize + index + 1,
      name: `拆解点 ${(pageNo - 1) * pageSize + index + 1}，这是一个很长的拆解点名称测试，用于展示缩略效果`,
      content: `<p>这是拆解点 ${(pageNo - 1) * pageSize + index + 1} 的富文本内容，用于展示拆解点详情。</p><p>这里是一段较长的文字内容，测试多行显示和缩略效果。当内容超过指定行数时，应该显示省略号。</p>`,
      status: ['pending', 'completed'][Math.floor(Math.random() * 2)] as any,
    }))

    pagingRef.value?.complete(mockData)
  }, 500)
}

// 跳转到拆解点详情
function goToBreakDownDetail(breakDown: BreakDown) {
  console.log('跳转到拆解点详情:', breakDown.id)
  uni.navigateTo({
    url: `/pages/learning/break-down/break-down-det?id=${breakDown.id}`,
  })
}
</script>

<style scoped>
@import '../../../theme/macos.css';

.break-down-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 拆解列表 */
.break-down-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 20px;
}

.break-down-card {
  padding: 16px;
  cursor: pointer;
}

.break-down-card:hover {
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.15);
  transform: translate(-2px, -2px);
}

/* 公共卡片样式 */
.card-base {
  background: white;
  border-radius: var(--macos-radius-large);
}

.break-down-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.break-down-content {
  font-size: 13px;
  color: var(--macos-dark-gray);
  margin-bottom: 12px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 4;
}

.break-down-meta {
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

.status-pending {
  background: #e3f2fd;
  color: var(--macos-blue);
}

.status-completed {
  background: #e8f5e9;
  color: #43a047;
}

/* 动画效果 */
.anime-element {
  transition: all 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .break-down-card {
    padding: 14px;
  }

  .break-down-name {
    font-size: 15px;
  }

  .break-down-content {
    font-size: 12px;
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }
}
</style>
