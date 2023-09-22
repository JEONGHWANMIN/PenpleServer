import { Diary } from '@prisma/client';
import { Tspec } from 'tspec';
import { CreateDiaryDto } from '../dto/diary.dto';
import { KeyStringValueString } from '../type/diary.type';

export type DiaryApiSpec = Tspec.DefineApiSpec<{
  tags: ['diary'];
  paths: {
    '/diary/summary': {
      get: {
        summary: '일기 요약 데이터 조회';
        query: {
          year: number;
          month: number;
        };
        header: {
          Authorization: string;
        };
        responses: {
          200: {
            message: string;
            data: {
              totalDayCount: number;
              monthDiariesCount: number;
              diaryWritePercentage: number;
              userDiaryDateList: string[];
              moodCountMap: KeyStringValueString;
              weatherCountMap: KeyStringValueString;
            };
          };
        };
      };
    };
    '/diary': {
      get: {
        summary: '일기 리스트 조회';
        query: {
          size: number;
          page: number;
          content?: string;
          year?: string;
          month?: string;
        };
        header: {
          Authorization: string;
        };
        responses: {
          200: {
            message: string;
            data: {
              page: number;
              size: number;
              totalCount: number;
              totalPage: number;
              hasNextPage: boolean;
              hasPreviousPage: boolean;
              items: Diary[];
            };
          };
        };
      };
      post: {
        summary: '일기 쓰기';
        header: {
          Authorization: string;
        };
        body: CreateDiaryDto;
        responses: {
          201: {
            message: string;
          };
        };
      };
    };
    '/diary/{id}': {
      get: {
        summary: '일기 조회';
        path: { id: number };
        header: {
          Authorization: string;
        };
        responses: {
          200: {
            message: string;
            data: {
              id: number;
              title: string;
              content: string;
              createdAt: Date;
              weather: string;
              mood: string;
              userId: number;
              tags: string[];
            };
          };
        };
      };
      patch: {
        summary: '일기 수정';
        path: { id: number };
        header: {
          Authorization: string;
        };
        body: CreateDiaryDto;
        responses: {
          200: {
            message: string;
          };
        };
      };
      delete: {
        summary: '일기 삭제';
        path: { id: number };
        header: {
          Authorization: string;
        };
        responses: {
          200: {
            message: string;
          };
        };
      };
    };
  };
}>;
