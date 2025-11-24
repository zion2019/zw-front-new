<template>
  <!-- 全局容器，路由机制会自动处理页面显示 -->
  <div id="app">
    <!-- 路由页面会自动在这里渲染 -->
  </div>
</template>

<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { navigateToInterceptor } from '@/router/interceptor'
import { MobilePageManager, PerformanceOptimizer } from '@/utils/mobile-adapter'
import '@/theme/macos.css'
import '@/theme/anime.css'
import '@/theme/mobile-optimize.css'

onLaunch((options) => {
  console.log('Z-Learning App Launch', options)

  // 初始化移动端性能优化
  PerformanceOptimizer.optimizeScroll()
  // 初始化移动端页面管理器
  const pageManager = MobilePageManager.getInstance()
  // 检查用户登录状态
  const token = uni.getStorageSync('accessToken')
  if (token) {
    // 用户已登录，跳转到今日页面
    navigateToInterceptor.invoke({ url: '/pages/today/index' })
  }
  else {
    // 用户未登录，跳转到登录页面
    navigateToInterceptor.invoke({ url: '/pages/login' })
  }
})

onShow((options) => {
  console.log('App.vue onShow', options)
  // 处理直接进入页面路由的情况：如h5直接输入路由、微信小程序分享后进入等
  // https://github.com/unibest-tech/unibest/issues/192
  if (options?.path) {
    navigateToInterceptor.invoke({ url: `/${options.path}`, query: options.query })
  }
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
/* #ifdef H5 */
uni-page-head {
  display: none;
}
/* #endif */
/* 全局样式 */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
    'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 全局按钮样式 */
button {
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:active {
  transform: scale(0.98);
}

/* 全局输入框样式 */
input,
textarea {
  border: none;
  outline: none;
  font-family: inherit;
}

/* 全局动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  body {
    font-size: 14px;
  }
}

/* 手绘动漫风格全局变量 */
:root {
  --anime-primary: #ff6b6b;
  --anime-secondary: #4ecdc4;
  --anime-accent: #ffe66d;
  --anime-background: #f5f7fa;
  --anime-text: #333333;
  --anime-border: #e0e0e0;
}
</style>
