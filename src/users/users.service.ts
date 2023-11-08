import { JwtService } from "@nestjs/jwt";
import {
  CACHE_MANAGER,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { PrismaService } from "../prisma/prisma.service";
import {
  VerifyAuthDto,
  CreateUserDto,
  LoginUserDto,
  ChangePasswordDto,
  ForgotPasswordDto,
} from "./dto";
import * as bcrypt from "bcrypt";
import { MailService } from "src/configs/mail/mail.service";
import { generateRandomNumber } from "src/common/utils/generateRandomNumber";

const saltRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  async sendAuthMessage(email: string) {
    const randomNumber = generateRandomNumber();

    try {
      await this.mailService.sendMail({
        to: email,
        subject: "penple 인증번호 입니다.",
        html: `인증번호 <b>[${randomNumber}]<b>`,
      });

      await this.cacheManager.set(email, randomNumber);

      return {
        message: "이메일 발송이 성공했습니다.",
      };
    } catch (e) {
      throw new ConflictException("메일 전송에 실패했습니다.");
    }
  }

  async verifyAuthMessage(verifyAuthDto: VerifyAuthDto) {
    const authNumber = await this.cacheManager.get(verifyAuthDto.email);

    if (authNumber !== verifyAuthDto.authNumber) {
      throw new ConflictException("인증번호가 유효하지 않습니다.");
    }

    return {
      message: "인증에 성공했습니다.",
    };
  }

  async create(newUser: CreateUserDto) {
    const userEmail = await this.findByEmail(newUser.email);

    if (userEmail) {
      throw new ConflictException("이메일이 이미 존재합니다.");
    }

    try {
      const hashString = await this.hashString(newUser.password);

      await this.prisma.user.create({
        data: {
          ...newUser,
          password: hashString,
        },
      });

      return {
        message: "사용자 생성에 성공했습니다.",
      };
    } catch (error) {
      throw new Error("사용자 생성에 실패했습니다.");
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: forgotPasswordDto.email,
      },
    });

    if (!user) {
      throw new ConflictException("등록되지 않은 유저 입니다.");
    }

    const hashedPassword = await this.hashString(forgotPasswordDto.newPassword);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...user,
        password: hashedPassword,
      },
    });

    return {
      message: "비밀번호 변경이 완료되었습니다.",
    };
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ConflictException("등록되지 않은 유저 입니다.");
    }

    const isPasswordMatch = await this.verifyPassword(
      changePasswordDto.password,
      user.password
    );

    if (!isPasswordMatch) {
      throw new ForbiddenException("비밀번호가 일치하지 않습니다.");
    }

    const hashString = await this.hashString(changePasswordDto.newPassword);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...user,
        password: hashString,
      },
    });

    return {
      message: "비밀번호 변경이 완료되었습니다.",
    };
  }

  async login(loginUser: LoginUserDto) {
    const user = await this.findByEmail(loginUser.email);

    if (!user) {
      throw new ConflictException("등록되지 않은 유저 입니다.");
    }

    const isPasswordMatch = await this.verifyPassword(
      loginUser.password,
      user.password
    );

    if (!isPasswordMatch) {
      throw new ForbiddenException("비밀번호가 일치하지 않습니다.");
    }

    const tokens = await this.getTokens(user.id, user.email, user.nickname);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const userInfo = {
      email: user.email,
      nickName: user.nickname,
      createdAt: user.createdAt,
    };

    return {
      message: "로그인 성공했습니다.",
      userInfo,
      ...tokens,
    };
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: null,
      },
    });
    return {
      message: "로그아웃이 성공했습니다.",
    };
  }

  async delete(userId: number) {
    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return {
      message: "유저 삭제에 성공했습니다.",
    };
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async hashString(password: string) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async checkDuplicateEmail(email: string) {
    const user = await this.findByEmail(email);

    if (user) {
      throw new ConflictException("이미 존재하는 이메일입니다.");
    }

    return {
      message: "사용 가능한 이메일 입니다.",
      isDuplicate: false,
    };
  }

  async getTokens(userId: number, email: string, nickname: string) {
    const payload = {
      userId,
      email,
      nickname,
    };

    const accessTokenOptions = {
      expiresIn: 60 * 60,
      secret: "accessToken",
    };

    const refreshTokenOptions = {
      expiresIn: 60 * 60 * 24 * 7,
      secret: "refreshToken",
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, accessTokenOptions),
      this.jwtService.signAsync(payload, refreshTokenOptions),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashString(refreshToken);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException("일치하는 유저 및 토큰이 없습니다.");
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException("리프레쉬 토큰이 일치하지 않습니다.");
    }

    const tokens = await this.getTokens(user.id, user.email, user.nickname);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      message: "토큰 갱신에 성공했습니다.",
      ...tokens,
    };
  }
}
