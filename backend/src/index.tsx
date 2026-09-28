import { OpenAPIHono } from "@hono/zod-openapi";
import { auth } from "./lib/auth";
import { myprofile } from "./features/myprofile";

const app = new OpenAPIHono<{ Bindings: Env }>();

const routes = app
  .basePath("/api")
  .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))
  .route("/myprofile", myprofile);

// OpenAPIドキュメントのエンドポイント
app.doc("/api/doc", {
  openapi: "3.0.0",
  info: { version: "1.0.0", title: "urekoi2 API" },
});

export default app;
export type AppType = typeof routes;
