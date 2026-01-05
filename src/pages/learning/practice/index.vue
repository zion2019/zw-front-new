<template>
  <MacOSLayout>
    <div class="page-container">
      <div class="practice-detail">
        <!-- 知识点信息区域 (30%高度) -->
        <div class="knowledge-info-section">
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

            <div class="knowledge-name">
              {{ knowledgeInfo.name }}
            </div>
            <div class="knowledge-description">
              {{ knowledgeInfo.description }}
            </div>
            <div class="knowledge-meta">
              <div class="mastery-bubble" :class="[`mastery-${knowledgeInfo.masteryLevel}`]">
                {{ getMasteryText(knowledgeInfo.masteryLevel) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 拆解点列表区域 (70%高度) -->
        <div class="break-down-section">
          <!-- 骨架屏 -->
          <div v-if="!showContent" class="skeleton-container">
            <div class="skeleton-item skeleton-anime"></div>
            <div class="skeleton-item skeleton-anime"></div>
            <div class="skeleton-item skeleton-anime"></div>
          </div>
          <!-- 拆解点列表 -->
          <div v-else class="break-down-list">
            <div
              v-for="breakDown in breakDownList"
              :key="breakDown.id"
              class="break-down-card anime-element card-base"
            >
              <div class="break-down-name">
                {{ breakDown.name }}
              </div>
              <div class="break-down-content" v-html="stripHtmlTags(breakDown.content)" />
            </div>
          </div>
        </div>

        <!-- 底部固定按钮 -->
        <div class="bottom-actions">
          <!-- 掌握程度选择按钮 -->
          <div v-if="!showContent" class="mastery-buttons">
            <div
              class="action-btn action-forgot"
              :class="{ active: selectedMastery === 0 }"
              @click="selectMastery(0)"
            >
              <div class="btn-icon">
                <div class="i-carbon-close-outline" />
              </div>
              <span class="btn-text">忘记</span>
            </div>
            <div
              class="action-btn action-vague"
              :class="{ active: selectedMastery === 1 }"
              @click="selectMastery(1)"
            >
              <div class="btn-icon">
                <div class="i-carbon-help" />
              </div>
              <span class="btn-text">模糊</span>
            </div>
            <div
              class="action-btn action-remember"
              :class="{ active: selectedMastery === 2 }"
              @click="selectMastery(2)"
            >
              <div class="btn-icon">
                <div class="i-carbon-checkmark-outline" />
              </div>
              <span class="btn-text">记得</span>
            </div>
          </div>
          <!-- 下一个按钮 -->
          <div v-else class="next-button">
            <div class="action-btn action-next" @click="handleMastery(selectedMastery!)">
              <div class="btn-icon">
                <div class="i-carbon-arrow-right" />
              </div>
              <span class="btn-text">下一个</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MacOSLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MacOSLayout from '@/components/MacOSLayout.vue'

// 页面参数
const subjectId = ref<number>(0)
const practiceId = ref<number>(0)

// 知识点信息
const knowledgeInfo = ref({
  id: 0,
  name: '',
  description: '',
  masteryLevel: 0, // 0:陌生, 1:熟悉, 2:掌握, 3:精通
  subjectName: '',
  stageName: '',
  subjectCoverImage: '',
})

// 拆解点列表
const breakDownList = ref<Array<{
  id: number
  name: string
  content: string
}>>([])

const loading = ref(true)
const showContent = ref(false)
const selectedMastery = ref<number | null>(null)

// 页面加载
onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.options || {}

  subjectId.value = Number.parseInt(options.subjectId || '0', 10)
  practiceId.value = Number.parseInt(options.id || '0', 10)

  loadNextPractice()
})

// 调用接口获取下一个复习内容
function loadNextPractice() {
  loading.value = true
  showContent.value = false
  selectedMastery.value = null

  // 调用接口 /practice/next
  // const params: any = {}
  // if (subjectId.value) {
  //   params.subjectId = subjectId.value
  // }
  // if (practiceId.value) {
  //   params.practiceId = practiceId.value
  // }

  // 模拟异步请求
  setTimeout(() => {
    // 模拟数据
    knowledgeInfo.value = {
      id: Math.floor(Math.random() * 100) + 1,
      name: `知识点名称 ${Math.floor(Math.random() * 100) + 1}，这是一个很长的知识点名称测试，用于展示缩略效果`,
      description: '这是知识点的描述信息，用于展示知识点详情内容',
      masteryLevel: Math.floor(Math.random() * 4),
      subjectName: 'Vue.js 前端开发',
      stageName: '基础阶段',
      subjectCoverImage: '',
    }

    breakDownList.value = [
      {
        id: 1,
        name: '拆解点 1：核心概念',
        content: '<p>这是拆解点1的富文本内容。</p><p>详细的解释说明文字内容。</p>',
      },
      {
        id: 2,
        name: '拆解点 2：使用方法',
        content: '<p>这是拆解点2的富文本内容。</p><p>详细的解释说明文字内容。</p>',
      },
      {
        id: 3,
        name: '拆解点 3：注意事项',
        content: '<p>这是拆解点3的富文本内容。</p><p>详细的解释说明文字内容。</p>',
      },
    ]

    loading.value = false
  }, 500)
}

// 移除 HTML 标签，提取纯文本内容
function stripHtmlTags(html: string) {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || ''
}

// 获取掌握程度文本
function getMasteryText(level: number) {
  const masteryMap: { [key: number]: string } = {
    0: '陌生',
    1: '熟悉',
    2: '掌握',
    3: '精通',
  }
  return masteryMap[level] || '陌生'
}

// 选择掌握程度
function selectMastery(level: number) {
  selectedMastery.value = level
  showContent.value = true
}

// 处理掌握程度
async function handleMastery(level: number) {
  console.log('掌握程度:', level)

  // 调用接口更新掌握程度
  // await updateMastery({
  //   practiceId: practiceId.value,
  //   masteryLevel: level
  // })

  // 加载下一个复习内容
  loadNextPractice()
}
</script>

<style scoped>
@import '../../../theme/macos.css';

.page-container {
  padding: 0;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.practice-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 知识点信息区域 - 占30%高度 */
.knowledge-info-section {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #ffbd2e 100%);
  padding: 24px;
  display: flex;
  flex-direction: column;
}

/* 知识点内容 */
.knowledge-content {
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
  justify-content: flex-end;
  align-items: center;
}

/* 掌握程度气泡 */
.mastery-bubble {
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.9);
}

.mastery-0 {
  background: rgba(255, 255, 255, 0.9);
  color: #666;
}

.mastery-1 {
  background: rgba(255, 255, 255, 0.9);
  color: var(--macos-blue);
}

.mastery-2 {
  background: rgba(255, 255, 255, 0.9);
  color: #f57c00;
}

.mastery-3 {
  background: rgba(255, 255, 255, 0.9);
  color: #43a047;
}

/* 拆解列表区域 - 占70%高度 */
.break-down-section {
  flex: 1;
  overflow: hidden;
  min-height: 0;
  padding: 20px;
  background: #f8f9fa;
}

/* 骨架屏容器 */
.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: skeleton-fade-in 0.4s ease-out;
}

/* 骨架屏淡入动画 */
@keyframes skeleton-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 骨架屏单项 */
.skeleton-item {
  padding: 16px;
  background: white;
  border-radius: var(--macos-radius-large);
  border: 2px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 骨架屏条目 */
.skeleton-item::before {
  content: '';
  display: block;
  width: 70%;
  height: 16px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
}

.skeleton-item::after {
  content: '';
  display: block;
  width: 100%;
  height: 48px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
}

/* 骨架屏动画效果 */
.skeleton-anime {
  position: relative;
  overflow: hidden;
}

/* 骨架屏闪光动画 */
.skeleton-anime::before {
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-anime::after {
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 骨架屏脉冲动画 */
.skeleton-item {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 骨架屏每一项的交错动画 */
.skeleton-item:nth-child(1) {
  animation-delay: 0s;
}

.skeleton-item:nth-child(2) {
  animation-delay: 0.1s;
}

.skeleton-item:nth-child(3) {
  animation-delay: 0.2s;
}

/* 拆解列表 */
.break-down-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  overflow-y: auto;
}

.break-down-card {
  padding: 16px;
  cursor: default;
}

/* 公共卡片样式 */
.card-base {
  background: white;
  border-radius: var(--macos-radius-large);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid #000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
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
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 4;
}

/* 动画效果 */
.anime-element {
  transition: all 0.3s ease;
}

/* 底部固定按钮 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  background: white;
  border-top: 2px solid #000;
  box-shadow: 4px -4px 0 rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.mastery-buttons {
  display: flex;
  gap: 12px;
}

.next-button {
  display: flex;
  justify-content: center;
}

.action-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background: white;
  border: 2px solid #000;
  border-radius: var(--macos-radius);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.1);
  min-height: 52px;
}

.mastery-buttons .action-btn {
  flex: 1;
}

.action-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.15);
}

.action-btn.active {
  background: var(--macos-blue);
  color: white;
  border-color: var(--macos-blue);
  box-shadow: 3px 3px 0 rgba(0, 122, 255, 0.3);
}

.btn-icon {
  font-size: 22px;
}

.btn-text {
  font-size: 15px;
  font-weight: 600;
}

/* 忘记按钮 */
.action-forgot {
  color: #666;
}

.action-forgot:hover {
  background: #f5f5f5;
}

/* 模糊按钮 */
.action-vague {
  color: #ff9800;
}

.action-vague:hover {
  background: #fff3e0;
}

/* 记得按钮 */
.action-remember {
  color: #43a047;
}

.action-remember:hover {
  background: #e8f5e9;
}

/* 下一个按钮 */
.action-next {
  color: var(--macos-blue);
  width: 100%;
  max-width: 200px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.action-next:hover {
  background: linear-gradient(135deg, #bbdefb 0%, #90caf9 100%);
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

  .break-down-section {
    padding: 16px;
  }

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

  .bottom-actions {
    padding: 12px 16px;
    gap: 8px;
  }

  .mastery-buttons {
    gap: 8px;
  }

  .action-btn {
    padding: 12px 16px;
    gap: 6px;
    min-height: 48px;
  }

  .btn-icon {
    font-size: 20px;
  }

  .btn-text {
    font-size: 13px;
  }
}
</style>
