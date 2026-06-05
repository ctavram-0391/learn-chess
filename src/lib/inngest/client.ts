import { Inngest } from "inngest";

/**
 * Inngest Client Configuration
 *
 * This is the central Inngest client used throughout the application.
 * All Inngest functions should use this client instance.
 *
 * @see https://www.inngest.com/docs/reference/client/create
 */
export const inngest = new Inngest({
  /**
   * A unique identifier for your application.
   * This groups all functions and events for your app in the Inngest dashboard.
   */
  id: "next-launch-ts",

  /**
   * Optional: Configure event schemas for type safety.
   * Uncomment and extend the schemas as you add more events.
   */
  // schemas: new EventSchemas().fromRecord<{
  //   "user/created": { data: { userId: string; email: string } };
  //   "email/send": { data: { to: string; subject: string; body: string } };
  // }>(),
});
