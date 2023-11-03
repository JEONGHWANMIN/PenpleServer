import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthDto, CreateUserDto, LoginUserDto } from "./dto";
import { UsersService } from "./users.service";
import { GetTokenUser } from "src/common/decorator/user.decorator";
import { AccessTokenGuard, RefreshTokenGuard } from "src/common/guards";
import { AccessTokenPayload, RefreshTokenPayload } from "./types/tokenPayload";

@Injectable()
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post("/send-auth")
  async sendAuthMessage(@Body("email") email: string) {
    return this.usersService.sendAuthMessage(email);
  }

  @Post("/verify-auth")
  async verifyAuthMessage(@Body() auth: AuthDto) {
    return this.usersService.verifyAuthMessage(auth);
  }

  @Post("/signup")
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post("/signin")
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Post("/check")
  findEmail(@Body("email") email: string) {
    return this.usersService.checkDuplicateEmail(email);
  }

  @UseGuards(AccessTokenGuard)
  @Get("/")
  logout(@GetTokenUser() user: AccessTokenPayload) {
    return this.usersService.logout(user.userId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete("/")
  deleteUser(@GetTokenUser() user: AccessTokenPayload) {
    return this.usersService.delete(user.userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Get("/renew")
  refreshTokens(@GetTokenUser() user: RefreshTokenPayload) {
    const userId = user.userId;
    const refreshToken = user.refreshToken;
    return this.usersService.refreshTokens(userId, refreshToken);
  }
}
