import { env } from "./config";
import { buildApp } from "./app";

async function startServer(): Promise<void> {
  const app = buildApp();

  try {
    await app.listen({
      host: env.HOST,
      port: env.PORT
    });
  } catch (error) {
    app.log.error(error, "Failed to start server");
    process.exit(1);
  }
}

void startServer();
