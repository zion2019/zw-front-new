<template>
  <MacOSLayout>
    <div class="page-container">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="search-input-wrapper">
          <div class="i-carbon-search search-icon" />
          <input
            v-model="searchKeyword"
            class="search-input"
            placeholder="搜索标签名称"
            @input="handleSearch"
          >
        </div>
      </div>

      <!-- 标签列表 -->
      <z-paging
        ref="pagingRef"
        v-model="tagList"
        :auto-show-back-to-top="true"
        @query="queryList"
      >
        <div class="tag-list">
          <div
            v-for="tag in tagList"
            :key="tag.id"
            class="tag-card anime-element card-base"
          >
            <div
              class="tag-name"
              :style="{ background: tag.backgroundColor }"
            >
              {{ tag.name }}
            </div>
            <div class="edit-icon-wrapper" @click.stop="editTag(tag)">
              <div class="i-carbon-edit text-black" />
            </div>
          </div>
        </div>
      </z-paging>

      <!-- 右下角悬浮新增按钮 -->
      <div class="floating-add-btn" @click="goToAddTag">
        <div class="i-carbon-add text-white" />
      </div>
    </div>
  </MacOSLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MacOSLayout from '@/components/MacOSLayout.vue'

interface Tag {
  id: number
  name: string
  description: string
  backgroundColor: string
}

// 标签列表数据
const tagList = ref<Tag[]>([])
const pagingRef = ref()
const searchKeyword = ref('')

// 搜索处理
function handleSearch() {
  pagingRef.value?.reload()
}

// 查询列表数据
function queryList(pageNo: number, pageSize: number) {
  // 模拟异步请求
  setTimeout(() => {
    const colors = ['#667eea', '#f56565', '#48bb78', '#ed8936', '#9f7aea', '#38b2ac', '#ed64a6']
    const mockData: Tag[] = Array.from({ length: pageSize }, (_, index) => {
      const id = (pageNo - 1) * pageSize + index + 1
      const name = searchKeyword.value
        ? `${searchKeyword.value}${id}`
        : `标签${id}`
      return {
        id,
        name,
        description: `这是标签${id}的描述信息`,
        backgroundColor: colors[index % colors.length],
      }
    })

    // 过滤搜索结果
    const filteredData = searchKeyword.value
      ? mockData.filter(tag => tag.name.includes(searchKeyword.value))
      : mockData

    pagingRef.value?.complete(filteredData)
  }, 500)
}

// 编辑标签
function editTag(tag: Tag) {
  console.log('编辑标签:', tag.id)
  uni.navigateTo({
    url: `/pages/learning/tag/tag-form?id=${tag.id}`,
  })
}

// 跳转到新增标签页面
function goToAddTag() {
  uni.navigateTo({
    url: '/pages/learning/tag/tag-form',
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

/* 搜索栏 */
.search-bar {
  margin-bottom: 16px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid var(--macos-gray);
  border-radius: var(--macos-radius);
  padding: 0 12px;
  transition: all 0.3s ease;
}

.search-input-wrapper:focus-within {
  border-color: var(--macos-blue);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.search-icon {
  font-size: 18px;
  color: var(--macos-gray);
  margin-right: 8px;
}

.search-input {
  flex: 1;
  padding: 12px 0;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
}

/* 标签列表 */
.tag-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tag-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
}

/* 公共卡片样式 */
.card-base {
  background: white;
  border-radius: var(--macos-radius-large);
  border: 2px solid #000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
}

.card-base:hover {
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.15);
  transform: translate(-2px, -2px);
}

.tag-name {
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  display: inline-block;
}

.edit-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 50%;
}

.edit-icon-wrapper:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: scale(1.1);
}

/* 动画效果 */
.anime-element {
  transition: all 0.3s ease;
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
  .page-container {
    padding: 16px;
  }

  .search-input {
    font-size: 14px;
  }

  .tag-card {
    padding: 14px;
  }

  .floating-add-btn {
    right: 20px;
    bottom: 20px;
    width: 50px;
    height: 50px;
  }
}
</style>
