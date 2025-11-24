import { useRouter } from 'vue-router'

/**
 * HTTP响应拦截器 - 专门处理401未授权错误
 * 当接口返回401时自动跳转到登录页面
 */

// 响应拦截器配置
const responseInterceptor = {
  // 请求成功后触发
  success: (result: any) => {
    // 正常响应，直接返回
    return result
  },
  
  // 请求失败后触发
  fail: (error: any) => {
    console.error('HTTP请求失败:', error)
    
    // 处理网络错误
    if (error.errMsg && error.errMsg.includes('network')) {
      uni.showToast({
        title: '网络连接失败，请检查网络设置',
        icon: 'none',
        duration: 3000
      })
      return Promise.reject(error)
    }
    
    return Promise.reject(error)
  },
  
  // 请求完成时触发（无论成功失败都会触发）
  complete: (result: any) => {
    // 检查是否为401错误
    if (result.statusCode === 401) {
      handle401Error()
      return Promise.reject(new Error('未授权访问，请重新登录'))
    }
    
    // 其他服务器错误
    if (result.statusCode >= 400 && result.statusCode !== 401) {
      console.error('服务器错误:', result.statusCode, result.data)
      
      // 统一错误提示
      const errorMessage = result.data?.message || `服务器错误 (${result.statusCode})`
      uni.showToast({
        title: errorMessage,
        icon: 'none',
        duration: 3000
      })
      
      return Promise.reject(new Error(errorMessage))
    }
    
    // 正常响应
    return result
  }
}

/**
 * 处理401未授权错误
 */
const handle401Error = () => {
  // 清除本地存储的token
  localStorage.removeItem('accessToken')
  localStorage.removeItem('userInfo')
  
  // 显示提示信息
  uni.showToast({
    title: '登录已过期，请重新登录',
    icon: 'none',
    duration: 2000
  })
  
  // 延迟跳转到登录页面
  setTimeout(() => {
    // 获取当前页面路径
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const currentRoute = currentPage?.route || '/pages/today'
    
    // 如果当前已经在登录页面，则不重复跳转
    if (currentRoute.includes('login')) {
      return
    }
    
    // 跳转到登录页面，并携带当前页面路径作为重定向参数
    const redirectUrl = `/pages/login?redirect=${encodeURIComponent(currentRoute)}`
    
    // 使用reLaunch确保清空页面栈
    uni.reLaunch({
      url: redirectUrl
    })
  }, 1500)
}

/**
 * 自定义请求函数，添加响应拦截功能
 */
export const requestWithInterceptor = (options: UniApp.RequestOptions): Promise<any> => {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success: (result) => {
        const processedResult = responseInterceptor.success(result)
        resolve(processedResult)
      },
      fail: (error) => {
        const processedError = responseInterceptor.fail(error)
        reject(processedError)
      },
      complete: (result) => {
        try {
          const processedResult = responseInterceptor.complete(result)
          if (processedResult && processedResult.statusCode >= 200 && processedResult.statusCode < 300) {
            resolve(processedResult)
          } else {
            reject(processedResult)
          }
        } catch (error) {
          reject(error)
        }
      }
    })
  })
}

/**
 * 检查当前登录状态
 */
export const checkAuthStatus = (): boolean => {
  const token = localStorage.getItem('accessToken')
  return !!token
}

/**
 * 获取当前用户信息
 */
export const getCurrentUser = (): any => {
  try {
    const userInfo = localStorage.getItem('userInfo')
    return userInfo ? JSON.parse(userInfo) : null
  } catch (error) {
    console.error('解析用户信息失败:', error)
    return null
  }
}

/**
 * 退出登录
 */
export const logout = () => {
  // 清除本地存储
  localStorage.removeItem('accessToken')
  localStorage.removeItem('userInfo')
  
  // 跳转到登录页面
  uni.reLaunch({
    url: '/pages/login'
  })
}

export const responseInterceptorInstance = {
  install() {
    // 这里可以注册全局的响应拦截器
    // 注意：uni-app的拦截器机制有限，我们主要通过自定义request函数来实现
    console.log('HTTP响应拦截器已安装')
  }
}