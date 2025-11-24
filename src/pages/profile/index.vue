<template>
  <MacOSLayout>
    <view class="profile-page">
      <!-- 用户信息卡片 -->
      <view class="user-card">
        <view class="avatar-section">
          <view class="avatar" @click="changeAvatar">
            <image :src="userInfo.avatar" class="avatar-img" mode="aspectFill" />
            <view class="avatar-edit">编辑</view>
          </view>
          <view class="user-info">
            <text class="username">{{ userInfo.username }}</text>
            <text class="email">{{ userInfo.email }}</text>
            <text class="member-since">会员时间: {{ userInfo.createTime }}</text>
          </view>
        </view>
        
        <view class="stats-section">
          <view class="stat-item">
            <text class="stat-number">{{ userStats.days }}</text>
            <text class="stat-label">连续学习</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ userStats.tasks }}</text>
            <text class="stat-label">完成任务</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ userStats.bills }}</text>
            <text class="stat-label">账单记录</text>
          </view>
        </view>
      </view>

      <!-- 设置菜单 -->
      <view class="settings-section">
        <view class="section-title">个人设置</view>
        
        <view class="menu-list">
          <view class="menu-item" @click="navigateTo('learning-settings')">
            <view class="menu-icon">📚</view>
            <text class="menu-text">学习设置</text>
            <text class="menu-arrow">›</text>
          </view>
          
          <view class="menu-item" @click="navigateTo('task-settings')">
            <view class="menu-icon">✅</view>
            <text class="menu-text">任务设置</text>
            <text class="menu-arrow">›</text>
          </view>
          
          <view class="menu-item" @click="navigateTo('bill-settings')">
            <view class="menu-icon">💰</view>
            <text class="menu-text">账单设置</text>
            <text class="menu-arrow">›</text>
          </view>
          
          <view class="menu-item" @click="navigateTo('notification')">
            <view class="menu-icon">🔔</view>
            <text class="menu-text">通知设置</text>
            <text class="menu-arrow">›</text>
          </view>
          
          <view class="menu-item" @click="navigateTo('privacy')">
            <view class="menu-icon">🔒</view>
            <text class="menu-text">隐私与安全</text>
            <text class="menu-arrow">›</text>
          </view>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="features-section">
        <view class="section-title">功能中心</view>
        
        <view class="feature-grid">
          <view class="feature-item" @click="exportData">
            <view class="feature-icon">📤</view>
            <text class="feature-text">数据导出</text>
          </view>
          
          <view class="feature-item" @click="backupData">
            <view class="feature-icon">💾</view>
            <text class="feature-text">数据备份</text>
          </view>
          
          <view class="feature-item" @click="clearCache">
            <view class="feature-icon">🧹</view>
            <text class="feature-text">清理缓存</text>
          </view>
          
          <view class="feature-item" @click="feedback">
            <view class="feature-icon">💬</view>
            <text class="feature-text">意见反馈</text>
          </view>
        </view>
      </view>

      <!-- 账户操作 -->
      <view class="account-section">
        <view class="section-title">账户管理</view>
        
        <view class="account-actions">
          <button class="change-password-btn" @click="changePassword">修改密码</button>
          <button class="logout-btn" @click="logout">退出登录</button>
        </view>
      </view>

      <!-- 版本信息 -->
      <view class="version-info">
        <text class="version-text">Z-Learning v{{ version }}</text>
        <text class="copyright">© 2025 Z-Learning Team</text>
      </view>
    </view>
  </MacOSLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import MacOSLayout from '@/components/MacOSLayout.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const version = '1.0.0'

const userInfo = reactive({
  avatar: '/static/avatar-default.png',
  username: 'Z-Learner',
  email: 'user@z-learning.com',
  createTime: '2025-11-01'
})

const userStats = reactive({
  days: 13,
  tasks: 47,
  bills: 28
})

const changeAvatar = () => {
  uni.showActionSheet({
    itemList: ['拍照', '从相册选择'],
    success: (res) => {
      if (res.tapIndex === 0) {
        // 拍照
        uni.chooseImage({
          count: 1,
          sourceType: ['camera'],
          success: (res) => {
            userInfo.avatar = res.tempFilePaths[0]
          }
        })
      } else {
        // 从相册选择
        uni.chooseImage({
          count: 1,
          sourceType: ['album'],
          success: (res) => {
            userInfo.avatar = res.tempFilePaths[0]
          }
        })
      }
    }
  })
}

const navigateTo = (page: string) => {
  uni.showToast({
    title: `跳转到${page}`,
    icon: 'none'
  })
  // 实际项目中这里会使用 uni.navigateTo 跳转到对应页面
}

const exportData = () => {
  uni.showModal({
    title: '数据导出',
    content: '是否导出所有数据？',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '导出中...' })
        setTimeout(() => {
          uni.hideLoading()
          uni.showToast({
            title: '导出成功',
            icon: 'success'
          })
        }, 1500)
      }
    }
  })
}

const backupData = () => {
  uni.showModal({
    title: '数据备份',
    content: '是否备份所有数据到云端？',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '备份中...' })
        setTimeout(() => {
          uni.hideLoading()
          uni.showToast({
            title: '备份成功',
            icon: 'success'
          })
        }, 1500)
      }
    }
  })
}

const clearCache = () => {
  uni.showModal({
    title: '清理缓存',
    content: '清理缓存将删除临时文件，是否继续？',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '清理中...' })
        setTimeout(() => {
          uni.hideLoading()
          uni.showToast({
            title: '清理完成',
            icon: 'success'
          })
        }, 1000)
      }
    }
  })
}

const feedback = () => {
  uni.navigateTo({
    url: '/pages/feedback'
  })
}

const changePassword = () => {
  uni.showModal({
    title: '修改密码',
    content: '功能开发中...',
    showCancel: false
  })
}

const logout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.reLaunch({
          url: '/pages/login'
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.profile-page {
  padding: 20rpx;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.user-card {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.avatar-section {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.avatar {
  position: relative;
  margin-right: 30rpx;
  
  .avatar-img {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    border: 4rpx solid #667eea;
  }
  
  .avatar-edit {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #667eea;
    color: white;
    padding: 6rpx 12rpx;
    border-radius: 20rpx;
    font-size: 20rpx;
  }
}

.user-info {
  flex: 1;
}

.username {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.email,
.member-since {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.stats-section {
  display: flex;
  justify-content: space-around;
  border-top: 1rpx solid #f0f0f0;
  padding-top: 30rpx;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 22rpx;
  color: #999;
}

.settings-section,
.features-section,
.account-section {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.menu-list {
  .menu-item {
    display: flex;
    align-items: center;
    padding: 25rpx 0;
    border-bottom: 1rpx solid #f8f8f8;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .menu-icon {
    font-size: 32rpx;
    margin-right: 20rpx;
    width: 40rpx;
    text-align: center;
  }
  
  .menu-text {
    flex: 1;
    font-size: 26rpx;
    color: #333;
  }
  
  .menu-arrow {
    font-size: 28rpx;
    color: #999;
  }
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  
  .feature-icon {
    font-size: 40rpx;
    margin-bottom: 15rpx;
  }
  
  .feature-text {
    font-size: 24rpx;
    color: #333;
  }
}

.account-actions {
  display: flex;
  gap: 20rpx;
}

.change-password-btn,
.logout-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 10rpx;
  font-size: 26rpx;
  border: none;
}

.change-password-btn {
  background: #667eea;
  color: white;
}

.logout-btn {
  background: #f0f0f0;
  color: #666;
}

.version-info {
  text-align: center;
  padding: 30rpx;
  
  .version-text {
    display: block;
    font-size: 24rpx;
    color: #666;
    margin-bottom: 10rpx;
  }
  
  .copyright {
    font-size: 20rpx;
    color: #999;
  }
}
</style>