import { UsersService } from "src/users/users.service";
import { Context, MockContext, createMockContext } from "./context";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "src/prisma/prisma.service";
import { mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

describe("유저 테스트", () => {
  let mockCtx: MockContext;
  let ctx: Context;
  let userService: UsersService;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
  });

  test("유저 생성 테스트", async () => {
    const user = {
      id: 1,
      nickname: "Rich",
      email: "hello@prisma.io",
      password: "1234",
      phoneNumber: "01012341234",
      refreshToken: null,
      createdAt: new Date(2023, 10, 19),
    };

    mockCtx.prisma.user.create.mockResolvedValue(user);

    const cratedUser = ctx.prisma.user.create({
      data: {
        nickname: "Rich",
        email: "hello@prisma.io",
        password: "1234",
        phoneNumber: "01012341234",
      },
    });

    await expect(cratedUser).resolves.toEqual({
      id: 2,
      nickname: "Rich",
      email: "hello@prisma.io",
      password: "1234",
      phoneNumber: "01012341234",
      refreshToken: null,
      createdAt: new Date(2023, 10, 19),
    });
  });
});
