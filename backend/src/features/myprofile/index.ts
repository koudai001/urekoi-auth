import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { requireAuth } from "../../middlewares/require-auth";
import { createProfileSchema } from "./schema";
import { myProfileService } from "./service";

export const myprofile = new Hono<{
  Bindings: Env;
  Variables: { userId: string };
}>()
  .use(requireAuth)
  .post(
    "/",
    zValidator("json", createProfileSchema),
    async (c) => {
      const userId = c.get("userId");
      const data = c.req.valid("json");

      let created;
      try {
        created = await myProfileService.createProfile(userId, data);
      } catch (err) {
        console.error(err);
        return c.json({ error: "internal server error" }, 500);
      }

      // プロフィール設定済みクッキーを設定する
      setCookie(c, "has_profile", "true", {
        httpOnly: false,
        secure: true,
        sameSite: "Strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json(created, 201);
    },
  );
