<template>
  <MacOSLayout>
    <div class="page-container">
      <!-- 科目详情 -->
      <div class="subject-detail">
        <!-- 封面区域 (3/10高度) -->
        <div class="cover-section">
          <div class="cover-image">
            <image
              :src="subjectInfo.coverImage || '/static/placeholder.png'"
              mode="aspectFill"
              class="cover-img"
            />
          </div>
          <!-- 右上角编辑图标 -->
          <div class="cover-actions">
            <div class="icon-btn icon-btn-edit" @click="editSubject">
              <div class="i-carbon-edit text-black" />
            </div>
          </div>
          <!-- 悬浮标题和标签 -->
          <div class="cover-overlay">
            <div class="subject-name">
              {{ subjectInfo.name }}
            </div>
            <div class="subject-tags">
              <div
                v-for="tag in subjectInfo.tags"
                :key="tag"
                class="tag-item"
              >
                {{ tag }}
              </div>
            </div>
          </div>
        </div>

        <!-- 内容区域：左栏阶段列表，右栏空白 -->
        <div class="content-section">
          <!-- 左栏：阶段列表 -->
          <div class="stage-section">
            <StageList :subject-id="subjectId" />
          </div>

          <!-- 右栏：暂留空 -->
          <div class="right-section">
            <!-- 未来可以放知识点列表等内容 -->
          </div>
        </div>

        <!-- 底部去复习按钮 -->
        <div class="bottom-action">
          <div class="review-btn-large" @click="goToReview">
            去复习
          </div>
        </div>
      </div>
    </div>
  </MacOSLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MacOSLayout from '@/components/MacOSLayout.vue'
import StageList from '../stage/stage-list.vue'

const subjectId = ref<number>(0)

// 科目信息
const subjectInfo = ref({
  id: 0,
  name: '',
  coverImage: '',
  tags: [] as string[],
})

// 页面加载
onLoad((options: any) => {
  if (options.id) {
    subjectId.value = Number(options.id)
    loadSubjectDetail()
  }
})

// 加载科目详情
function loadSubjectDetail() {
  // 模拟数据
  subjectInfo.value = {
    id: subjectId.value,
    name: `科目名称 ${subjectId.value}，这是一个很长的科目名称测试，用于展示悬浮标题效果`,
    coverImage: '',
    tags: ['Vue', 'TypeScript', '前端开发'],
  }
}

// 编辑科目
function editSubject() {
  console.log('编辑科目:', subjectId.value)
  uni.navigateTo({
    url: `/pages/learning/subject/subject-edit?id=${subjectId.value}`,
  })
}

// 去复习
function goToReview() {
  console.log('去复习:', subjectId.value)
  // uni.navigateTo({
  //   url: `/pages/learning/review?subjectId=${subjectId.value}`
  // })
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

.subject-detail {
  display: flex;
  flex-direction: column;
  height: 92vh;
}

/* 封面区域 - 占3/10高度 */
.cover-section {
  position: relative;
  height: 30vh;
  min-height: 200px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
}

.cover-img {
  width: 100%;
  height: 100%;
}

/* 封面右上角操作按钮 */
.cover-actions {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.icon-btn {
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

.icon-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.icon-btn-edit {
  background: rgba(255, 255, 255, 0.9);
}

.icon-btn-delete {
  background: rgba(255, 82, 82, 82, 0.9);
}

/* 悬浮标题和标签 */
.cover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  padding: 20px;
  color: white;
}

.subject-name {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3;
}

.subject-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-size: 11px;
  color: white;
  backdrop-filter: blur(4px);
}

/* 内容区域：左右两栏 */
.content-section {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
  height: 62vh;
}

/* 左栏：阶段列表 */
.stage-section {
  flex: 1;
  overflow: hidden;
  height: 62vh;
  padding-top: 5px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* 底部去复习按钮 */
.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  background: white;
  border-top: 2px solid #000;
  z-index: 100;
}

.review-btn-large {
  width: 100%;
  padding: 14px;
  background: var(--macos-blue);
  color: white;
  border-radius: var(--macos-radius);
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
}

.review-btn-large:active {
  background: #0066cc;
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.15);
}

/* 公共卡片样式 */
.card-base {
  background: white;
  border-radius: var(--macos-radius-large);
  transition: all 0.3s ease;
}

.card-base:hover {
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.15);
  transform: translate(-2px, -2px);
}

/* 动画效果 */
.anime-element {
  transition: all 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cover-section {
    height: 30vh;
    min-height: 180px;
  }

  .content-section {
    height: 62vh;
  }

  .cover-overlay {
    padding: 16px;
  }

  .subject-name {
    font-size: 18px;
  }

  .cover-actions {
    top: 12px;
    right: 12px;
  }

  .icon-btn {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .right-section {
    display: none;
  }

  .bottom-action {
    padding: 12px 16px;
  }

  .review-btn-large {
    padding: 12px;
    font-size: 14px;
  }
}
</style>
