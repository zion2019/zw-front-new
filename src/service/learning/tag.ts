/* eslint-disable */
// @ts-ignore
import request from '@/http/vue-query';
import { CustomRequestOptions_ } from '@/http/types';

import * as API from '../types';

/** 标签保存 POST /tag */
export function saveUsingPost({
  body,
  options,
}: {
  body: API.TagQO;
  options?: CustomRequestOptions_;
}) {
  return request<API.SaveUsingPostResponse>('/tag', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
