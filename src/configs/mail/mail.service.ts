import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { CreateMailDto } from "./dto/mail.dto";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail({ to, subject, from, html }: CreateMailDto) {
    return await this.mailerService.sendMail({
      to,
      from,
      subject,
      html,
    });
  }
}
