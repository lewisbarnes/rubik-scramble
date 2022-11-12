import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const solveRouter = router({
  addSolve: protectedProcedure
    .input(
      z.object({ sessionId: z.string(), time: z.date(), scramble: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.puzzleSolve.create({
        data: {
          sessionId: input.sessionId,
          time: input.time,
          scramble: input.scramble,
          timeStamp: new Date(),
        },
      });
    }),
});
