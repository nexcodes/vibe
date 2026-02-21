import { inngest } from "@/inngest/client";
import { db } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const messagesRouter = createTRPCRouter({
    getMany: baseProcedure.query(async () => {
        const messages = await db.message.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        return messages;
    }),
    create: baseProcedure.input(z.object({
        value: z.string().min(1, { message: "Message is required" })
    })).mutation(async ({ input }) => {
        const createdMessage = await db.message.create({
            data: {
                content: input.value,
                role: "USER",
                type: "RESULT"
            }
        })

        inngest.send({
            name: "app/code-agent.run",
            data: {
                value: input.value
            }
        })

        return createdMessage;

    })
});