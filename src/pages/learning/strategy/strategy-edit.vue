<template>
  <MacOSLayout>
    <div class="page-container">
      <div class="form-content">
        <!-- 策略名称 -->
        <div class="form-item">
          <div class="item-label">
            策略名称
          </div>
          <div class="input-wrapper">
            <input
              v-model="formData.name"
              class="form-input"
              placeholder="请输入策略名称"
              :maxlength="50"
            >
          </div>
          <div class="char-count">
            {{ formData.name.length }}/50
          </div>
        </div>

        <!-- 策略描述 -->
        <div class="form-item">
          <div class="item-label">
            策略描述
          </div>
          <textarea
            v-model="formData.description"
            class="form-textarea"
            placeholder="请输入策略描述"
            :maxlength="500"
          />
          <div class="char-count">
            {{ formData.description.length }}/500
          </div>
        </div>

        <!-- 是否默认策略 -->
        <div class="form-item">
          <div class="item-label">
            设为默认策略
          </div>
          <div class="toggle-wrapper">
            <div
              class="toggle-switch"
              :class="{ active: formData.isDefault }"
              @click="toggleDefault"
            >
              <div class="toggle-thumb" />
            </div>
            <div class="toggle-label">
              {{ formData.isDefault ? '是' : '否' }}
            </div>
          </div>
          <div class="char-hint">
            默认策略将应用于新建的学习项目
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
import { deleteUsingDelete, infoUsingGet, saveUsingPost } from '@/service/learning/strategy'

// 是否为编辑模式
const strategyId = ref<string>()
const isEdit = computed(() => !!strategyId.value)

// 表单数据
const formData = ref({
  name: '',
  description: '',
  isDefault: false,
})

// 页面加载
onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.options || {}

  if (options.id) {
    strategyId.value = options.id
    loadStrategyDetail()
  }
})

// 加载策略详情
async function loadStrategyDetail() {
  try {
    const info = await infoUsingGet({ id: strategyId.value })
    if (info) {
      formData.value = {
        name: info.name,
        description: info.description || '',
        isDefault: info.isDefault,
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
    console.error('加载策略详情失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  }
}

// 切换默认策略
function toggleDefault() {
  formData.value.isDefault = !formData.value.isDefault
}

// 取消
function handleCancel() {
  uni.navigateBack()
}

// 删除
async function handleDelete() {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个策略吗？删除后将同时删除所有间隔配置。',
    success: async (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '删除中...' })
        try {
          await deleteUsingDelete({ id: strategyId.value })
          uni.showToast({
            title: '删除成功',
            icon: 'success',
          })
          setTimeout(() => {
            uni.navigateTo({ url: '/pages/learning/strategy/strategy-list' })
          }, 1500)
        }
        catch (error) {
          console.error('删除策略失败:', error)
          uni.showToast({
            title: '删除失败',
            icon: 'none',
          })
        }
        finally {
          uni.hideLoading()
        }
      }
    },
  })
}

// 保存
async function handleSave() {
  if (!formData.value.name.trim()) {
    uni.showToast({
      title: '请输入策略名称',
      icon: 'none',
    })
    return
  }

  uni.showLoading({ title: '保存中...' })

  try {
    await saveUsingPost({
      body: {
        id: isEdit.value ? strategyId.value : undefined,
        name: formData.value.name,
        description: formData.value.description,
        isDefault: formData.value.isDefault,
      },
    })

    uni.showToast({
      title: isEdit.value ? '修改成功' : '创建成功',
      icon: 'success',
    })
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/learning/strategy/strategy-list' })
    }, 1500)
  }
  catch (error) {
    console.error('保存策略失败:', error)
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

/* 开关切换器 */
.toggle-wrapper {
  border: 2px solid var(--macos-gray);
  border-radius: var(--macos-radius);
  background: white;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle-switch {
  position: relative;
  width: 52px;
  height: 28px;
  background: #e0e0e0;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-switch.active {
  background: var(--macos-blue);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch.active .toggle-thumb {
  left: 26px;
}

.toggle-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
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

  .toggle-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .form-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
