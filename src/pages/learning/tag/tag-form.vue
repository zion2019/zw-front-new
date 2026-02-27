<template>
  <MacOSLayout>
    <div class="page-container">
      <div class="form-content">
        <!-- 标签名称 -->
        <div class="form-item">
          <div class="item-label">
            标签名称
          </div>
          <div class="input-wrapper">
            <input
              v-model="formData.name"
              class="form-input"
              placeholder="请输入标签名称"
              :maxlength="20"
            >
          </div>
          <div class="char-count">
            {{ formData.name.length }}/20
          </div>
        </div>

        <!-- 标签描述 -->
        <div class="form-item">
          <div class="item-label">
            标签描述
          </div>
          <textarea
            v-model="formData.description"
            class="form-textarea"
            placeholder="请输入标签描述"
            :maxlength="200"
          />
          <div class="char-count">
            {{ formData.description.length }}/200
          </div>
        </div>

        <!-- 标签背景色 -->
        <div class="form-item">
          <div class="item-label">
            标签背景
          </div>
          <div class="color-picker-wrapper">
            <div class="color-grid">
              <div
                v-for="color in presetColors"
                :key="color"
                class="color-option"
                :class="{ active: formData.backgroundColor === color }"
                :style="{ background: color }"
                @click="selectColor(color)"
              />
            </div>
            <div class="custom-color">
              <div class="custom-color-label">
                自定义颜色：
              </div>
              <input
                v-model="formData.backgroundColor"
                type="color"
                class="color-input"
              >
              <input
                v-model="formData.backgroundColor"
                type="text"
                class="color-text-input"
                placeholder="#667eea"
                maxlength="7"
              >
            </div>
          </div>
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
import { deleteUsingDelete, infoUsingGet, saveUsingPost } from '@/service/learning/tag'

// 是否为编辑模式
const tagId = ref(0)
const isEdit = computed(() => !!tagId.value)

// 表单数据
const formData = ref({
  name: '',
  description: '',
  backgroundColor: '#667eea',
})

// 预设颜色
const presetColors = [
  '#667eea',
  '#f56565',
  '#48bb78',
  '#ed8936',
  '#9f7aea',
  '#38b2ac',
  '#ed64a6',
  '#4299e1',
  '#9ae6b4',
  '#faf089',
  '#fbd38d',
  '#feb2b2',
  '#f687b3',
  '#b794f4',
  '#63b3ed',
]

// 页面加载
onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.options || {}

  if (options.id) {
    tagId.value = options.id
    loadTagDetail()
  }
})

// 加载标签详情
async function loadTagDetail() {
  try {
    const info = await infoUsingGet({ id: tagId.value })
    if (info) {
      formData.value = {
        name: info.name,
        description: info.description || '',
        backgroundColor: info.color,
      }
    }
    else {
      uni.showToast({
        title: '加载失败',
        icon: 'none',
      })
    }
  }
  catch (error) {
    console.error('加载标签详情失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  }
}

// 选择预设颜色
function selectColor(color: string) {
  formData.value.backgroundColor = color
}

// 取消
function handleCancel() {
  uni.navigateBack()
}

// 删除
async function handleDelete() {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个标签吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteUsingDelete({ id: tagId.value })
          uni.showToast({
            title: '删除成功',
            icon: 'success',
          })
          uni.navigateTo({ url: '/pages/learning/tag/tag-list' })
        }
        catch (error) {
          console.error('删除标签失败:', error)
          uni.showToast({
            title: '删除失败',
            icon: 'none',
          })
        }
      }
    },
  })
}

// 保存
async function handleSave() {
  if (!formData.value.name.trim()) {
    uni.showToast({
      title: '请输入标签名称',
      icon: 'none',
    })
    return
  }

  uni.showLoading({ title: '保存中...' })

  try {
    await saveUsingPost({
      body: {
        id: isEdit.value ? tagId.value : undefined,
        name: formData.value.name,
        color: formData.value.backgroundColor,
        description: formData.value.description,
      },
    })

    uni.showToast({
      title: isEdit.value ? '修改成功' : '创建成功',
      icon: 'success',
    })
    uni.navigateTo({ url: '/pages/learning/tag/tag-list' })
  }
  catch (error) {
    console.error('保存标签失败:', error)
    uni.showToast({
      title: '保存失败',
      icon: 'none',
    })
  }
  finally {
    uni.hideLoading()
  }
}
</script>

<style scoped>
@import '../../../theme/macos.css';
@import '../../../theme/form.css';

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

/* 颜色选择器 */
.color-picker-wrapper {
  border: 2px solid var(--macos-gray);
  border-radius: var(--macos-radius);
  background: white;
  padding: 16px;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.color-option {
  width: 100%;
  padding-bottom: 100%;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid transparent;
  position: relative;
}

.color-option:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.color-option.active {
  border-color: #000;
  transform: scale(1.05);
}

.color-option.active::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 16px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.custom-color {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--macos-gray);
}

.custom-color-label {
  font-size: 13px;
  color: var(--macos-dark-gray);
}

.color-input {
  width: 48px;
  height: 36px;
  border: 2px solid var(--macos-gray);
  border-radius: var(--macos-radius);
  cursor: pointer;
  padding: 0;
  background: white;
}

.color-text-input {
  flex: 1;
  height: 36px;
  border: 2px solid var(--macos-gray);
  border-radius: var(--macos-radius);
  font-size: 14px;
  background: white;
  padding: 0 8px;
}

.color-text-input:focus {
  border-color: var(--macos-blue);
  outline: none;
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

  .color-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
  }

  .custom-color {
    flex-wrap: wrap;
  }

  .color-text-input {
    width: 100%;
  }

  .form-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
