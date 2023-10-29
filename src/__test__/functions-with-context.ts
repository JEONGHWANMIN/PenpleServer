import { User } from "@prisma/client";
import { Context } from "./context";

export async function createUser(user: User, ctx: Context) {
  if (user.email) {
    return await ctx.prisma.user.create({
      data: user,
    });
  } else {
    return new Error("User must accept terms!");
  }
}
