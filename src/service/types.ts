/* eslint-disable */
// @ts-ignore

export type InfoUsingGetResponse = {
  code: number;
  msg: string;
  data: UserItem;
};

export type InfoUsingGetResponses = {
  200: InfoUsingGetResponse;
};

export type ListAllUsingGetResponse = {
  code: number;
  msg: string;
  data: UserItem[];
};

export type ListAllUsingGetResponses = {
  200: ListAllUsingGetResponse;
};

export type UserItem = {
  userId: number;
  username: string;
  nickname: string;
  avatar: string;
};

export type TagQO = {
  id?: number;
  name: string;
  color: string;
  userId?: number;
  description?: string;
  pageNo?: number;
  pageSize?: number;
};

export type TagVO = {
  id: number;
  name: string;
  color: string;
  userId: number;
  description?: string;
};

export type Page<T> = {
  pageNo: number;
  pageSize: number;
  total: number;
  dataList: T[];
};

