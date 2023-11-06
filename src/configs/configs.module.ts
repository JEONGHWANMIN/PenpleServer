import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigModule } from "@nestjs/config";

const ONE_MINUTE = 60000;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === "production"
          ? `env/.production.env`
          : `env/.${process.env.NODE_ENV}.env`,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: ONE_MINUTE * 3, // 60000 => 1분
      max: 100,
    }),
  ],
})
export class ConfigsModule {}
