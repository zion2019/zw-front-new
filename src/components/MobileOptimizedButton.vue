<template>
  <button 
    :class="['mobile-button', `mobile-button-${type}`, {
      'mobile-button-disabled': disabled,
      'mobile-button-loading': loading,
      'touch-feedback': !disabled && !loading
    }]"
    :style="{ width: block ? '100%' : 'auto' }"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="mobile-button-loading-spinner"></span>
    <span class="mobile-button-text">
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { handleMobileTap } from '@/utils/mobile-adapter'

interface Props {
  type?: 'primary' | 'secondary' | 'danger' | 'ghost'
  disabled?: boolean
  loading?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  disabled: false,
  loading: false,
  block: false
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = handleMobileTap(() => {
  if (!props.disabled && !props.loading) {
    emit('click')
  }
})
</script>

<style scoped>
.mobile-button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.mobile-button-primary {
  background: linear-gradient(135deg, #007AFF, #0056CC);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.mobile-button-secondary {
  background: #F2F2F7;
  color: #007AFF;
  border: 1px solid #E5E5EA;
}

.mobile-button-danger {
  background: linear-gradient(135deg, #FF3B30, #FF1A1A);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 59, 48, 0.3);
}

.mobile-button-ghost {
  background: transparent;
  color: #007AFF;
  border: 1px solid #007AFF;
}

.mobile-button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.mobile-button-loading {
  cursor: wait;
}

.mobile-button:active:not(.mobile-button-disabled):not(.mobile-button-loading) {
  transform: scale(0.95);
}

.mobile-button-loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.mobile-button-text {
  position: relative;
  z-index: 1;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .mobile-button {
    font-size: 14px;
    padding: 10px 20px;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .mobile-button-secondary {
    background: #2C2C2E;
    color: #0A84FF;
    border-color: #38383A;
  }
  
  .mobile-button-ghost {
    color: #0A84FF;
    border-color: #0A84FF;
  }
}
</style>