import { inngest } from "@/inngest/client";
import { db } from "@/lib/db";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { generateSlug } from "random-word-slugs";
import z from "zod";

export const projectsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Project ID is required" }),
      }),
    )
    .query(async ({ input, ctx }) => {
      const project = await db.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return project;
    }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const projects = await db.project.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return projects;
  }),
  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Prompt is required" })
          .max(10000, { message: "Prompt is too long" }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const createdProject = await db.project.create({
        data: {
          userId: ctx.auth.userId,
          name: generateSlug(2, {
            format: "kebab",
          }),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      });

      inngest.send({
        name: "app/code-agent.run",
        data: {
          value: input.value,
          projectId: createdProject.id,
        },
      });

      return createdProject;
    }),
});
