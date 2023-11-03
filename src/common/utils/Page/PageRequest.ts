import { IsOptional, IsString } from "class-validator";

export class PageRequest {
  @IsString()
  @IsOptional()
  page?: number = 1;

  @IsString()
  @IsOptional()
  size?: number = 10;

  getOffset(): number {
    if (!this.page || this.page < 1) {
      this.page = 1;
    }

    if (!this.size || this.size < 1) {
      this.size = 10;
    }

    return (Number(this.page) - 1) * Number(this.size);
  }

  getLimit(): number {
    if (!this.size || this.size < 1) {
      this.size = 10;
    }
    return Number(this.size);
  }
}
