<template>
  <MacOSLayout>
    <div class="page-container">
      <div class="knowledge-detail">
        <!-- 知识点信息区域 (30%高度) -->
        <div class="knowledge-info-section">
          <!-- 右上角编辑图标 -->
          <div class="edit-icon-wrapper" @click="editKnowledge">
            <div class="i-carbon-edit text-black" />
          </div>

          <div class="knowledge-content">
            <!-- 所属学科 -->
            <div class="info-tag subject-tag">
              <div class="info-tag-icon">
                <div class="i-carbon-book text-white" />
              </div>
              <span class="info-tag-text">{{ knowledgeInfo.subjectName }}</span>
            </div>

            <!-- 所属阶段 -->
            <div class="info-tag stage-tag">
              <div class="info-tag-icon">
                <div class="i-carbon-list-boxes text-white" />
              </div>
              <span class="info-tag-text">{{ knowledgeInfo.stageName }}</span>
            </div>

            <!-- 学习策略 -->
            <div class="info-tag strategy-tag">
              <div class="info-tag-icon">
                <div class="i-carbon-settings text-white" />
              </div>
              <span class="info-tag-text">{{ knowledgeInfo.strategyName }}</span>
            </div>

            <div class="knowledge-name">
              {{ knowledgeInfo.name }}
            </div>
            <div class="knowledge-description">
              {{ knowledgeInfo.description }}
            </div>
            <div class="knowledge-meta">
              <div class="meta-item">
                <span class="meta-label">拆解点：</span>
                <span class="meta-value">{{ knowledgeInfo.breakDownCnt }}</span>
              </div>
              <div class="status-bubble" :class="[`status-${knowledgeInfo.status}`]">
                {{ getStatusText(knowledgeInfo.status) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 拆解列表区域 (70%高度) -->
        <div class="break-down-section">
          <BreakDownList :knowledge-id="knowledgeId" />
        </div>

        <!-- 右下角悬浮新增按钮 -->
        <div class="floating-add-btn" @click="addBreakDown">
          <div class="i-carbon-add text-white" />
        </div>
      </div>
    </div>
  </MacOSLayout>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import MacOSLayout from '@/components/MacOSLayout.vue'
import BreakDownList from '../break-down/break-down-list.vue'

const knowledgeId = ref<number>(0)

// 知识点信息
const knowledgeInfo = ref({
  id: 0,
  name: '',
  description: '',
  breakDownCnt: 0,
  status: 'learning' as 'learning' | 'delayed' | 'mastered',
  subjectName: '',
  stageName: '',
  strategyName: '',
})

// 页面加载
onLoad((options: any) => {
  if (options.id) {
    knowledgeId.value = Number(options.id)
    loadKnowledgeDetail()
  }
})

// 加载知识点详情
function loadKnowledgeDetail() {
  // 模拟数据
  knowledgeInfo.value = {
    id: knowledgeId.value,
    name: `知识点名称 ${knowledgeId.value}，这是一个很长的知识点名称测试，用于展示缩略效果`,
    description: '这是知识点的描述信息，用于展示知识点详情内容',
    breakDownCnt: 4,
    status: 'learning',
    subjectName: 'Vue.js 前端开发',
    stageName: '基础阶段',
    strategyName: '艾宾浩斯记忆法',
  }
}

// 编辑知识点
function editKnowledge() {
  console.log('编辑知识点:', knowledgeId.value)
  uni.navigateTo({
    url: `/pages/learning/knowledge/knowledge-edit?id=${knowledgeId.value}`,
  })
}

// 新增拆解点
function addBreakDown() {
  uni.navigateTo({
    url: '/pages/learning/break-down/break-down-edit',
  })
}

// 获取状态文本
function getStatusText(status: string) {
  const statusMap: { [key: string]: string } = {
    learning: '学习中',
    delayed: '延期未学',
    mastered: '已掌握',
  }
  return statusMap[status] || '学习中'
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

.knowledge-detail {
  display: flex;
  flex-direction: column;
  height: 92vh;
}

/* 知识点信息区域 - 占30%高度 */
.knowledge-info-section {
  position: relative;
  height: 38vh;
  min-height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #ffbd2e 100%);
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

/* 知识点内容 */
.knowledge-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  height: 65vh;
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
  margin-bottom: 8px;
  backdrop-filter: blur(4px);
  width: fit-content;
}

.info-tag:first-of-type {
  margin-top: 0;
}

.info-tag:last-of-type {
  margin-bottom: 16px;
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
  background: rgba(255, 255, 255, 0.15);
}

/* 学习策略标签 */
.strategy-tag {
  background: rgba(255, 255, 255, 0.1);
}

.knowledge-name {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.knowledge-description {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.knowledge-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-item {
  font-size: 14px;
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

.status-learning {
  background: rgba(255, 255, 255, 0.9);
  color: var(--macos-blue);
}

.status-delayed {
  background: rgba(255, 255, 255, 0.9);
  color: #f57c00;
}

.status-mastered {
  background: rgba(255, 255, 255, 0.9);
  color: #43a047;
}

/* 拆解列表区域 - 占70%高度 */
.break-down-section {
  flex: 1;
  overflow: hidden;
  height: 57vh;
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
  .knowledge-info-section {
    min-height: 180px;
    padding: 20px;
  }

  .knowledge-name {
    font-size: 18px;
  }

  .knowledge-description {
    font-size: 13px;
  }

  .knowledge-meta {
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
