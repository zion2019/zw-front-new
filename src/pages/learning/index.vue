<template>
  <MacOSLayout>
    <div class="page-container">
      <!-- 学习&复习入口 -->
      <div class="entry-section">
        <div class="entry-card anime-element card-base" @click="goToLearning">
          <div class="entry-content">
            <div class="entry-title entry-title-bold">
              Learning
            </div>
            <div class="entry-count">
              {{ learningStats.subjectCnt }}
            </div>
          </div>
        </div>
        <div class="entry-card anime-element card-base" @click="goToReview">
          <div class="entry-content">
            <div class="entry-title entry-title-bold">
              Review
            </div>
            <div class="entry-count warning-text">
              {{ learningStats.reviewCnt }}
            </div>
          </div>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="section">
        <div class="section-header">
          <h2>快捷操作</h2>
        </div>
        <div class="quick-actions">
          <div class="quick-action anime-element card-base" @click="goToLearnKnowledge">
            <div class="quick-action-icon">
              💡
            </div>
            <div class="quick-action-text">
              记录个新知识
            </div>
          </div>
          <div class="quick-action anime-element card-base" @click="goToTagManagement">
            <div class="quick-action-icon">
              🏷️
            </div>
            <div class="quick-action-text">
              标签管理
            </div>
          </div>
          <div class="quick-action anime-element card-base" @click="goToStrategyManagement">
            <div class="quick-action-icon">
              📋
            </div>
            <div class="quick-action-text">
              学习策略
            </div>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="statistics-section anime-element card-base">
        <div class="stat-item">
          <div class="stat-value">
            {{ learningStats.totalSubjects }}
          </div>
          <div class="stat-label">
            所有科目
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-value">
            {{ learningStats.totalKnowledgePoints }}
          </div>
          <div class="stat-label">
            知识点
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-value">
            {{ learningStats.masteredKnowledgePoints }}
          </div>
          <div class="stat-label">
            掌握知识点
          </div>
        </div>
      </div>
    </div>
  </MacOSLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MacOSLayout from '@/components/MacOSLayout.vue'

// 学习统计数据
const learningStats = ref({
  subjectCnt: 2,
  reviewCnt: 10,
  totalSubjects: 2,
  totalKnowledgePoints: 20,
  masteredKnowledgePoints: 18,
})

// 跳转到学习页面
function goToLearning() {
  uni.navigateTo({
    url: '/pages/learning/subject/subject-list',
  })
}

// 跳转到复习页面
function goToReview() {
  uni.navigateTo({
    url: '/pages/learning/practice/index',
  })
}

// 跳转到涨个知识页面
function goToLearnKnowledge() {
  uni.navigateTo({
    url: '/pages/learning/knowledge/knowledge-edit',
  })
}
// 跳转到标签管理页面
function goToTagManagement() {
  uni.navigateTo({
    url: '/pages/learning/tag/tag-list',
  })
}

// 跳转到学习策略管理页面
function goToStrategyManagement() {
  uni.navigateTo({
    url: '/pages/learning/strategy/strategy-list',
  })
}
// 页面加载时初始化数据
onMounted(() => {
  console.log('学习首页加载')
})
</script>

<style scoped>
@import '../../theme/macos.css';

.page-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
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

/* 入口区域 */
.entry-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .entry-section {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
}

.entry-card {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.entry-card:hover {
  transform: translateY(-2px);
}

.entry-icon {
  font-size: 48px;
}

.entry-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.entry-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.entry-title-bold {
  font-weight: 700;
}

.entry-count {
  font-size: 32px;
  font-weight: 700;
  color: var(--macos-blue);
}

.warning-text {
  color: var(--macos-red);
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

/* 快捷操作 */
.section {
  margin-bottom: 30px;
}

.section-header {
  margin-bottom: 16px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quick-action {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
}

.quick-action:hover {
  background: #fafafa;
}

.quick-action-icon {
  font-size: 32px;
}

.quick-action-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.card-icon {
  font-size: 24px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.card-body {
  flex: 1;
  min-height: 120px;
}

.empty-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--macos-gray);
  font-size: 14px;
}

.tags-list,
.strategies-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item,
.strategy-item {
  padding: 6px 12px;
  background: var(--macos-blue);
  color: white;
  border-radius: var(--macos-radius);
  font-size: 12px;
  font-weight: 500;
}

/* 统计信息 */
.statistics-section {
  padding: 24px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 100px;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--macos-blue);
}

.stat-label {
  font-size: 14px;
  color: var(--macos-dark-gray);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .management-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .statistics-section {
    gap: 16px;
  }

  .stat-item {
    min-width: calc(50% - 8px);
  }

  .page-title {
    font-size: 24px;
  }
}
</style>
