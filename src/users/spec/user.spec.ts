import { Tspec } from "tspec";
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginUserDto,
  SendAuthDto,
  VerifyAuthDto,
} from "../dto";
import { CreateUserDto } from "../dto";

export type UsersApiSpec = Tspec.DefineApiSpec<{
  tags: ["users"];
  paths: {
    "/users/send-auth": {
      post: {
        summary: "유저 핸드폰 인증 메세지 전송";
        body: SendAuthDto;
        responses: {
          201: {
            message: string;
          };
        };
      };
    };
    "/users/verify-auth": {
      post: {
        summary: "유저 핸드폰 인증 메세지 확인";
        body: VerifyAuthDto;
        responses: {
          201: {
            message: string;
          };
        };
      };
    };
    "/user/forgot-password": {
      put: {
        summary: "유저 비밀번호 잊어버릴 시 비밀번호 재설정";
        body: ForgotPasswordDto;
        responses: {
          200: {
            message: string;
          };
        };
      };
    };
    "/user/change-password": {
      put: {
        summary: "유저 비밀번호 변경하기";
        header: {
          Authorization: string;
        };
        body: ChangePasswordDto;
        responses: {
          200: {
            message: string;
          };
        };
      };
    };
    "/users/signup": {
      post: {
        summary: "유저 회원가입";
        body: CreateUserDto;
        responses: {
          201: {
            message: string;
          };
        };
      };
    };
    "/users/signin": {
      post: {
        summary: "유저 로그인";
        body: LoginUserDto;
        responses: {
          201: {
            message: string;
            accessToken: string;
            refreshToken: string;
          };
        };
      };
    };
    "/users/check": {
      post: {
        summary: "이메일 중복체크";
        body: {
          email: string;
        };
        responses: {
          200: {
            message: string;
            isDuplicate: boolean;
          };
        };
      };
    };
    "/users": {
      get: {
        security: "bearerAuth";
        summary: "유저 로그아웃";
        responses: {
          200: {
            message: string;
            isDuplicate: boolean;
          };
        };
      };
      delete: {
        summary: "유저 회원탈퇴";
        header: {
          Authorization: string;
        };
        responses: {
          204: {
            message: string;
          };
        };
      };
    };
    "/users/renew": {
      get: {
        summary: "토큰 갱신";
        header: {
          Authorization: string;
        };
        responses: {
          200: {
            message: string;
            accessToken: string;
            refreshToken: string;
          };
        };
      };
    };
  };
}>;
