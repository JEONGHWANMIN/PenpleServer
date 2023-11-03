import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsEmail()
  @IsOptional()
  from?: string = "noreplay@gmail.com";

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  html: string;
}
