<template>
  <MacOSLayout>
    <div class="page-container">
      <div class="form-content">
        <!-- 所属学科（只读） -->
        <div class="form-item">
          <div class="item-label">
            所属学科
          </div>
          <div class="subject-display">
            <div class="subject-icon">
              <div class="i-carbon-book text-macos-blue" />
            </div>
            <div class="subject-info">
              <div class="subject-name">
                {{ subjectInfo.name }}
              </div>
              <div class="subject-desc">
                学科名称
              </div>
            </div>
          </div>
        </div>

        <!-- 阶段名称 -->
        <div class="form-item">
          <div class="item-label">
            阶段名称
          </div>
          <input
            v-model="formData.name"
            class="form-input"
            placeholder="请输入阶段名称"
            :maxlength="50"
          >
          <div class="char-count">
            {{ formData.name.length }}/50
          </div>
        </div>

        <!-- 阶段描述 -->
        <div class="form-item">
          <div class="item-label">
            阶段描述
          </div>
          <textarea
            v-model="formData.description"
            class="form-textarea"
            placeholder="请输入阶段描述"
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
import MacOSLayout from '@/components/MacOSLayout.vue'

// 是否为编辑模式
const isEdit = ref(false)
const stageId = ref<number>(0)

// 所属学科信息
const subjectInfo = ref({
  id: 0,
  name: '',
})

// 表单数据
const formData = ref({
  name: '',
  description: '',
  status: 'learning' as 'learning' | 'delayed' | 'mastered',
})

// 页面加载
onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.options || {}

  // 获取所属学科ID（实际应用中从路由参数或API获取）
  const subjectId = options.subjectId ? Number.parseInt(options.subjectId, 10) : 1

  if (options.id) {
    isEdit.value = true
    stageId.value = Number.parseInt(options.id, 10)
    loadStageDetail()
  }

  // 加载所属学科信息
  loadSubjectInfo(subjectId)
})

// 加载阶段详情
function loadStageDetail() {
  // 模拟数据
  formData.value = {
    name: `阶段名称 ${stageId.value}`,
    description: '这是一个阶段描述',
    status: 'learning',
  }

  // 加载阶段详情时也加载所属学科信息
  loadSubjectInfo(1)
}

// 加载所属学科信息
function loadSubjectInfo(subjectId: number) {
  // 模拟数据
  subjectInfo.value = {
    id: subjectId,
    name: 'Vue.js 前端开发',
  }
}

// 取消
function handleCancel() {
  uni.navigateBack()
}

// 删除
function handleDelete() {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个阶段吗？',
    success: (res) => {
      if (res.confirm) {
        console.log('删除阶段:', stageId.value)
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
      title: '请输入阶段名称',
      icon: 'none',
    })
    return
  }

  console.log('保存阶段:', {
    id: isEdit.value ? stageId.value : undefined,
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

/* 学科展示卡片 */
.subject-display {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  border: 2px solid var(--macos-gray);
  border-radius: var(--macos-radius);
  cursor: not-allowed;
  opacity: 0.7;
}

.subject-icon {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.subject-info {
  flex: 1;
}

.subject-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.subject-desc {
  font-size: 12px;
  color: var(--macos-gray);
}

/* 状态选择器 */
.status-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.status-option {
  flex: 1;
  min-width: 80px;
  padding: 10px 16px;
  background: #f0f0f0;
  color: #333;
  border: 2px solid transparent;
  border-radius: var(--macos-radius);
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.status-option:hover {
  background: #e0e0e0;
}

.status-option.active {
  background: var(--macos-blue);
  color: white;
  border-color: var(--macos-blue);
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
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

  .subject-display {
    padding: 12px 14px;
  }

  .subject-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }

  .form-content {
    padding: 16px;
  }

  .status-options {
    flex-direction: column;
  }

  .status-option {
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
