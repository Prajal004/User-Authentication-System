export const requireRole = (...allowedRoles) => {
  return async (ctx, next) => {
    const role = ctx.state.user?.role;

    if (!role || !allowedRoles.includes(role)) {
      ctx.status = 403;
      ctx.body = { message: "Forbidden: insufficient permissions" };
      return;
    }

    await next();
  };
};