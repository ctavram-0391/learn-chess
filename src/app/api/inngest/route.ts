import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { functions } from "@/lib/inngest/functions";

/**
 * Inngest API Route Handler
 *
 * This route serves your Inngest functions and handles:
 * - Function registration with the Inngest platform
 * - Event reception and function invocation
 * - Health checks and introspection
 *
 * The Inngest Dev Server will automatically discover functions
 * served at this endpoint during local development.
 *
 * @see https://www.inngest.com/docs/sdk/serve
 */
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});
