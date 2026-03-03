/* eslint-disable */
// @ts-ignore
import { useTokenStore } from '@/store/token';

/** 文件上传响应 */
export interface FileUploadVO {
  id?: number;
  fileName?: string;
  originalFileName?: string;
  businessType?: number;
  businessId?: number;
  extendName?: string;
  fileSize?: number;
  fileUrl?: string;
  reason?: string;
  createdTime?: string;
}

/** 文件上传 POST /res/file/upload */
export function uploadFileUsingPost({
  filePath,
  name = 'file',
  formData = {},
}: {
  filePath: string;
  name?: string;
  formData?: Record<string, any>;
}) {
  return new Promise<FileUploadVO>((resolve, reject) => {
    const tokenStore = useTokenStore();
    const headers: Record<string, string> = {};

    // 添加认证 token
    const token = tokenStore.validToken;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    uni.uploadFile({
      url: `${import.meta.env.VITE_IMAGE_BASE_URL}/api/res/file/upload`,
      filePath,
      name,
      formData,
      header: headers,
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          if (data.success) {
            resolve(data.data as FileUploadVO);
          } else {
            reject(new Error(data.message || '上传失败'));
          }
        } catch (error) {
          reject(error);
        }
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
}
