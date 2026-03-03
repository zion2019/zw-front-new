<template>
  <MacOSLayout>
    <div class="page-container">
      <div class="form-content">
        <!-- 封面图片 -->
        <div class="form-item">
          <div class="item-label">
            封面
          </div>
          <ImageUploader
            v-model="formData.coverImage"
            placeholder="点击上传封面"
            :base-url="config.imageBaseUrl"
            @upload-success="handleCoverUploadSuccess"
          />
        </div>

        <!-- 名称 -->
        <div class="form-item">
          <div class="item-label">
            名称
          </div>
          <div class="input-wrapper">
            <input
              v-model="formData.name"
              class="form-input"
              placeholder="请输入科目名称"
              :maxlength="50"
            >
          </div>
          <div class="char-count">
            {{ formData.name.length }}/50
          </div>
        </div>

        <!-- 标签 -->
        <TagSelection
          v-model="formData.tags"
          label="标签"
          @change="handleTagsChange"
        />

        <!-- 描述 -->
        <div class="form-item">
          <div class="item-label">
            描述
          </div>
          <textarea
            v-model="formData.description"
            class="form-textarea"
            placeholder="请输入科目描述"
            :maxlength="500"
          />
          <div class="char-count">
            {{ formData.description.length }}/500
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
import { onMounted, ref } from 'vue'
import ImageUploader from '@/components/ImageUploader.vue'
import MacOSLayout from '@/components/MacOSLayout.vue'
import { config } from '@/config'
import TagSelection from '@/pages/learning/tag/tag-selection.vue'

// 是否为编辑模式
const isEdit = ref(false)
const subjectId = ref<number>(0)

// 表单数据
const formData = ref({
  name: '',
  coverImage: '',
  tags: [],
  description: '',
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
    tags: [
      {
        id: 1,
        name: 'Vue',
        color: '#667eea',
      },
      {
        id: 2,
        name: 'TypeScript',
        color: '#48bb78',
      },
    ],
    description: '这是一个科目描述',
  }
}

// 标签变化处理
function handleTagsChange(tags) {
  console.log('标签变化:', tags)
  // 这里可以添加自定义的业务逻辑
}

// 封面上传成功
function handleCoverUploadSuccess(fileUrl: string, fileData: any) {
  console.log('封面上传成功:', fileUrl, fileData)
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
@import '../../../theme/form.css';

.page-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
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

  .form-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
