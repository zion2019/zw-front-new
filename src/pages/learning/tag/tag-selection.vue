<template>
  <div class="form-item">
    <div class="item-label">
      {{ label }}
    </div>
    <div class="tag-select-wrapper">
      <!-- 已选标签区域 -->
      <div class="section-row">
        <div class="section-title">
          已选标签
        </div>
        <div class="selected-tags">
          <div
            v-for="tag in selectedTags"
            :key="tag.id"
            class="tag-chip"
            :style="{ background: tag.color }"
          >
            {{ tag.name }}
            <span class="tag-remove" @click="removeTag(tag)">×</span>
          </div>
          <div v-if="selectedTags.length === 0" class="empty-placeholder-inline">
            暂无
          </div>
        </div>
      </div>

      <!-- 搜索输入区域 -->
      <div class="section-row">
        <div class="section-title">
          搜索标签
        </div>
        <div class="tag-input-row">
          <input
            v-model="tagInput"
            class="tag-input"
            placeholder="输入标签名称"
          >
          <div class="search-btn" @click="handleSearch">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 搜索结果区域 -->
      <div v-show="showSearchResults" class="search-results-section">
        <div class="section-row">
          <div class="section-title">
            搜索结果
          </div>
          <div v-if="searchResults.length > 0" class="search-results">
            <div
              v-for="tag in searchResults"
              :key="tag.id"
              class="search-tag-item"
              :style="{ background: tag.color }"
              @click="addTag(tag)"
            >
              {{ tag.name }}
            </div>
          </div>
          <div v-else class="empty-placeholder-inline">
            暂无匹配标签
          </div>
        </div>
      </div>

      <!-- 常用标签区域 -->
      <div class="section-row">
        <div class="section-title">
          常用标签
        </div>
        <div v-if="recentlyTags.length > 0" class="recently-tags">
          <div
            v-for="tag in recentlyTags"
            :key="tag.id"
            class="recently-tag-item"
            :style="{ background: tag.color }"
            @click="addTag(tag)"
          >
            {{ tag.name }}
          </div>
        </div>
        <div v-else class="empty-placeholder-inline">
          暂无
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { pageUsingGet, recentlyTagsUsingGet } from '@/service/learning/tag'

interface TagVO {
  id: number
  name: string
  color: string
  description?: string
  userId?: number
}

interface Props {
  label?: string
  modelValue?: TagVO[]
}

const props = withDefaults(defineProps<Props>(), {
  label: '标签',
  modelValue: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [tags: TagVO[]]
  'change': [tags: TagVO[]]
}>()

// 已选标签
const selectedTags = ref<TagVO[]>([...props.modelValue])

// 标签输入
const tagInput = ref('')
const showSearchResults = ref(false)

// 最近使用的标签
const recentlyTags = ref<TagVO[]>([])

// 搜索结果
const searchResults = ref<TagVO[]>([])

// 监听外部传入的 tags 变化
watch(() => props.modelValue, (newVal) => {
  selectedTags.value = [...newVal]
}, { deep: true })

// 监听内部 selectedTags 变化，同步到外部
watch(selectedTags, (newVal) => {
  emit('update:modelValue', newVal)
  emit('change', newVal)
}, { deep: true })

// 加载最近使用的标签
async function loadRecentlyTags() {
  try {
    const res = await recentlyTagsUsingGet({
      params: { showNum: 3 },
    })

    if (res) {
      recentlyTags.value = res
      console.log('recentlyTags loaded', recentlyTags.value)
    }
  }
  catch (error) {
    console.error('加载最近使用的标签失败:', error)
  }
}

// 搜索处理
async function handleSearch() {
  const keyword = tagInput.value.trim()
  if (!keyword) {
    uni.showToast({
      title: '请输入标签名称',
      icon: 'none',
    })
    return
  }

  try {
    const res = await pageUsingGet({
      params: {
        pageNo: 1,
        pageSize: 20,
        name: keyword,
        color: '',
      },
    })

    if (res.dataList) {
      // 过滤掉已选的标签
      searchResults.value = res.dataList.filter(
        tag => !selectedTags.value.some(selected => selected.id === tag.id),
      )
    }
    showSearchResults.value = true
  }
  catch (error) {
    console.error('搜索标签失败:', error)
    searchResults.value = []
  }
}

// 添加标签
function addTag(tag: TagVO) {
  // 检查是否已存在
  if (selectedTags.value.some(t => t.id === tag.id)) {
    uni.showToast({
      title: '标签已存在',
      icon: 'none',
    })
    return
  }

  selectedTags.value.push(tag)
  tagInput.value = ''
  // 从搜索结果中移除刚添加的标签
  const index = searchResults.value.findIndex(t => t.id === tag.id)
  if (index > -1) {
    searchResults.value.splice(index, 1)
  }
  // 如果搜索结果为空，隐藏搜索结果区域
  if (searchResults.value.length === 0) {
    showSearchResults.value = false
  }
}

// 移除标签
function removeTag(tag: TagVO) {
  const index = selectedTags.value.findIndex(t => t.id === tag.id)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  }
}

// 组件加载时加载最近使用的标签
onMounted(() => {
  loadRecentlyTags()
})
</script>

<style scoped>
.form-item {
  margin-bottom: 24px;
}

.item-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

/* 标签选择器容器 */
.tag-select-wrapper {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  padding: 16px;
  transition: all 0.3s ease;
}

.tag-select-wrapper:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 区域行 */
.section-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

/* 区域标题 */
.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #666;
  white-space: nowrap;
  flex-shrink: 0;
  width: 70px;
}

/* 空状态提示 */
.empty-placeholder-inline {
  font-size: 12px;
  color: #999;
  padding: 4px 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

/* 已选标签 */
.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
  align-items: center;
  min-height: 28px;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 16px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  gap: 6px;
}

.tag-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.tag-remove:hover {
  background: rgba(0, 0, 0, 0.2);
}

/* 标签输入行 */
.tag-input-row {
  flex: 1;
  display: flex;
  gap: 8px;
}

.tag-input {
  flex: 1;
  height: 32px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0 10px;
  font-size: 13px;
  outline: none;
  transition: all 0.3s ease;
}

.tag-input:focus {
  border-color: #667eea;
}

.search-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.search-btn:hover {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.search-btn:active {
  transform: scale(0.95);
}

/* 搜索结果区域 */
.search-results-section {
  margin-bottom: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.search-results {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
  align-items: center;
}

.search-tag-item {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 18px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-tag-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.search-tag-item:active {
  transform: translateY(0);
}

/* 最近使用的标签 */
.recently-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
  align-items: center;
}

.recently-tag-item {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 18px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recently-tag-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.recently-tag-item:active {
  transform: translateY(0);
}

/* 响应式 */
@media (max-width: 768px) {
  .form-item {
    margin-bottom: 20px;
  }

  .tag-select-wrapper {
    padding: 10px;
  }

  .tag-chip {
    font-size: 12px;
    padding: 5px 10px;
  }

  .recently-tag-item {
    font-size: 12px;
    padding: 5px 12px;
  }

  .tag-input {
    height: 36px;
    font-size: 13px;
  }
}
</style>
