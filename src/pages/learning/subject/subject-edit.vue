<template>
  <MacOSLayout>
    <div class="page-container">
      <div class="form-content">
        <!-- 封面图片 -->
        <div class="form-item">
          <div class="item-label">封面</div>
          <div class="cover-upload" @click="chooseCover">
            <image
              v-if="formData.coverImage"
              :src="formData.coverImage"
              mode="aspectFill"
              class="cover-preview"
            />
            <div v-else class="upload-placeholder">
              <div class="upload-icon">📷</div>
              <div class="upload-text">点击上传封面</div>
            </div>
          </div>
        </div>

        <!-- 名称 -->
        <div class="form-item">
          <div class="item-label">名称</div>
          <input
            v-model="formData.name"
            class="form-input"
            placeholder="请输入科目名称"
            :maxlength="50"
          >
          <div class="char-count">{{ formData.name.length }}/50</div>
        </div>

        <!-- 标签 -->
        <div class="form-item">
          <div class="item-label">标签</div>
          <div class="tag-select-wrapper">
            <div class="selected-tags">
              <div
                v-for="(tag, index) in formData.tags"
                :key="index"
                class="tag-chip"
              >
                {{ tag }}
                <span class="tag-remove" @click="removeTag(index)">×</span>
              </div>
            </div>
            <div class="tag-input-row">
              <input
                v-model="tagInput"
                class="tag-input"
                placeholder="输入标签，支持模糊搜索"
                @focus="showTagList = true"
                @blur="handleTagInputBlur"
              >
              <div class="add-tag-btn" @click="addTag">
                添加
              </div>
            </div>
            <!-- 常用标签列表 -->
            <div v-show="showTagList" class="tag-list">
              <div
                v-for="tag in filteredTags"
                :key="tag"
                class="tag-option"
                @click="selectTag(tag)"
              >
                {{ tag }}
              </div>
              <div v-if="filteredTags.length === 0" class="tag-option tag-option-empty">
                没有匹配的标签
              </div>
            </div>
          </div>
          <!-- 常用标签枚举 -->
          <div class="common-tags">
            <div class="common-tags-label">常用标签：</div>
            <div
              v-for="tag in commonTags"
              :key="tag"
              class="common-tag-item"
              @click="addCommonTag(tag)"
            >
              {{ tag }}
            </div>
          </div>
        </div>

        <!-- 描述 -->
        <div class="form-item">
          <div class="item-label">描述</div>
          <textarea
            v-model="formData.description"
            class="form-textarea"
            placeholder="请输入科目描述"
            :maxlength="500"
          />
          <div class="char-count">{{ formData.description.length }}/500</div>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <div class="action-btn action-btn-cancel" @click="handleCancel">
            取消
          </div>
          <div v-if="isEdit" class="action-btn action-btn-delete" @click="handleDelete">
            删除
          </div>
          <div class="action-btn action-btn-save" @click="handleSave">
            保存
          </div>
        </div>
      </div>
    </div>
  </MacOSLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MacOSLayout from '@/components/MacOSLayout.vue'

// 是否为编辑模式
const isEdit = ref(false)
const subjectId = ref<number>(0)

// 表单数据
const formData = ref({
  name: '',
  coverImage: '',
  tags: [] as string[],
  description: '',
})

// 标签输入
const tagInput = ref('')
const showTagList = ref(false)

// 常用标签枚举
const commonTags = ['Vue', 'React', 'TypeScript']

// 所有可选标签（可以根据需要扩展）
const allTags = [
  'Vue', 'React', 'TypeScript', 'JavaScript', 'Python',
  'Java', 'Go', 'Rust', 'C++', '前端', '后端', '全栈',
  '移动开发', '小程序', 'Node.js', 'Spring Boot', 'Docker'
]

// 过滤后的标签列表
const filteredTags = computed(() => {
  if (!tagInput.value) {
    return allTags.filter(tag => !formData.value.tags.includes(tag))
  }
  const searchLower = tagInput.value.toLowerCase()
  return allTags.filter(tag =>
    tag.toLowerCase().includes(searchLower) &&
    !formData.value.tags.includes(tag)
  )
})

// 页面加载
onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.options || {}

  if (options.id) {
    isEdit.value = true
    subjectId.value = Number.parseInt(options.id, 10)
    loadSubjectDetail()
  }
})

// 加载科目详情
function loadSubjectDetail() {
  // 模拟数据
  formData.value = {
    name: `科目名称 ${subjectId.value}`,
    coverImage: '',
    tags: ['Vue', 'TypeScript'],
    description: '这是一个科目描述',
  }
}

// 选择封面
function chooseCover() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      formData.value.coverImage = res.tempFilePaths[0]
    },
  })
}

// 添加标签
function addTag() {
  if (!tagInput.value.trim()) {
    return
  }
  if (formData.value.tags.includes(tagInput.value.trim())) {
    uni.showToast({
      title: '标签已存在',
      icon: 'none',
    })
    return
  }
  formData.value.tags.push(tagInput.value.trim())
  tagInput.value = ''
  showTagList.value = false
}

// 从下拉列表选择标签
function selectTag(tag: string) {
  if (!formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag)
  }
  tagInput.value = ''
  showTagList.value = false
}

// 添加常用标签
function addCommonTag(tag: string) {
  if (!formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag)
  }
}

// 移除标签
function removeTag(index: number) {
  formData.value.tags.splice(index, 1)
}

// 标签输入框失焦处理
function handleTagInputBlur() {
  setTimeout(() => {
    showTagList.value = false
  }, 200)
}

// 取消
function handleCancel() {
  uni.navigateBack()
}

// 删除
function handleDelete() {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个科目吗？',
    success: (res) => {
      if (res.confirm) {
        console.log('删除科目:', subjectId.value)
        uni.showToast({
          title: '删除成功',
          icon: 'success',
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1000)
      }
    },
  })
}

// 保存
function handleSave() {
  if (!formData.value.name.trim()) {
    uni.showToast({
      title: '请输入科目名称',
      icon: 'none',
    })
    return
  }

  console.log('保存科目:', {
    id: isEdit.value ? subjectId.value : undefined,
    ...formData.value,
  })

  uni.showToast({
    title: isEdit.value ? '修改成功' : '创建成功',
    icon: 'success',
  })

  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}
</script>

<style scoped>
@import '../../../theme/macos.css';

.page-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.form-content {
  background: white;
  border-radius: var(--macos-radius-large);
  padding: 24px;
  border: 2px solid #000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 24px;
  position: relative;
}

.item-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

/* 封面上传 */
.cover-upload {
  width: 100%;
  height: 200px;
  border: 2px dashed var(--macos-gray);
  border-radius: var(--macos-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f8f8;
  overflow: hidden;
}

.cover-upload:hover {
  border-color: var(--macos-blue);
  background: #f0f8ff;
}

.cover-preview {
  width: 100%;
  height: 100%;
}

.upload-placeholder {
  text-align: center;
  color: var(--macos-gray);
}

.upload-icon {
  font-size: 40px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
}

/* 输入框 */
.form-input {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--macos-gray);
  border-radius: var(--macos-radius);
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  border-color: var(--macos-blue);
  outline: none;
}

.form-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--macos-gray);
  border-radius: var(--macos-radius);
  font-size: 14px;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  background: white;
  font-family: inherit;
}

.form-textarea:focus {
  border-color: var(--macos-blue);
  outline: none;
}

.char-count {
  position: absolute;
  right: 0;
  bottom: -20px;
  font-size: 12px;
  color: var(--macos-gray);
}

/* 标签选择器 */
.tag-select-wrapper {
  border: 2px solid var(--macos-gray);
  border-radius: var(--macos-radius);
  background: white;
}

.selected-tags {
  padding: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 48px;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: var(--macos-blue);
  color: white;
  border-radius: 12px;
  font-size: 12px;
  gap: 6px;
}

.tag-remove {
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0 2px;
}

.tag-remove:hover {
  opacity: 0.8;
}

.tag-input-row {
  display: flex;
  border-top: 1px solid var(--macos-gray);
}

.tag-input {
  flex: 1;
  padding: 10px 12px;
  border: none;
  outline: none;
  font-size: 14px;
  background: white;
}

.add-tag-btn {
  padding: 0 16px;
  background: var(--macos-blue);
  color: white;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.add-tag-btn:hover {
  background: #0066cc;
}

.tag-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid var(--macos-gray);
  border-top: none;
  border-radius: 0 0 var(--macos-radius) var(--macos-radius);
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tag-option {
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 14px;
}

.tag-option:hover {
  background: #f0f8ff;
}

.tag-option-empty {
  color: var(--macos-gray);
  cursor: default;
}

.tag-option-empty:hover {
  background: transparent;
}

/* 常用标签 */
.common-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.common-tags-label {
  font-size: 12px;
  color: var(--macos-gray);
}

.common-tag-item {
  padding: 4px 10px;
  background: #f0f0f0;
  color: #333;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.common-tag-item:hover {
  background: var(--macos-blue);
  color: white;
  border-color: var(--macos-blue);
}

/* 操作按钮 */
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.action-btn {
  flex: 1;
  padding: 12px;
  text-align: center;
  border-radius: var(--macos-radius);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn-cancel {
  background: #f0f0f0;
  color: #333;
  border: 2px solid transparent;
}

.action-btn-cancel:hover {
  background: #e0e0e0;
}

.action-btn-delete {
  background: #ffebee;
  color: #d32f2f;
  border: 2px solid transparent;
}

.action-btn-delete:hover {
  background: #ffcdd2;
}

.action-btn-save {
  background: var(--macos-blue);
  color: white;
  border: 2px solid #000;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
}

.action-btn-save:hover {
  background: #0066cc;
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .form-content {
    padding: 16px;
  }

  .cover-upload {
    height: 160px;
  }

  .upload-icon {
    font-size: 32px;
  }

  .upload-text {
    font-size: 12px;
  }

  .form-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
