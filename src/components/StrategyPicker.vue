<template>
  <picker
    :value="currentIndex"
    :range="strategyList"
    range-key="name"
    @change="handlePickerChange"
  >
    <view class="strategy-picker">
      <view class="picker-display">
        <text class="picker-text" :class="[{ placeholder: !selectedStrategyId }]">
          {{ selectedStrategyText }}
        </text>
        <text class="picker-arrow">›</text>
      </view>
    </view>
  </picker>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { pageUsingGet } from '@/service/learning/strategy'

interface StrategyVO {
  id: string
  name: string
  description: string
  isDefault: boolean
}

interface Props {
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [strategy: StrategyVO]
}>()

const selectedStrategyId = ref<string>(props.modelValue)
const strategyList = ref<StrategyVO[]>([])
const currentStrategy = ref<StrategyVO | null>(null)

// 当前选中的索引
const currentIndex = computed(() => {
  if (!selectedStrategyId.value) {
    return 0
  }
  return strategyList.value.findIndex(item => item.id === selectedStrategyId.value)
})

// 显示文本
const selectedStrategyText = computed(() => {
  if (!selectedStrategyId.value) {
    return '请选择学习策略'
  }
  return currentStrategy.value?.name || '请选择学习策略'
})

// 加载策略列表
async function loadStrategyList() {
  try {
    const res = await pageUsingGet({
      params: {
        pageNo: 1,
        pageSize: 1000, // 获取所有策略
      },
    })

    const pageData = res as unknown as { dataList: any[], total: number }

    if (pageData) {
      strategyList.value = pageData.dataList || []

      // 如果有默认策略，或者有值，则设置选中
      if (props.modelValue) {
        selectedStrategyId.value = props.modelValue
        const selected = strategyList.value.find((item: any) => item.id === props.modelValue)
        if (selected) {
          currentStrategy.value = selected
        }
      }
      else if (strategyList.value.length > 0) {
        // 默认选中第一个
        const firstStrategy = strategyList.value[0]
        selectedStrategyId.value = firstStrategy.id
        currentStrategy.value = firstStrategy
        emit('update:modelValue', firstStrategy.id)
        emit('change', firstStrategy)
      }
    }
  }
  catch (error) {
    console.error('加载策略列表失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  }
}

// 选择器变化处理
function handlePickerChange(event: any) {
  const index = event.detail.value
  const selected = strategyList.value[index]
  if (selected) {
    currentStrategy.value = selected
    selectedStrategyId.value = selected.id
    emit('update:modelValue', selected.id)
    emit('change', selected)
  }
}

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
  selectedStrategyId.value = newVal
  if (newVal) {
    const selected = strategyList.value.find((item: any) => item.id === newVal)
    if (selected) {
      currentStrategy.value = selected
    }
  }
})

// 暴露当前选中的策略
defineExpose({
  currentStrategy,
})

onMounted(() => {
  loadStrategyList()
})
</script>

<style scoped>
.strategy-picker {
  width: 100%;
}

.picker-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: white;
  border: 2px solid var(--macos-gray);
  border-radius: var(--macos-radius);
  min-height: 44px;
  transition: all 0.3s ease;
}

.picker-display:active {
  background: #f5f5f5;
}

.picker-text {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.picker-text.placeholder {
  color: var(--macos-gray);
}

.picker-arrow {
  font-size: 20px;
  color: var(--macos-gray);
  margin-left: 8px;
  transform: rotate(90deg);
}
</style>
