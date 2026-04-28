import { afterAll, describe, expect, it } from "vitest";
import { buildApp } from "./app";

const app = buildApp({ registerPrisma: false });

describe("Health check", () => {
  it("returns 200 for GET /health", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      success: true,
      message: "OK"
    });
  });
});

afterAll(async () => {
  await app.close();
});
