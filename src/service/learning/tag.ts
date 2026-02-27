/* eslint-disable */
// @ts-ignore
import request from '@/http/vue-query';
import { CustomRequestOptions_ } from '@/http/types';

import * as API from '../types';

/** 标签分页查询 GET /learn/tag/page */
export function pageUsingGet({
  params,
  options,
}: {
  params: API.TagQO;
  options?: CustomRequestOptions_;
}) {
  return request('/learn/tag/page', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 标签保存或更新 POST /learn/tag */
export function saveUsingPost({
  body,
  options,
}: {
  body: API.TagQO;
  options?: CustomRequestOptions_;
}) {
  return request('/learn/tag', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 标签详情 GET /learn/tag/{id} */
export function infoUsingGet({id}) {
  return request(`/learn/tag/${id}`, {
    method: 'GET',
  });
}

/** 删除标签 DELETE /learn/tag/{id} */
export function deleteUsingDelete({
  id,
  options,
}: {
  id: number;
  options?: CustomRequestOptions_;
}) {
  return request(`/learn/tag/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
