export const env = {
  userEmail: process.env.PORTFOLIO_USER_EMAIL ?? "qa.engineer@example.test",
  userPassword: process.env.PORTFOLIO_USER_PASSWORD ?? "Portfolio!2026",
} as const;
