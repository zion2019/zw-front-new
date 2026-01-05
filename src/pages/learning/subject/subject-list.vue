<template>
  <MacOSLayout>
    <div class="page-container">
      <!-- 科目列表 -->
      <z-paging
        ref="pagingRef"
        v-model="subjectList"
        :auto-show-back-to-top="true"
        @query="queryList"
      >
        <div class="subject-list">
          <div
            v-for="subject in subjectList"
            :key="subject.id"
            class="subject-card anime-element card-base"
            @click="goToSubjectDetail(subject)"
          >
            <!-- 左侧封面图 -->
            <div class="subject-cover">
              <image
                :src="subject.coverImage || '/static/placeholder.png'"
                mode="aspectFill"
                class="cover-image"
              />
            </div>

            <!-- 右侧信息 -->
            <div class="subject-info">
              <div class="subject-name">
                {{ subject.name }}
              </div>
              <div class="subject-meta">
                <div class="meta-item">
                  <span class="meta-label">阶段：</span>
                  <span class="meta-value">{{ subject.stage }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">知识点：</span>
                  <span class="meta-value">{{ subject.knowledgePointCnt }}</span>
                </div>
              </div>

              <!-- 状态标签和按钮 -->
              <div class="subject-footer">
                <div class="status-tag" :class="[`status-${subject.status}`]">
                  {{ getStatusText(subject.status) }}
                </div>
                <div class="review-btn" @click.stop="goToReview(subject)">
                  去复习 →
                </div>
              </div>
            </div>
          </div>
        </div>
      </z-paging>

      <!-- 右下角悬浮新增按钮 -->
      <div class="floating-add-btn" @click="goToAddSubject">
        <div class="i-carbon-add text-white" />
      </div>
    </div>
  </MacOSLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MacOSLayout from '@/components/MacOSLayout.vue'

interface Subject {
  id: number
  name: string
  coverImage?: string
  stage: number
  knowledgePointCnt: number
  status: 'learning' | 'delayed' | 'mastered'
}

// 科目列表数据
const subjectList = ref<Subject[]>([])
const pagingRef = ref()

// 获取状态文本
function getStatusText(status: string) {
  const statusMap: { [key: string]: string } = {
    learning: '学习中',
    delayed: '已延期',
    mastered: '已掌握',
  }
  return statusMap[status] || '学习中'
}

// 查询列表数据
function queryList(pageNo: number, pageSize: number) {
  // 模拟异步请求
  setTimeout(() => {
    const mockData: Subject[] = Array.from({ length: pageSize }, (_, index) => ({
      id: (pageNo - 1) * pageSize + index + 1,
      name: `科目名称 ${(pageNo - 1) * pageSize + index + 1}，这是一个很长的科目名称测试`,
      coverImage: '',
      stage: Math.floor(Math.random() * 3) + 1,
      knowledgePointCnt: Math.floor(Math.random() * 50) + 10,
      status: ['learning', 'delayed', 'mastered'][Math.floor(Math.random() * 3)] as any,
    }))

    pagingRef.value?.complete(mockData)
  }, 500)
}

// 跳转到科目详情
function goToSubjectDetail(subject: Subject) {
  console.log('跳转到科目详情:', subject.id)
  uni.navigateTo({
    url: `/pages/learning/subject/subject-det?id=${subject.id}`,
  })
}

// 跳转到复习页面
function goToReview(subject: Subject) {
  console.log('跳转到复习页面:', subject.id)
  uni.navigateTo({
    url: `/pages/learning/practice/index?subjectId=${subject.id}`,
  })
}

// 跳转到新增科目页面
function goToAddSubject() {
  uni.navigateTo({
    url: '/pages/learning/subject/subject-edit',
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

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  color: #333;
}

/* 科目列表 */
.subject-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.subject-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  cursor: pointer;
  align-items: center;
}

/* 公共卡片样式 */
.card-base {
  background: white;
  border-radius: var(--macos-radius-large);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid #000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
}

.card-base:hover {
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.15);
  transform: translate(-2px, -2px);
}

/* 封面图 */
.subject-cover {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: var(--macos-radius);
  overflow: hidden;
  background: #f0f0f0;
}

.cover-image {
  width: 100%;
  height: 100%;
}

/* 科目信息 */
.subject-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  height: 120px;
}

.subject-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3;
  max-height: 2.6em;
  margin-bottom: auto;
}

.subject-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
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

/* 底部状态和按钮 */
.subject-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
}

.status-tag {
  padding: 3px 8px;
  border-radius: 10px;
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

.review-btn {
  padding: 5px 12px;
  background: var(--macos-blue);
  color: white;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.review-btn:hover {
  background: #0066cc;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .subject-cover {
    width: 120px;
    height: 120px;
  }

  .subject-info {
    height: 120px;
  }

  .page-title {
    font-size: 24px;
  }
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

@media (max-width: 768px) {
  .floating-add-btn {
    right: 20px;
    bottom: 20px;
    width: 50px;
    height: 50px;
  }
}
</style>
