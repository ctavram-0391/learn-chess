import { inngest } from "../client";

/**
 * Example: Hello World Function
 *
 * A simple example function that demonstrates the basic Inngest function structure.
 * This function is triggered by the "test/hello.world" event.
 *
 * @see https://www.inngest.com/docs/functions
 */
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // Step 1: Log the incoming event
    await step.run("log-event", async () => {
      console.log(`Received event: ${event.name}`, event.data);
      return { logged: true };
    });

    // Step 2: Return a greeting
    const greeting = await step.run("create-greeting", async () => {
      const name = event.data?.name || "World";
      return `Hello, ${name}!`;
    });

    return { message: greeting };
  }
);

/**
 * Example: User Onboarding Workflow
 *
 * A more complex example demonstrating multi-step durable execution.
 * This function shows:
 * - Sequential steps with automatic retries
 * - Delayed steps using step.sleep()
 * - Step dependencies (later steps use earlier step results)
 *
 * Trigger this with the "user/signed.up" event.
 *
 * @see https://www.inngest.com/docs/guides/multi-step-functions
 */
export const userOnboarding = inngest.createFunction(
  {
    id: "user-onboarding",
    // Configure retries (default is 4, set to 0 to disable)
    retries: 3,
    // Optional: Add concurrency limits to prevent overwhelming external services
    // concurrency: { limit: 10 },
  },
  { event: "user/signed.up" },
  async ({ event, step }) => {
    const { userId, email } = event.data;

    // Step 1: Send welcome email
    // Each step is independently retried on failure
    await step.run("send-welcome-email", async () => {
      console.log(`Sending welcome email to ${email}`);
      // In production, integrate with your email service:
      // await emailService.send({
      //   to: email,
      //   template: "welcome",
      //   data: { userId },
      // });
      return { emailSent: true };
    });

    // Step 2: Wait 1 day before sending follow-up
    // Inngest handles the delay durably - your function doesn't need to stay running
    await step.sleep("wait-for-follow-up", "1d");

    // Step 3: Check if user completed onboarding
    const userStatus = await step.run("check-user-status", async () => {
      console.log(`Checking onboarding status for user ${userId}`);
      // In production, check your database:
      // const user = await db.users.findById(userId);
      // return { completedOnboarding: user.onboardingComplete };
      return { completedOnboarding: false };
    });

    // Step 4: Send follow-up if needed
    if (!userStatus.completedOnboarding) {
      await step.run("send-follow-up-email", async () => {
        console.log(`Sending follow-up email to ${email}`);
        // await emailService.send({
        //   to: email,
        //   template: "onboarding-reminder",
        //   data: { userId },
        // });
        return { followUpSent: true };
      });
    }

    return {
      userId,
      onboardingComplete: userStatus.completedOnboarding,
      followUpSent: !userStatus.completedOnboarding,
    };
  }
);

/**
 * Example: Scheduled/Cron Job
 *
 * This function runs on a schedule (cron expression).
 * Great for cleanup tasks, report generation, or periodic syncs.
 *
 * @see https://www.inngest.com/docs/guides/scheduled-functions
 */
export const dailyCleanup = inngest.createFunction(
  { id: "daily-cleanup" },
  { cron: "0 0 * * *" }, // Runs daily at midnight UTC
  async ({ step }) => {
    // Step 1: Clean up expired sessions
    const sessionsCleared = await step.run("clear-expired-sessions", async () => {
      console.log("Cleaning up expired sessions...");
      // In production:
      // const result = await db.sessions.deleteMany({
      //   expiresAt: { $lt: new Date() }
      // });
      // return { count: result.deletedCount };
      return { count: 0 };
    });

    // Step 2: Clean up old logs
    const logsCleared = await step.run("clear-old-logs", async () => {
      console.log("Cleaning up old logs...");
      // In production:
      // const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      // const result = await db.logs.deleteMany({
      //   createdAt: { $lt: thirtyDaysAgo }
      // });
      // return { count: result.deletedCount };
      return { count: 0 };
    });

    return {
      sessionsCleared: sessionsCleared.count,
      logsCleared: logsCleared.count,
      completedAt: new Date().toISOString(),
    };
  }
);
