// 移动端配置管理

/**
 * 移动端应用配置
 */
export const MobileConfig = {
  // 应用基本信息
  app: {
    name: 'Z-Learning',
    version: '1.0.0',
    description: '面向移动端的学习工具类应用'
  },

  // 移动端适配配置
  adaption: {
    // 最小触控区域大小 (px)
    minTouchArea: 44,
    // 字体大小基准 (rem)
    baseFontSize: 14,
    // 响应式断点
    breakpoints: {
      xs: 320,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200
    }
  },

  // 性能优化配置
  performance: {
    // 懒加载配置
    lazyLoading: {
      threshold: 0.1,
      rootMargin: '50px'
    },
    // 预加载配置
    preload: {
      criticalImages: true,
      criticalComponents: true
    }
  },

  // 用户体验配置
  ux: {
    // 动画时长配置
    animation: {
      fast: 200,
      normal: 300,
      slow: 500
    },
    // 触摸反馈配置
    touchFeedback: {
      enabled: true,
      duration: 300
    },
    // 滚动优化
    scroll: {
      smooth: true,
      momentum: true
    }
  },

  // 缓存配置
  cache: {
    // 本地存储键名
    keys: {
      userToken: 'accessToken',
      userInfo: 'userInfo',
      appSettings: 'appSettings',
      theme: 'theme'
    },
    // 缓存有效期 (秒)
    ttl: {
      short: 300,     // 5分钟
      medium: 3600,   // 1小时
      long: 86400     // 1天
    }
  },

  // API配置
  api: {
    // 基础URL
    baseURL: '/api',
    // 超时时间 (毫秒)
    timeout: 10000,
    // 重试次数
    retryCount: 3,
    // 重试延迟 (毫秒)
    retryDelay: 1000
  },

  // 错误处理配置
  error: {
    // 网络错误提示
    networkError: {
      title: '网络连接失败',
      message: '请检查网络设置后重试'
    },
    // API错误提示
    apiError: {
      title: '请求失败',
      message: '请稍后重试'
    },
    // 401错误处理
    unauthorized: {
      redirectToLogin: true,
      showToast: true
    }
  },

  // 主题配置
  theme: {
    // 默认主题
    default: 'light',
    // 支持的主题
    supported: ['light', 'dark'],
    // 颜色配置
    colors: {
      primary: '#007AFF',
      secondary: '#FF6B6B',
      success: '#34C759',
      warning: '#FF9500',
      danger: '#FF3B30',
      info: '#5AC8FA'
    }
  }
}

/**
 * 获取设备特定配置
 */
export const getDeviceConfig = () => {
  const systemInfo = uni.getSystemInfoSync()
  
  return {
    // 设备信息
    device: {
      platform: systemInfo.platform,
      model: systemInfo.model,
      version: systemInfo.system,
      screenWidth: systemInfo.screenWidth,
      screenHeight: systemInfo.screenHeight,
      pixelRatio: systemInfo.pixelRatio
    },
    
    // 安全区域信息
    safeArea: {
      top: systemInfo.safeArea?.top || 0,
      bottom: systemInfo.screenHeight - (systemInfo.safeArea?.bottom || systemInfo.screenHeight),
      left: systemInfo.safeArea?.left || 0,
      right: systemInfo.screenWidth - (systemInfo.safeArea?.right || systemInfo.screenWidth)
    },
    
    // 状态栏高度
    statusBarHeight: systemInfo.statusBarHeight || 0
  }
}

/**
 * 根据设备类型获取优化配置
 */
export const getOptimizationConfig = () => {
  const deviceConfig = getDeviceConfig()
  
  return {
    // iOS特定优化
    ios: {
      // 禁用弹性滚动
      disableBounce: true,
      // 优化输入框
      optimizeInputs: true,
      // Safari特定优化
      safariOptimizations: true
    },
    
    // Android特定优化
    android: {
      // 优化滚动性能
      optimizeScroll: true,
      // 硬件加速
      hardwareAcceleration: true,
      // 输入法优化
      imeOptimizations: true
    },
    
    // 通用优化
    common: {
      // 图片懒加载
      lazyLoadImages: true,
      // 预加载关键资源
      preloadCritical: true,
      // 压缩资源
      compressAssets: true
    }
  }
}

export default MobileConfig