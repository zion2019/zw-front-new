<template>
  <!-- 侧边栏遮罩层 -->
  <div 
    v-if="isOpen" 
    class="sidebar-overlay"
    @click="toggleSidebar"
  ></div>

  <!-- 侧边栏把手 -->
  <div
    class="macos-sidebar-handle"
    :class="{ open: isOpen }"
    @click="toggleSidebar"
  >
    <div class="handle-icon">
      {{ isOpen ? '◀' : '▶' }}
    </div>
  </div>

  <!-- 侧边栏内容 -->
  <div class="macos-sidebar anime-element" :class="{ open: isOpen }">
    <div class="sidebar-header">
      <h3>Z-Learning</h3>
      <button class="close-sidebar" @click="toggleSidebar">
        ×
      </button>
    </div>

    <nav class="sidebar-nav">
      <div
        v-for="item in navItems"
        :key="item.name"
        class="nav-item" :class="[{ active: currentItem === item.name }]"
        @click="navigate(item)"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

interface NavItem {
  name: string
  label: string
  icon: string
  route: string
}

const navItems: NavItem[] = [
  { name: 'today', label: '今日', icon: '📅', route: '/pages/today/index' },
  { name: 'tasks', label: '任务', icon: '✅', route: '/pages/tasks/index' },
  { name: 'learning', label: '学习', icon: '📚', route: '/pages/learning/index' },
  { name: 'bills', label: '账单', icon: '💰', route: '/pages/bills/index' },
  { name: 'profile', label: '我的', icon: '👤', route: '/pages/profile/index' },
]

const isOpen = ref<boolean>(false)
const currentItem = ref<string>('today')

const router = useRouter()

function toggleSidebar() {
  isOpen.value = !isOpen.value
}

function navigate(item: NavItem) {
  currentItem.value = item.name
  router.push(item.route)
  // 在小屏幕上导航后自动关闭侧边栏
  if (window.innerWidth <= 768) {
    isOpen.value = false
  }
}

onMounted(() => {
  // 可以在这里添加其他初始化逻辑
})
</script>

<style scoped>
@import '../theme/macos.css';

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 999;
  cursor: pointer;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 2px solid #000;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #000;
}

.close-sidebar {
  background: none;
  border: 2px solid #000;
  font-size: 20px;
  cursor: pointer;
  color: var(--macos-dark-gray);
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.close-sidebar:hover {
  background: var(--macos-gray);
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.15);
}

.sidebar-nav {
  padding: 16px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.nav-item:hover {
  background: var(--macos-gray);
  transform: translate(-2px, -2px);
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
}

.nav-item.active {
  background: var(--macos-tab-active);
  border-left-color: var(--macos-green);
  color: #000;
  font-weight: 600;
  border: 2px solid #000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
}

.nav-icon {
  font-size: 18px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.nav-label {
  font-size: 14px;
}


</style>