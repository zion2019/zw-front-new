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

        <!-- 所属阶段（只读） -->
        <div class="form-item">
          <div class="item-label">
            所属阶段
          </div>
          <div class="stage-display">
            <div class="stage-icon">
              <div class="i-carbon-list-boxes text-macos-blue" />
            </div>
            <div class="stage-info">
              <div class="stage-name">
                {{ stageInfo.name }}
              </div>
              <div class="stage-desc">
                阶段名称
              </div>
            </div>
          </div>
        </div>

        <!-- 所属知识点（只读） -->
        <div class="form-item">
          <div class="item-label">
            所属知识点
          </div>
          <div class="knowledge-display">
            <div class="knowledge-icon">
              <div class="i-carbon-document text-macos-blue" />
            </div>
            <div class="knowledge-info">
              <div class="knowledge-name">
                {{ knowledgeInfo.name }}
              </div>
              <div class="knowledge-desc">
                知识点名称
              </div>
            </div>
          </div>
        </div>

        <!-- 拆解点名称 -->
        <div class="form-item">
          <div class="item-label">
            拆解点名称
          </div>
          <input
            v-model="formData.name"
            class="form-input"
            placeholder="请输入拆解点名称"
            :maxlength="50"
          >
          <div class="char-count">
            {{ formData.name.length }}/50
          </div>
        </div>

        <!-- 拆解点内容（富文本编辑器） -->
        <div class="form-item editor-item">
          <div class="item-label">
            拆解点内容
          </div>
          <div class="editor-toolbar">
            <div
              class="toolbar-btn"
              @click="insertImage"
            >
              <div class="i-carbon-image text-gray-600" />
            </div>
          </div>
        </div>
        <div class="editor-wrapper">
          <editor
            id="editor"
            v-model="formData.content"
            placeholder="请输入拆解点内容..."
            :read-only="false"
            show-img-size
            show-img-toolbar
            @statuschange="onStatusChange"
            @ready="onEditorReady"
            @focus="onEditorFocus"
            @blur="onEditorBlur"
          />
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
const breakDownId = ref<number>(0)

// 所属学科信息
const subjectInfo = ref({
  id: 0,
  name: '',
})

// 所属阶段信息
const stageInfo = ref({
  id: 0,
  name: '',
})

// 所属知识点信息
const knowledgeInfo = ref({
  id: 0,
  name: '',
})

// 表单数据
const formData = ref({
  name: '',
  content: '',
  priority: 'medium' as 'high' | 'medium' | 'low',
  status: 'pending' as 'pending' | 'completed',
})

// 优先级选项
const priorityOptions = [
  { label: '高', value: 'high' },
  { label: '中', value: 'medium' },
  { label: '低', value: 'low' },
]

// 状态选项
const statusOptions = [
  { label: '待完成', value: 'pending' },
  { label: '已完成', value: 'completed' },
]

// 页面加载
onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.options || {}

  if (options.id) {
    isEdit.value = true
    breakDownId.value = Number.parseInt(options.id, 10)
    loadBreakDownDetail()
  }

  // 加载所属学科、阶段、知识点信息
  loadSubjectInfo(1)
  loadStageInfo(1)
  loadKnowledgeInfo(1)
})

// 加载拆解点详情
function loadBreakDownDetail() {
  // 模拟数据
  formData.value = {
    name: `拆解点名称 ${breakDownId.value}`,
    content: '<p>这是拆解点的详细内容</p>',
    priority: 'medium',
    status: 'pending',
  }
}

// 加载所属学科信息
function loadSubjectInfo(subjectId: number) {
  // 模拟数据
  subjectInfo.value = {
    id: subjectId,
    name: 'Vue.js 前端开发',
  }
}

// 加载所属阶段信息
function loadStageInfo(stageId: number) {
  // 模拟数据
  stageInfo.value = {
    id: stageId,
    name: '基础阶段',
  }
}

// 加载所属知识点信息
function loadKnowledgeInfo(knowledgeId: number) {
  // 模拟数据
  knowledgeInfo.value = {
    id: knowledgeId,
    name: 'Vue 组件',
  }
}

// 插入图片
function insertImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      // 在实际应用中，这里应该上传图片到服务器
      // 获取 editor 上下文并插入图片
      const editorContext = uni.createEditorContext()
      if (res.tempFilePaths && res.tempFilePaths.length > 0) {
        // 模拟插入图片（实际需要上传后使用网络地址）
        editorContext.insertImage({
          src: res.tempFilePaths[0],
          width: '100%',
          alt: '图片',
        })
      }
    },
    fail: (err) => {
      console.error('选择图片失败:', err)
      uni.showToast({
        title: '选择图片失败',
        icon: 'none',
      })
    },
  })
}

// 编辑器准备就绪
function onEditorReady() {
  console.log('编辑器准备就绪')
}

// 编辑器内容变化
function onStatusChange(e: any) {
  console.log('编辑器内容变化:', e)
}

// 编辑器获得焦点
function onEditorFocus() {
  console.log('编辑器获得焦点')
}

// 编辑器失去焦点
function onEditorBlur() {
  console.log('编辑器失去焦点')
}

// 取消
function handleCancel() {
  uni.navigateBack()
}

// 删除
function handleDelete() {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个拆解点吗？',
    success: (res) => {
      if (res.confirm) {
        console.log('删除拆解点:', breakDownId.value)
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
      title: '请输入拆解点名称',
      icon: 'none',
    })
    return
  }

  if (!formData.value.content.trim()) {
    uni.showToast({
      title: '请输入拆解点内容',
      icon: 'none',
    })
    return
  }

  console.log('保存拆解点:', {
    id: isEdit.value ? breakDownId.value : undefined,
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
  max-width: 800px;
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

/* 阶段展示卡片 */
.stage-display {
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

.stage-icon {
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

.stage-info {
  flex: 1;
}

.stage-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.stage-desc {
  font-size: 12px;
  color: var(--macos-gray);
}

/* 知识点展示卡片 */
.knowledge-display {
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

.knowledge-icon {
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

.knowledge-info {
  flex: 1;
}

.knowledge-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.knowledge-desc {
  font-size: 12px;
  color: var(--macos-gray);
}

/* 优先级选择器 */
.priority-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.priority-option {
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

.priority-option:hover {
  background: #e0e0e0;
}

.priority-option.active {
  background: var(--macos-blue);
  color: white;
  border-color: var(--macos-blue);
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
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

/* 编辑器工具栏 */
.editor-item {
  margin-bottom: 0;
}

.editor-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.toolbar-btn {
  width: 36px;
  height: 36px;
  background: white;
  border: 2px solid var(--macos-gray);
  border-radius: var(--macos-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 18px;
}

.toolbar-btn:hover {
  border-color: var(--macos-blue);
  background: #f0f8ff;
}

.toolbar-btn:active {
  transform: scale(0.95);
}

/* 编辑器容器 */
.editor-wrapper {
  width: 100%;
  height: 400px;
  border: 2px solid var(--macos-gray);
  border-radius: var(--macos-radius);
  overflow: hidden;
  background: white;
}

.editor-wrapper :deep(.ql-editor) {
  font-size: 14px;
  line-height: 1.8;
  padding: 12px;
  min-height: 376px;
}

.editor-wrapper :deep(.ql-container) {
  border: none;
  font-family: inherit;
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

  .subject-display,
  .stage-display,
  .knowledge-display {
    padding: 12px 14px;
  }

  .subject-icon,
  .stage-icon,
  .knowledge-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }

  .editor-wrapper {
    height: 300px;
  }

  .priority-options,
  .status-options {
    flex-direction: column;
  }

  .priority-option,
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
