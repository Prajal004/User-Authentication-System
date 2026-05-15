import Router from "@koa/router";
import User from "../models/User.js";
import { verifyToken } from "../middleware/jwt.js";
import { requireRole } from "../middleware/requireRole.js";

const router = new Router({ prefix: "/api/users" });

router.get("/", verifyToken, requireRole("admin"), async (ctx) => {
  try {
    const users = await User.find().select("-passwordHash");

    ctx.body = {
      message: "All users",
      users,
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      message: "Server error",
      error: err.message,
    };
  }
});

export default router;