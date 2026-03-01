/* eslint-disable */
// @ts-ignore
import request from '@/http/vue-query';
import { CustomRequestOptions_ } from '@/http/types';

// ==================== 常量定义 ====================

/** 掌握程度枚举 */
export enum MasteryLevel {
  /** 陌生 */
  STRANGER = 'STRANGER',
  /** 熟悉 */
  FAMILIAR = 'FAMILIAR',
  /** 掌握 */
  UNDERSTAND = 'UNDERSTAND',
  /** 精通 */
  MASTER = 'MASTER',
}

/** 掌握程度选项配置 */
export const MASTERY_OPTIONS = [
  {
    value: MasteryLevel.STRANGER,
    name: '陌生',
    description: '初始状态，第一次学习',
    iconClass: 'i-carbon-face-unknown-filled text-gray-500',
  },
  {
    value: MasteryLevel.FAMILIAR,
    name: '熟悉',
    description: '第一阶段，初步了解',
    iconClass: 'i-carbon-face-smile-filled text-blue-500',
  },
  {
    value: MasteryLevel.UNDERSTAND,
    name: '掌握',
    description: '第二阶段，基本掌握',
    iconClass: 'i-carbon-face-wink-filled text-orange-500',
  },
  {
    value: MasteryLevel.MASTER,
    name: '精通',
    description: '最终阶段，完全掌握',
    iconClass: 'i-carbon-star-filled text-yellow-500',
  },
] as const

/** 掌握程度样式类映射 */
export const MASTERY_CLASS_MAP: Record<string, string> = {
  [MasteryLevel.STRANGER]: 'mastery-stranger',
  [MasteryLevel.FAMILIAR]: 'mastery-familiar',
  [MasteryLevel.UNDERSTAND]: 'mastery-understand',
  [MasteryLevel.MASTER]: 'mastery-master',
} as const

/**
 * 根据掌握程度值获取文本
 */
export function getMasteryText(level: string): string {
  const option = MASTERY_OPTIONS.find(opt => opt.value === level)
  return option?.name || '未知'
}

/**
 * 根据掌握程度值获取样式类
 */
export function getMasteryClass(level: string): string {
  return MASTERY_CLASS_MAP[level] || ''
}

// ==================== 类型定义 ====================

/** 策略查询参数 */
export interface StrategyQO {
  id?: string;
  name?: string;
  description?: string;
  isDefault?: boolean;
  pageNo?: number;
  pageSize?: number;
}

/** 策略响应对象 */
export interface StrategyVO {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
}

/** 策略详情（包含间隔配置） */
export interface StrategyDetailVO {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  intervals: IntervalVO[];
}

/** 间隔配置查询参数 */
export interface IntervalQO {
  id?: string;
  strategyId?: string;
  sequence?: number;
  intervalHours?: number;
  requiredMasteryLevel?: 'STRANGER' | 'FAMILIAR' | 'UNDERSTAND' | 'MASTER';
}

/** 间隔配置响应对象 */
export interface IntervalVO {
  id: string;
  strategyId: string;
  sequence: number;
  intervalHours: number;
  requiredMasteryLevel: 'STRANGER' | 'FAMILIAR' | 'UNDERSTAND' | 'MASTER';
}

/** 分页响应 */
export interface PageResult<T> {
  dataList: T[];
  total: number;
}

// ==================== 策略管理接口 ====================

/** 策略分页查询 GET /learn/strategy/page */
export function pageUsingGet({
  params,
  options,
}: {
  params: StrategyQO;
  options?: CustomRequestOptions_;
}) {
  return request('/learn/strategy/page', {
    method: 'GET',
    params: params as any,
    ...(options || {}),
  });
}

/** 策略详情 GET /learn/strategy/{id} */
export function infoUsingGet({
  id,
  options,
}: {
  id: string;
  options?: CustomRequestOptions_;
}) {
  return request(`/learn/strategy/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 保存/更新策略 POST /learn/strategy */
export function saveUsingPost({
  body,
  options,
}: {
  body: StrategyQO;
  options?: CustomRequestOptions_;
}) {
  return request('/learn/strategy', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 删除策略 DELETE /learn/strategy/{id} */
export function deleteUsingDelete({
  id,
  options,
}: {
  id: string;
  options?: CustomRequestOptions_;
}) {
  return request(`/learn/strategy/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// ==================== 间隔配置管理接口 ====================

/** 间隔配置详情 GET /learn/strategy/interval/{id} */
export function infoIntervalUsingGet({
  id,
  options,
}: {
  id: string;
  options?: CustomRequestOptions_;
}) {
  return request(`/learn/strategy/interval/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 保存/更新间隔配置 POST /learn/strategy/interval */
export function saveIntervalUsingPost({
  body,
  options,
}: {
  body: IntervalQO;
  options?: CustomRequestOptions_;
}) {
  return request('/learn/strategy/interval', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 删除间隔配置 DELETE /learn/strategy/interval/{id} */
export function deleteIntervalUsingDelete({
  id,
  options,
}: {
  id: string;
  options?: CustomRequestOptions_;
}) {
  return request(`/learn/strategy/interval/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
