// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { solveSessionRouter } from "./solveSession";
import { solveRouter } from "./solve";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  solveSession: solveSessionRouter,
  solve: solveRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
