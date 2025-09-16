import { z } from "zod";

const configSchema = z.object({
  projectId: z.string().default(""),
  jwksUrl: z.string().default(""),
  publishableClientKey: z.string().default(""),
  handlerUrl: z.string().default('auth')
});

type StackAuthExtensionConfig = z.infer<typeof configSchema>;

// This is set by vite.config.ts
declare const __STACK_AUTH_CONFIG__: string;

export const config: StackAuthExtensionConfig = configSchema.parse(
  JSON.parse(__STACK_AUTH_CONFIG__),
);
