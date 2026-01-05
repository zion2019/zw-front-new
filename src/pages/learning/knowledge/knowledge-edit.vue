<template>
  <MacOSLayout>
    <div class="page-container">
      <div class="form-content">
        <!-- 所属学科 -->
        <div class="form-item">
          <div class="item-label">
            所属学科
          </div>
          <!-- 只读模式 -->
          <div v-if="!canEditSubject" class="subject-display">
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
          <!-- 可编辑模式 -->
          <div v-else class="search-wrapper">
            <u-input
              v-model="subjectSearchKeyword"
              placeholder="输入搜索学科"
              :border="true"
              @focus="showSubjectList = true"
              @update:model-value="searchSubject"
              @blur="handleSubjectBlur"
            />
            <div v-if="showSubjectList && subjectSearchResults.length > 0" class="search-dropdown">
              <div
                v-for="item in subjectSearchResults"
                :key="item.id"
                class="search-option"
                @click="selectSubject(item)"
              >
                <div class="search-option-icon">
                  <div class="i-carbon-book text-macos-gray" />
                </div>
                <span>{{ item.name }}</span>
              </div>
            </div>
            <div v-if="showSubjectList && subjectSearchResults.length === 0 && subjectSearchKeyword" class="search-empty">
              未找到匹配的学科
            </div>
          </div>
        </div>

        <!-- 所属阶段 -->
        <div class="form-item">
          <div class="item-label">
            所属阶段
          </div>
          <!-- 只读模式 -->
          <div v-if="!canEditStage" class="stage-display">
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
          <!-- 可编辑模式 -->
          <div v-else class="search-wrapper">
            <u-input
              v-model="stageSearchKeyword"
              placeholder="搜索阶段（最多显示10条）"
              :border="true"
              @focus="showStageList = true"
              @update:model-value="searchStage"
              @blur="handleStageBlur"
            />
            <div v-if="showStageList && stageSearchResults.length > 0" class="search-dropdown">
              <div
                v-for="item in stageSearchResults"
                :key="item.id"
                class="search-option"
                @click="selectStage(item)"
              >
                <div class="search-option-icon">
                  <div class="i-carbon-list-boxes text-macos-gray" />
                </div>
                <span>{{ item.name }}</span>
              </div>
            </div>
            <div v-if="showStageList && stageSearchResults.length === 0 && stageSearchKeyword" class="search-empty">
              未找到匹配的阶段
            </div>
          </div>
        </div>

        <!-- 学习策略 -->
        <div class="form-item">
          <div class="item-label">
            学习策略
          </div>
          <!-- 只读模式 -->
          <div v-if="!canEditStrategy" class="strategy-display">
            <div class="strategy-icon">
              <div class="i-carbon-settings text-macos-blue" />
            </div>
            <div class="strategy-info">
              <div class="strategy-name">
                {{ strategyInfo.name }}
              </div>
              <div class="strategy-desc">
                策略名称
                <span v-if="strategyInfo.isDefault" class="default-badge">默认</span>
              </div>
            </div>
          </div>
          <!-- 可编辑模式 -->
          <div v-else class="search-wrapper">
            <u-input
              v-model="strategySearchKeyword"
              placeholder="搜索学习策略（最多显示10条）"
              :border="true"
              @focus="showStrategyList = true"
              @update:model-value="searchStrategy"
              @blur="handleStrategyBlur"
            />
            <div v-if="showStrategyList && strategySearchResults.length > 0" class="search-dropdown">
              <div
                v-for="item in strategySearchResults"
                :key="item.id"
                class="search-option"
                @click="selectStrategy(item)"
              >
                <div class="search-option-icon">
                  <div class="i-carbon-settings text-macos-gray" />
                </div>
                <div class="search-option-text">
                  <span>{{ item.name }}</span>
                  <span v-if="item.isDefault" class="default-small-badge">默认</span>
                </div>
              </div>
            </div>
            <div v-if="showStrategyList && strategySearchResults.length === 0 && strategySearchKeyword" class="search-empty">
              未找到匹配的策略
            </div>
          </div>
        </div>

        <!-- 知识点名称 -->
        <div class="form-item">
          <div class="item-label">
            知识点名称
          </div>
          <u-input
            v-model="formData.name"
            placeholder="请输入知识点名称"
            :maxlength="50"
            :border="true"
            show-word-limit
          />
        </div>

        <!-- 知识点描述 -->
        <div class="form-item">
          <div class="item-label">
            知识点描述
          </div>
          <u-textarea
            v-model="formData.description"
            placeholder="请输入知识点描述"
            :maxlength="500"
            :border="true"
            show-word-limit
            height="120"
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
import { computed, onMounted, ref } from 'vue'
import MacOSLayout from '@/components/MacOSLayout.vue'

const knowledgeId = ref<number>(0)
const subjectIdParam = ref<number>(0)
const stageIdParam = ref<number>(0)
const strategyIdParam = ref<number>(0)

// 是否为编辑模式
const isEdit = computed(() => !!knowledgeId.value)

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

// 学习策略信息
const strategyInfo = ref({
  id: 0,
  name: '',
  isDefault: false,
})

// 学科搜索
const subjectSearchKeyword = ref('')
const showSubjectList = ref(false)
const subjectSearchResults = ref<Array<{ id: number, name: string }>>([])

// 阶段搜索
const stageSearchKeyword = ref('')
const showStageList = ref(false)
const stageSearchResults = ref<Array<{ id: number, name: string }>>([])

// 策略搜索
const strategySearchKeyword = ref('')
const showStrategyList = ref(false)
const strategySearchResults = ref<Array<{ id: number, name: string, isDefault: boolean }>>([])

// 表单数据
const formData = ref({
  name: '',
  description: '',
  status: 'learning' as 'learning' | 'delayed' | 'mastered',
})

// 控制字段是否可编辑
// 编辑模式下，如果已有关联数据（从后台加载），则不可编辑
// 新增模式下，如果没有传入ID参数，则可编辑
const canEditSubject = computed(() => !isEdit.value)
const canEditStage = computed(() => !isEdit.value)
const canEditStrategy = computed(() => !isEdit.value)

// 页面加载
onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.options || {}

  if (options.id) {
    knowledgeId.value = Number.parseInt(options.id, 10)
    loadKnowledgeDetail()
  }

  subjectIdParam.value = Number.parseInt(options.subjectId || '0', 10)
  stageIdParam.value = Number.parseInt(options.stageId || '0', 10)
  strategyIdParam.value = Number.parseInt(options.strategyId || '0', 10)

  // 如果传入了学科ID，加载学科信息
  if (subjectIdParam.value) {
    loadSubjectInfo(subjectIdParam.value)
  }

  // 如果传入了阶段ID，加载阶段信息
  if (stageIdParam.value) {
    loadStageInfo(stageIdParam.value)
  }

  // 如果传入了策略ID，加载策略信息
  if (strategyIdParam.value) {
    loadStrategyInfo(strategyIdParam.value)
  }
})

// 加载知识点详情
function loadKnowledgeDetail() {
  // 模拟数据
  formData.value = {
    name: `知识点名称 ${knowledgeId.value}`,
    description: '这是一个知识点描述',
    status: 'learning',
  }

  // 如果已有策略ID，加载相关信息
  if (strategyInfo.value.id) {
    loadSubjectInfo(1)
    loadStageInfo(1)
  }
}

// 加载所属学科信息
function loadSubjectInfo(subjectId: number) {
  // 模拟数据
  subjectInfo.value = {
    id: subjectId,
    name: `学科名称 ${subjectId}`,
  }
}

// 加载所属阶段信息
function loadStageInfo(stageId: number) {
  // 模拟数据
  stageInfo.value = {
    id: stageId,
    name: `阶段名称 ${stageId}`,
  }
}

// 加载学习策略信息
function loadStrategyInfo(strategyId: number) {
  // 模拟数据
  strategyInfo.value = {
    id: strategyId,
    name: `学习策略 ${strategyId} - 艾宾浩斯记忆法`,
    isDefault: strategyId === 1,
  }
}

// 学科搜索
function searchSubject(keyword: string) {
  if (!keyword.trim()) {
    subjectSearchResults.value = []
    return
  }

  // 模拟搜索
  setTimeout(() => {
    const mockResults = Array.from({ length: Math.min(10, keyword.length) + 1 }, (_, index) => ({
      id: index + 1,
      name: `${keyword}相关学科${index + 1}`,
    }))
    subjectSearchResults.value = mockResults
  }, 200)
}

// 选择学科
function selectSubject(subject: { id: number, name: string }) {
  subjectInfo.value = subject
  subjectSearchKeyword.value = ''
  subjectSearchResults.value = []
  showSubjectList.value = false
  // 重置阶段信息
  stageInfo.value = { id: 0, name: '' }
}

// 学科输入框失焦
function handleSubjectBlur() {
  setTimeout(() => {
    showSubjectList.value = false
  }, 200)
}

// 阶段搜索
function searchStage(keyword: string) {
  if (!keyword.trim()) {
    stageSearchResults.value = []
    return
  }

  // 模拟搜索
  setTimeout(() => {
    const mockResults = Array.from({ length: Math.min(10, keyword.length) + 1 }, (_, index) => ({
      id: index + 1,
      name: `${keyword}相关阶段${index + 1}`,
    }))
    stageSearchResults.value = mockResults
  }, 200)
}

// 选择阶段
function selectStage(stage: { id: number, name: string }) {
  stageInfo.value = stage
  stageSearchKeyword.value = ''
  stageSearchResults.value = []
  showStageList.value = false
}

// 阶段输入框失焦
function handleStageBlur() {
  setTimeout(() => {
    showStageList.value = false
  }, 200)
}

// 策略搜索
function searchStrategy(keyword: string) {
  if (!keyword.trim()) {
    strategySearchResults.value = []
    return
  }

  // 模拟搜索
  setTimeout(() => {
    const mockResults = Array.from({ length: Math.min(10, keyword.length) + 1 }, (_, index) => ({
      id: index + 1,
      name: `${keyword}相关策略${index + 1}`,
      isDefault: index === 0,
    }))
    strategySearchResults.value = mockResults
  }, 200)
}

// 选择策略
function selectStrategy(strategy: { id: number, name: string, isDefault: boolean }) {
  strategyInfo.value = strategy
  strategySearchKeyword.value = ''
  strategySearchResults.value = []
  showStrategyList.value = false
}

// 策略输入框失焦
function handleStrategyBlur() {
  setTimeout(() => {
    showStrategyList.value = false
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
    content: '确定要删除这个知识点吗？',
    success: (res) => {
      if (res.confirm) {
        console.log('删除知识点:', knowledgeId.value)
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
      title: '请输入知识点名称',
      icon: 'none',
    })
    return
  }

  console.log('保存知识点:', {
    id: isEdit.value ? knowledgeId.value : undefined,
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

.form-item {
  margin-bottom: 24px;
  position: relative;
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

/* 策略展示卡片 */
.strategy-display {
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

.strategy-icon {
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

.strategy-info {
  flex: 1;
}

.strategy-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.strategy-desc {
  font-size: 12px;
  color: var(--macos-gray);
  display: flex;
  align-items: center;
  gap: 6px;
}

.default-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
  color: white;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
}

/* 搜索下拉框 */
.search-wrapper {
  position: relative;
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid var(--macos-gray);
  border-top: none;
  border-radius: 0 0 var(--macos-radius) var(--macos-radius);
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-option {
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.search-option:hover {
  background: #f0f8ff;
}

.search-option-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.search-option-text {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.default-small-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
  color: white;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
}

.search-empty {
  padding: 12px;
  text-align: center;
  color: var(--macos-gray);
  font-size: 13px;
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

  .form-content {
    padding: 16px;
  }

  .subject-display,
  .stage-display,
  .strategy-display {
    padding: 12px 14px;
  }

  .subject-icon,
  .stage-icon,
  .strategy-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
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
