<template>
  <MacOSLayout>
    <div class="page-container">
      <div class="form-content">
        <!-- 序号 -->
        <div class="form-item">
          <div class="item-label">
            序号
          </div>
          <div class="input-wrapper">
            <input
              v-model="formData.sequence"
              type="number"
              class="form-input"
              placeholder="请输入序号"
              min="1"
            >
          </div>
          <div class="char-hint">
            间隔阶段的序号，从小到大排列
          </div>
        </div>

        <!-- 间隔时间 -->
        <div class="form-item">
          <div class="item-label">
            间隔时间（小时）
          </div>
          <div class="input-wrapper">
            <input
              v-model="formData.intervalHours"
              type="number"
              class="form-input"
              placeholder="请输入间隔时间"
              min="0"
              step="0.1"
            >
          </div>
          <div class="char-hint">
            距离上次复习的时间间隔
          </div>
        </div>

        <!-- 掌握程度 -->
        <div class="form-item">
          <div class="item-label">
            掌握程度
          </div>
          <div class="mastery-options">
            <div
              v-for="option in masteryOptions"
              :key="option.value"
              class="mastery-option"
              :class="{ active: formData.requiredMasteryLevel === option.value }"
              @click="selectMastery(option.value)"
            >
              <div class="mastery-option-content">
                <div class="mastery-icon">
                  <div :class="option.iconClass" />
                </div>
                <div class="mastery-info">
                  <div class="mastery-name">
                    {{ option.name }}
                  </div>
                  <div class="mastery-desc">
                    {{ option.description }}
                  </div>
                </div>
              </div>
              <div v-if="formData.requiredMasteryLevel === option.value" class="check-icon">
                <div class="i-carbon-checkmark-filled text-white" />
              </div>
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
import { deleteIntervalUsingDelete, infoIntervalUsingGet, MASTERY_OPTIONS, saveIntervalUsingPost } from '@/service/learning/strategy'

// 是否为编辑模式
const intervalId = ref<string>()
const isEdit = computed(() => !!intervalId.value)
const strategyId = ref<string>()

// 掌握程度选项
const masteryOptions = MASTERY_OPTIONS

// 表单数据
const formData = ref({
  sequence: 1,
  intervalHours: 1,
  requiredMasteryLevel: 'STRANGER' as 'STRANGER' | 'FAMILIAR' | 'UNDERSTAND' | 'MASTER',
})

// 页面加载
onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.options || {}

  strategyId.value = options.strategyId

  if (options.id) {
    intervalId.value = options.id
    loadIntervalDetail()
  }
})

// 加载间隔配置详情（编辑模式）
async function loadIntervalDetail() {
  if (!intervalId.value)
    return

  uni.showLoading({ title: '加载中...' })

  try {
    const res = await infoIntervalUsingGet({
      id: intervalId.value,
    })

    formData.value = {
      sequence: res.sequence,
      intervalHours: res.intervalHours,
      requiredMasteryLevel: res.requiredMasteryLevel,
    }
  }
  catch (error) {
    console.error('加载间隔配置失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  }
  finally {
    uni.hideLoading()
  }
}

// 选择掌握程度
function selectMastery(level: 'STRANGER' | 'FAMILIAR' | 'UNDERSTAND' | 'MASTER') {
  formData.value.requiredMasteryLevel = level
}

// 取消
function handleCancel() {
  uni.navigateBack()
}

// 删除
async function handleDelete() {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个间隔配置吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteIntervalUsingDelete({ id: intervalId.value })
          uni.showToast({
            title: '删除成功',
            icon: 'success',
          })
          setTimeout(() => {
            uni.navigateBack()
          }, 1000)
        }
        catch (error) {
          console.error('删除间隔配置失败:', error)
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
  if (!formData.value.sequence || formData.value.sequence < 1) {
    uni.showToast({
      title: '请输入有效的序号',
      icon: 'none',
    })
    return
  }

  if (formData.value.intervalHours < 0) {
    uni.showToast({
      title: '间隔时间不能小于0',
      icon: 'none',
    })
    return
  }

  uni.showLoading({ title: '保存中...' })

  try {
    await saveIntervalUsingPost({
      body: {
        id: isEdit.value ? intervalId.value : undefined,
        strategyId: strategyId.value,
        sequence: formData.value.sequence,
        intervalHours: formData.value.intervalHours,
        requiredMasteryLevel: formData.value.requiredMasteryLevel,
      },
    })

    uni.showToast({
      title: isEdit.value ? '修改成功' : '创建成功',
      icon: 'success',
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  }
  catch (error) {
    console.error('保存间隔配置失败:', error)
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

/* 掌握程度选项 */
.mastery-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mastery-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border: 2px solid var(--macos-gray);
  border-radius: var(--macos-radius);
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.mastery-option:hover {
  border-color: var(--macos-blue);
  background: #f8fbff;
}

.mastery-option.active {
  border-color: var(--macos-blue);
  background: #f0f7ff;
  box-shadow: 2px 2px 0 rgba(0, 122, 255, 0.1);
}

.mastery-option-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.mastery-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: #f5f5f5;
  border-radius: 8px;
}

.mastery-info {
  flex: 1;
}

.mastery-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.mastery-desc {
  font-size: 12px;
  color: var(--macos-gray);
}

.check-icon {
  width: 28px;
  height: 28px;
  background: var(--macos-blue);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 16px;
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

  .mastery-option {
    padding: 12px 14px;
  }

  .mastery-icon {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
