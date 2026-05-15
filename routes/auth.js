import Router from "@koa/router";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { registerSchema, loginSchema } from "../validation/authSchemas.js";
import { generateToken } from "../middleware/jwt.js";

const router = new Router({ prefix: "/api/auth" });

const roles = {
  USER: "user",
  ADMIN: "admin"
};

router.post("/register", async (ctx) => {
  try {
    const data = await registerSchema.validate(ctx.request.body, {
      abortEarly: false,
    });

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      ctx.status = 400;
      ctx.body = { message: "Email already in use" };
      return;
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    
    const user = await User.create({
      email: data.email,
      passwordHash,
      role: roles.USER,
    });

    ctx.status = 201;
    ctx.body = {
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      message: "Validation failed",
      errors: err.errors || [err.message],
    };
  }
});

router.post("/login", async (ctx) => {
  try {
    const data = await loginSchema.validate(ctx.request.body, {
      abortEarly: false,
    });

    const user = await User.findOne({ email: data.email });
    if (!user) {
      ctx.status = 400;
      ctx.body = { message: "Invalid credentials" };
      return;
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      ctx.status = 400;
      ctx.body = { message: "Invalid credentials" };
      return;
    }

    const token = generateToken(user);

    ctx.body = {
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      message: "Validation failed",
      errors: err.errors || [err.message],
    };
  }
});

export default router;