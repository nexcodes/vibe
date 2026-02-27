import { messagesRouter } from "@/modules/messages/server/procedures";
import { createTRPCRouter } from "../init";
import { projectsRouter } from "@/modules/projects/server/procedures";
import { usageRouter } from "@/modules/usage/server/procedure";

export const appRouter = createTRPCRouter({
  projects: projectsRouter,
  messages: messagesRouter,
  usage: usageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
