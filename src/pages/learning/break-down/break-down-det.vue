<template>
  <MacOSLayout>
    <div class="page-container">
      <div class="break-down-detail">
        <!-- 拆解点信息区域 (30%高度) -->
        <div class="break-down-info-section">
          <!-- 右上角编辑图标 -->
          <div class="edit-icon-wrapper" @click="editBreakDown">
            <div class="i-carbon-edit text-black" />
          </div>

          <div class="break-down-content">
            <!-- 所属学科 -->
            <div class="info-tag subject-tag">
              <div class="info-tag-icon">
                <div class="i-carbon-book text-white" />
              </div>
              <span class="info-tag-text">{{ breakDownInfo.subjectName }}</span>
            </div>

            <!-- 所属阶段 -->
            <div class="info-tag stage-tag">
              <div class="info-tag-icon">
                <div class="i-carbon-list-boxes text-white" />
              </div>
              <span class="info-tag-text">{{ breakDownInfo.stageName }}</span>
            </div>

            <!-- 所属知识点 -->
            <div class="info-tag knowledge-tag">
              <div class="info-tag-icon">
                <div class="i-carbon-document text-white" />
              </div>
              <span class="info-tag-text">{{ breakDownInfo.knowledgeName }}</span>
            </div>

            <div class="break-down-name">
              {{ breakDownInfo.name }}
            </div>
            <div class="break-down-meta">
              <div class="meta-item">
                <span class="meta-label">优先级：</span>
                <span class="meta-value">{{ getPriorityText(breakDownInfo.priority) }}</span>
              </div>
              <div class="status-bubble" :class="[`status-${breakDownInfo.status}`]">
                {{ getStatusText(breakDownInfo.status) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 拆解点内容区域 (70%高度) -->
        <div class="break-down-content-section">
          <div class="content-wrapper">
            <div class="content-title">
              拆解点内容
            </div>
            <div class="rich-content" v-html="breakDownInfo.content" />
          </div>
        </div>
      </div>
    </div>
  </MacOSLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MacOSLayout from '@/components/MacOSLayout.vue'

const breakDownId = ref<number>(0)

// 拆解点信息
const breakDownInfo = ref({
  id: 0,
  name: '',
  content: '',
  priority: 'high' as 'high' | 'medium' | 'low',
  status: 'pending' as 'pending' | 'completed',
  subjectName: '',
  stageName: '',
  knowledgeName: '',
})

// 页面加载
onLoad((options: any) => {
  if (options.id) {
    breakDownId.value = Number(options.id)
    loadBreakDownDetail()
  }
})

// 加载拆解点详情
function loadBreakDownDetail() {
  // 模拟数据
  breakDownInfo.value = {
    id: breakDownId.value,
    name: `拆解点名称 ${breakDownId.value}，这是一个很长的拆解点名称测试，用于展示缩略效果`,
    content: `
      <h2>拆解点详细介绍</h2>
      <p>这是拆解点的详细内容，使用富文本展示。</p>
      <p>这里可以包含：</p>
      <ul>
        <li>文字描述</li>
        <li><strong>加粗文本</strong></li>
        <li><em>斜体文本</em></li>
        <li>列表项</li>
      </ul>
      <p>支持完整的 HTML 格式内容。</p>
    `,
    priority: 'high',
    status: 'pending',
    subjectName: 'Vue.js 前端开发',
    stageName: '基础阶段',
    knowledgeName: 'Vue 组件',
  }
}

// 编辑拆解点
function editBreakDown() {
  console.log('编辑拆解点:', breakDownId.value)
  uni.navigateTo({
    url: `/pages/learning/break-down/break-down-edit?id=${breakDownId.value}`,
  })
}

// 获取优先级文本
function getPriorityText(priority: string) {
  const priorityMap: { [key: string]: string } = {
    high: '高',
    medium: '中',
    low: '低',
  }
  return priorityMap[priority] || '中'
}

// 获取状态文本
function getStatusText(status: string) {
  const statusMap: { [key: string]: string } = {
    pending: '待完成',
    completed: '已完成',
  }
  return statusMap[status] || '待完成'
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

.break-down-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 拆解点信息区域 - 占30%高度 */
.break-down-info-section {
  position: relative;
  height: 30%;
  min-height: 220px;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
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

/* 拆解点内容 */
.break-down-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
}

/* 信息标签 */
.info-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: 12px;
  margin-bottom: 6px;
  backdrop-filter: blur(4px);
  width: fit-content;
}

.info-tag:first-of-type {
  margin-top: 0;
}

.info-tag:last-of-type {
  margin-bottom: 12px;
}

.info-tag-icon {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.info-tag-text {
  font-weight: 500;
}

/* 所属学科标签 */
.subject-tag {
  background: rgba(255, 255, 255, 0.25);
}

/* 所属阶段标签 */
.stage-tag {
  background: rgba(255, 255, 255, 0.2);
}

/* 所属知识点标签 */
.knowledge-tag {
  background: rgba(255, 255, 255, 0.15);
}

.break-down-name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.break-down-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-item {
  font-size: 13px;
}

.meta-label {
  opacity: 0.8;
}

.meta-value {
  font-weight: 600;
}

/* 状态气泡 */
.status-bubble {
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.9);
}

.status-pending {
  background: rgba(255, 255, 255, 0.9);
  color: var(--macos-blue);
}

.status-completed {
  background: rgba(255, 255, 255, 0.9);
  color: #43a047;
}

/* 拆解点内容区域 - 占70%高度 */
.break-down-content-section {
  flex: 1;
  overflow: hidden;
  min-height: 0;
  background: white;
}

.content-wrapper {
  height: 100%;
  padding: 24px;
  overflow-y: auto;
}

.content-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--macos-gray);
}

.rich-content {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
}

.rich-content :deep(h2) {
  font-size: 18px;
  font-weight: 600;
  margin: 20px 0 12px 0;
  color: #333;
}

.rich-content :deep(p) {
  margin-bottom: 12px;
}

.rich-content :deep(ul) {
  padding-left: 20px;
  margin-bottom: 12px;
}

.rich-content :deep(li) {
  margin-bottom: 6px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .break-down-info-section {
    min-height: 200px;
    padding: 20px;
  }

  .break-down-name {
    font-size: 16px;
  }

  .content-wrapper {
    padding: 20px;
  }
}
</style>
