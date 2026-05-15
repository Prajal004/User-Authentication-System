import dotenv from "dotenv";
dotenv.config();

import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import connectDB from "./config/db.js";

const app = new Koa();
const PORT = process.env.PORT || 4000;

await connectDB();

app.use(cors());
app.use(bodyParser());

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  console.log(`${ctx.method} ${ctx.path} ${Date.now() - start}ms`);
});

app.use(authRoutes.routes());
app.use(authRoutes.allowedMethods());

app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});