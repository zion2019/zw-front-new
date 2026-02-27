<template>
  <MacOSLayout>
    <div class="page-container">
      <!-- 标签列表 -->
      <z-paging
        ref="pagingRef"
        v-model="tagList"
        :fixed="false"
        :auto-show-back-to-top="false"
        @query="queryList"
      >
        <div class="tag-list">
          <div
            v-for="tag in tagList"
            :key="tag.id"
            class="tag-card anime-element card-base"
          >
            <div class="tag-left">
              <div
                class="tag-name"
                :style="{ background: tag.backgroundColor }"
              >
                {{ tag.name }}
              </div>
              <div class="tag-description">
                {{ tag.description || '暂无描述' }}
              </div>
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
import { pageUsingGet } from '@/service/learning/tag'

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
async function queryList(pageNo: number, pageSize: number) {
  try {
    const res = await pageUsingGet({
      params: {
        pageNo,
        pageSize,
        name: searchKeyword.value || undefined,
        color: '',
      },
    })

    const pageData = res as unknown as { dataList: any[], total: number }

    if (pageData) {
      const dataList = pageData.dataList || []
      const formattedList: Tag[] = dataList.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        backgroundColor: item.color,
      }))
      pagingRef.value?.complete(formattedList)
    }
    else {
      uni.showToast({
        title: '加载失败',
        icon: 'none',
      })
      pagingRef.value?.complete([])
    }
  }
  catch (error) {
    console.error('加载标签列表失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
    pagingRef.value?.complete([])
  }
}

// 编辑标签
function editTag(tag: Tag) {
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
  padding: 5px;
  max-width: 800px;
  max-height: 100%;
  margin: 0 auto;
  top: 10px;
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

.tag-left {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  min-width: 0;
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
  flex-shrink: 0;
}

.tag-description {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
    padding: 5px;
    height: 100%;
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
