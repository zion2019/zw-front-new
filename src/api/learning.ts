export interface ReviewSubject {
  id: number
  title: string
  coverImage: string
  userId: number
  tagId: number
  stageCount: number
  knowledgePointCount: number
  delayDays: number
  todayFinishedKnowledgeCnt: number
  todayKnowledgeTotalCnt: number
}

export interface TodayReviewResponse {
  code: number
  data: {
    message: string
    todayFinishedSubjectCnt: number
    todaySubjectTotalCnt: number
    reviewSubjects: ReviewSubject[]
  }
}

export function getTodayReview() {
  // 模拟API响应
  const mockData: TodayReviewResponse = {
    code: 200,
    data: {
      message: 'success',
      todayFinishedSubjectCnt: 1,
      todaySubjectTotalCnt: 3,
      reviewSubjects: [
        {
          id: 123456789,
          title: 'Mathematics',
          coverImage: 'https://picsum.photos/seed/math/64/64.jpg',
          userId: 987654321,
          tagId: 123789456,
          stageCount: 5,
          knowledgePointCount: 20,
          delayDays: 2,
          todayFinishedKnowledgeCnt: 1,
          todayKnowledgeTotalCnt: 5,
        },
        {
          id: 234567890,
          title: 'Physics',
          coverImage: 'https://picsum.photos/seed/physics/64/64.jpg',
          userId: 987654321,
          tagId: 234567890,
          stageCount: 3,
          knowledgePointCount: 15,
          delayDays: 1,
          todayFinishedKnowledgeCnt: 1,
          todayKnowledgeTotalCnt: 5,
        },
        {
          id: 345678901,
          title: 'Chemistry',
          coverImage: 'https://picsum.photos/seed/chemistry/64/64.jpg',
          userId: 987654321,
          tagId: 345678901,
          stageCount: 8,
          knowledgePointCount: 25,
          delayDays: 0,
          todayFinishedKnowledgeCnt: 1,
          todayKnowledgeTotalCnt: 5,
        },
      ],
    },
  }

  // 返回模拟的Promise
  return Promise.resolve(mockData)
}
