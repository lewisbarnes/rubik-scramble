import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const solveSessionRouter = router({
  getCurrentSession: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.solveSession.findFirst({
      where: { userId: ctx.session?.user?.id },
      include: { puzzleSolves: true },
    });

    if (!result) {
      return await prisma?.solveSession.create({
        data: { userId: ctx.session.user.id },
        select: {
          id: true,
          userId: true,
          startDate: true,
          user: true,
          puzzleSolves: true,
        },
      });
    }
    return result;
  }),
});
