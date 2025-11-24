// 移动端适配工具类

/**
 * 判断设备类型
 */
export const isMobile = () => {
  return uni.getSystemInfoSync().platform === 'ios' || uni.getSystemInfoSync().platform === 'android'
}

/**
 * 判断是否是iOS设备
 */
export const isIOS = () => {
  return uni.getSystemInfoSync().platform === 'ios'
}

/**
 * 判断是否是Android设备
 */
export const isAndroid = () => {
  return uni.getSystemInfoSync().platform === 'android'
}

/**
 * 获取安全区域高度（适配刘海屏）
 */
export const getSafeArea = () => {
  const systemInfo = uni.getSystemInfoSync()
  const safeArea = systemInfo.safeArea || { top: 0, bottom: 0 }
  
  return {
    top: safeArea.top,
    bottom: systemInfo.screenHeight - safeArea.bottom,
    statusBarHeight: systemInfo.statusBarHeight || 0
  }
}

/**
 * 像素转rpx
 */
export const px2rpx = (px: number): number => {
  const screenWidth = uni.getSystemInfoSync().screenWidth
  return (px / 750) * screenWidth
}

/**
 * rpx转像素
 */
export const rpx2px = (rpx: number): number => {
  const screenWidth = uni.getSystemInfoSync().screenWidth
  return (rpx / 750) * screenWidth
}

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: ReturnType<typeof setTimeout>
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

/**
 * 节流函数
 */
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let lastCall = 0
  
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func.apply(null, args)
    }
  }
}

/**
 * 处理移动端点击事件
 */
export const handleMobileTap = (callback: () => void) => {
  return debounce(callback, 300)
}

/**
 * 检测用户手势（滑动、缩放等）
 */
export class TouchGesture {
  private startX = 0
  private startY = 0
  private currentX = 0
  private currentY = 0
  
  onTouchStart(e: TouchEvent) {
    this.startX = e.touches[0].clientX
    this.startY = e.touches[0].clientY
  }
  
  onTouchMove(e: TouchEvent) {
    this.currentX = e.touches[0].clientX
    this.currentY = e.touches[0].clientY
  }
  
  onTouchEnd(): 'left' | 'right' | 'up' | 'down' | null {
    const diffX = this.currentX - this.startX
    const diffY = this.currentY - this.startY
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // 水平滑动
      return diffX > 0 ? 'right' : 'left'
    } else {
      // 垂直滑动
      return diffY > 0 ? 'down' : 'up'
    }
  }
}

/**
 * 移动端页面生命周期管理
 */
export class MobilePageManager {
  private static instance: MobilePageManager
  private isPageVisible = true
  
  static getInstance() {
    if (!MobilePageManager.instance) {
      MobilePageManager.instance = new MobilePageManager()
    }
    return MobilePageManager.instance
  }
  
  constructor() {
    this.initVisibilityListener()
  }
  
  private initVisibilityListener() {
    // 页面可见性变化监听
    uni.onAppHide(() => {
      this.isPageVisible = false
    })
    
    uni.onAppShow(() => {
      this.isPageVisible = true
    })
  }
  
  isVisible(): boolean {
    return this.isPageVisible
  }
  
  // 页面进入后台时的处理
  onPageHide(callback: () => void) {
    uni.onAppHide(callback)
  }
  
  // 页面进入前台时的处理
  onPageShow(callback: () => void) {
    uni.onAppShow(callback)
  }
}

/**
 * 移动端性能优化工具
 */
export class PerformanceOptimizer {
  /**
   * 延迟加载图片
   */
  static lazyLoadImage(imgElement: HTMLImageElement, src: string) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          imgElement.src = src
          observer.unobserve(imgElement)
        }
      })
    })
    
    observer.observe(imgElement)
  }
  
  /**
   * 预加载重要资源
   */
  static preloadResources(urls: string[]) {
    urls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = url
      link.as = 'image'
      document.head.appendChild(link)
    })
  }
  
  /**
   * 优化滚动性能
   */
  static optimizeScroll() {
    // 禁用滚动弹性效果
    document.body.style.webkitOverflowScrolling = 'touch'
    document.body.style.overflowScrolling = 'touch'
  }
}

/**
 * 移动端错误处理
 */
export class MobileErrorHandler {
  /**
   * 处理网络错误
   */
  static handleNetworkError(error: any) {
    console.error('Network Error:', error)
    
    // 显示网络错误提示
    uni.showToast({
      title: '网络连接失败，请检查网络设置',
      icon: 'none',
      duration: 2000
    })
  }
  
  /**
   * 处理API错误
   */
  static handleApiError(error: any) {
    console.error('API Error:', error)
    
    if (error.status === 401) {
      // 跳转到登录页面
      uni.navigateTo({
        url: '/pages/login'
      })
      return
    }
    
    uni.showToast({
      title: error.message || '请求失败，请稍后重试',
      icon: 'none',
      duration: 2000
    })
  }
}

export default {
  isMobile,
  isIOS,
  isAndroid,
  getSafeArea,
  px2rpx,
  rpx2px,
  debounce,
  throttle,
  handleMobileTap,
  TouchGesture,
  MobilePageManager,
  PerformanceOptimizer,
  MobileErrorHandler
}