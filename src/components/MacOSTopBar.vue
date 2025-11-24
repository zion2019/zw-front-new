<template>
  <div class="macos-controls">
    <!-- 导航控制按钮 -->
    <div class="macos-control-buttons">
      <div class="macos-control-button home" title="主页" @click="goHome">
        <div class="i-carbon-home text-black" />
      </div>
      <div class="macos-control-button back" title="后退" @click="goBack">
        <div class="i-carbon-arrow-left text-black" />
      </div>
      <div class="macos-control-button forward" title="前进" @click="goForward">
        <div class="i-carbon-arrow-right text-black" />
      </div>
    </div>

    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="breadcrumb-item" @click="goHome">
        <div class="i-carbon-home breadcrumb-icon text-black" />
        <span class="breadcrumb-text">首页</span>
      </span>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item current">
        {{ currentPage }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentPage = ref<string>('首页')

// 页面名称映射
const pageNames: { [key: string]: string } = {
  '/pages/today/index': '今日',
  '/pages/tasks/index': '任务',
  '/pages/learning/index': '学习',
  '/pages/bills/index': '账单',
  '/pages/profile/index': '个人中心',
}

function goHome() {
  // 回首页逻辑
  console.log('Go home')
  uni.navigateTo({
    url: '/pages/today/index',
  })
}

function goBack() {
  // 后退逻辑
  console.log('Go back')
  uni.navigateBack()
}

function goForward() {
  // 前进逻辑 - 由于uni-app没有前进API，这里可以记录历史记录
  console.log('Go forward')
  // 可以结合自定义路由历史管理实现
}

// 根据当前路由更新页面名称
function updateCurrentPage() {
  const path = route.path || '/pages/today/index'
  currentPage.value = pageNames[path] || 'Z-Learning'
}

onMounted(() => {
  updateCurrentPage()
})
</script>

<style scoped>
@import '../theme/macos.css';

/* 面包屑导航样式 */
.breadcrumb {
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 16px;
  font-size: 14px;
  font-weight: 500;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.breadcrumb-item:hover {
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
}

.breadcrumb-item.current {
  cursor: default;
  color: #000;
  font-weight: 600;
  background: white;
  border: 1px solid #000;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
}

.breadcrumb-icon {
  font-size: 12px;
  margin-right: 4px;
}

.breadcrumb-text {
  margin-left: 4px;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: var(--macos-dark-gray);
  font-weight: normal;
}
</style>
