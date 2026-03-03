<template>
  <div class="image-uploader">
    <div class="uploader-content" @click="handleClick">
      <!-- 已上传的图片预览 -->
      <image
        v-if="imageUrl"
        :src="displayUrl"
        mode="aspectFit"
        class="image-preview"
        @click.stop="handlePreview"
      />
      <!-- 上传占位符 -->
      <div v-else class="upload-placeholder">
        <div class="upload-icon">
          <div class="i-carbon-add text-gray-400" />
        </div>
        <div class="upload-text">
          {{ placeholder }}
        </div>
      </div>
      <!-- 删除按钮 -->
      <div v-if="imageUrl && showDelete" class="delete-btn" @click.stop="handleDelete">
        <div class="i-carbon-close text-white" />
      </div>
      <!-- 加载中遮罩 -->
      <div v-if="uploading" class="uploading-mask">
        <div class="loading-icon">
          <div class="i-carbon-circle-dash text-macos-blue" />
        </div>
        <div class="loading-text">
          上传中...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { uploadFileUsingPost } from '@/service/file'

interface Props {
  modelValue?: string
  placeholder?: string
  showDelete?: boolean
  maxSize?: number // 最大文件大小（MB）
  baseUrl?: string // 图片基础URL
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '点击上传图片',
  showDelete: true,
  maxSize: 10,
  baseUrl: '', // 留空则使用相对路径
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'upload-success': [fileUrl: string, fileData: any]
  'upload-error': [error: any]
}>()

const imageUrl = ref<string>(props.modelValue)
const uploading = ref(false)

// 显示URL（拼接基础路径）
const displayUrl = computed(() => {
  if (!imageUrl.value)
    return ''

  const url = imageUrl.value
  console.log('ImageUploader displayUrl - baseUrl:', props.baseUrl, 'imageUrl:', url)

  // 如果已经是完整URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://'))
    return url

  // 如果有baseUrl，拼接 /img 路径后返回
  if (props.baseUrl) {
    // 移除 url 前导的 /
    const cleanUrl = url.startsWith('/') ? url : `/${url}`
    const fullUrl = `${props.baseUrl}/img${cleanUrl}`
    console.log('ImageUploader full displayUrl:', fullUrl)
    return fullUrl
  }

  // 否则返回相对路径（生产环境使用相对路径）
  return url
})

// 点击上传区域
function handleClick() {
  if (uploading.value)
    return

  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      handleUpload(tempFilePath)
    },
  })
}

// 上传文件
async function handleUpload(filePath: string) {
  uploading.value = true

  try {
    // 获取文件信息
    const fileInfo = await getFileInfo(filePath)

    // 检查文件大小
    if (fileInfo.size > props.maxSize * 1024 * 1024) {
      uni.showToast({
        title: `图片大小不能超过${props.maxSize}MB`,
        icon: 'none',
      })
      uploading.value = false
      return
    }

    // 上传文件
    const result = await uploadFileUsingPost({
      filePath,
    })

    if (result && result.fileUrl) {
      imageUrl.value = result.fileUrl
      emit('update:modelValue', result.fileUrl)
      emit('upload-success', result.fileUrl, result)

      uni.showToast({
        title: '上传成功',
        icon: 'success',
      })
    }
  }
  catch (error) {
    console.error('上传失败:', error)
    emit('upload-error', error)
    uni.showToast({
      title: '上传失败',
      icon: 'none',
    })
  }
  finally {
    uploading.value = false
  }
}

// 获取文件信息
function getFileInfo(filePath: string): Promise<UniApp.GetFileInfoSuccessCallbackResult> {
  return new Promise((resolve, reject) => {
    uni.getFileInfo({
      filePath,
      success: res => resolve(res as UniApp.GetFileInfoSuccessCallbackResult),
      fail: reject,
    })
  })
}

// 预览图片
function handlePreview() {
  if (!imageUrl.value)
    return

  uni.previewImage({
    urls: [displayUrl.value],
  })
}

// 删除图片
function handleDelete() {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这张图片吗？',
    success: (res) => {
      if (res.confirm) {
        imageUrl.value = ''
        emit('update:modelValue', '')
      }
    },
  })
}

// 暴露方法
defineExpose({
  imageUrl,
  uploading,
})
</script>

<style scoped>
.image-uploader {
  width: 100%;
}

.uploader-content {
  position: relative;
  width: 100%;
  height: 200px;
  border: 2px dashed var(--macos-gray);
  border-radius: var(--macos-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f8f8;
  overflow: hidden;
}

.uploader-content:hover {
  border-color: var(--macos-blue);
  background: #f0f8ff;
}

.image-preview {
  width: 100%;
  height: 100%;
}

.upload-placeholder {
  text-align: center;
  color: var(--macos-gray);
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.upload-text {
  font-size: 14px;
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  z-index: 10;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: rgba(220, 38, 38, 0.8);
}

.uploading-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.loading-icon {
  font-size: 32px;
  animation: rotate 1s linear infinite;
  margin-bottom: 8px;
}

.loading-text {
  font-size: 14px;
  color: var(--macos-gray);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .uploader-content {
    height: 160px;
  }

  .upload-icon {
    font-size: 40px;
  }

  .upload-text {
    font-size: 12px;
  }
}
</style>
