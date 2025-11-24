<template>
  <div class="macos-theme">
    <!-- 顶部导航栏 -->
    <MacOSTopBar @tab-change="handleTabChange" />

    <!-- 侧边栏 -->
    <MacOSSidebar />

    <!-- 主内容区域 -->
    <main class="macos-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import MacOSSidebar from './MacOSSidebar.vue'
import MacOSTopBar from './MacOSTopBar.vue'

function handleTabChange(tabName: string) {
  const routes: { [key: string]: string } = {
    today: '/pages/today/index',
    tasks: '/pages/tasks/index',
    learning: '/pages/learning/index',
    bills: '/pages/bills/index',
    profile: '/pages/profile/index',
  }

  if (routes[tabName]) {
    uni.redirectTo({
      url: routes[tabName],
    })
  }
}
</script>

<style scoped>
@import '../theme/macos.css';
</style>
