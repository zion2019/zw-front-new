<template>
  <MacOSLayout>
    <div class="page-container">
      <div class="stage-detail">
        <!-- 阶段信息区域 (30%高度) -->
        <div class="stage-info-section">
          <!-- 右上角编辑图标 -->
          <div class="edit-icon-wrapper" @click="editStage">
            <div class="i-carbon-edit text-black" />
          </div>

          <div class="stage-content">
            <!-- 所属学科标签 -->
            <div class="subject-tag">
              <div class="subject-tag-icon">
                <div class="i-carbon-book text-white" />
              </div>
              <span class="subject-tag-text">{{ stageInfo.subjectName }}</span>
            </div>

            <div class="stage-name">
              {{ stageInfo.name }}
            </div>
            <div class="stage-description">
              {{ stageInfo.description }}
            </div>
            <div class="stage-meta">
              <div class="meta-item">
                <span class="meta-label">知识点：</span>
                <span class="meta-value">{{ stageInfo.knowledgePointCnt }}</span>
              </div>
              <div class="status-bubble" :class="[`status-${stageInfo.status}`]">
                {{ getStatusText(stageInfo.status) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 知识点列表区域 (70%高度) -->
        <div class="knowledge-section">
          <KnowledgeList :stage-id="stageId" />
        </div>

        <!-- 右下角悬浮新增按钮 -->
        <div class="floating-add-btn" @click="addKnowledge">
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
import KnowledgeList from '../knowledge/knowledge-list.vue'

const stageId = ref<number>(0)

// 阶段信息
const stageInfo = ref({
  id: 0,
  name: '',
  description: '',
  knowledgePointCnt: 0,
  status: 'learning' as 'learning' | 'delayed' | 'mastered',
  subjectName: '',
  subjectId: 0,
})

// 页面加载
onLoad((options: any) => {
  if (options.id) {
    stageId.value = Number(options.id)
    loadStageDetail()
  }
})

// 加载阶段详情
function loadStageDetail() {
  // 模拟数据
  stageInfo.value = {
    id: stageId.value,
    name: `阶段名称 ${stageId.value}，这是一个很长的阶段名称测试，用于展示缩略效果`,
    description: '这是阶段的描述信息，用于展示阶段详情内容',
    knowledgePointCnt: 20,
    status: 'learning',
    subjectName: 'Vue.js 前端开发',
    subjectId: 1,
  }
}

// 编辑阶段
function editStage() {
  console.log('编辑阶段:', stageId.value)
  uni.navigateTo({
    url: `/pages/learning/stage/stage-edit?id=${stageId.value}`,
  })
}

// 新增知识点
function addKnowledge() {
  uni.navigateTo({
    url: `/pages/learning/knowledge/knowledge-edit?stageId=${stageId.value}`,
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

.stage-detail {
  flex-direction: column;
  height: 70vh;
}

/* 阶段信息区域 - 占30%高度 */
.stage-info-section {
  position: relative;
  height: 30vh;
  min-height: 180px;
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

/* 阶段内容 */
.stage-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
}

/* 所属学科标签 */
.subject-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: 12px;
  margin-bottom: 16px;
  backdrop-filter: blur(4px);
  width: fit-content;
}

.subject-tag-icon {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.subject-tag-text {
  font-weight: 500;
}

.stage-name {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stage-description {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.stage-meta {
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

/* 知识点列表区域 - 占70%高度 */
.knowledge-section {
  overflow: hidden;
  min-height: 0;
  height: 70vh;
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
  .stage-info-section {
    min-height: 160px;
    padding: 20px;
  }

  .stage-name {
    font-size: 18px;
  }

  .stage-description {
    font-size: 13px;
  }

  .stage-meta {
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
