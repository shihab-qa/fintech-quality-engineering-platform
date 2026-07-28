import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT ?? 4173);
const validUser = {
  email: process.env.PORTFOLIO_USER_EMAIL ?? "qa.engineer@example.test",
  password: process.env.PORTFOLIO_USER_PASSWORD ?? "Portfolio!2026",
  role: "Loan Operations QA",
};
const tokens = new Set();
const loans = new Map();

const transitions = {
  Draft: ["Submitted"],
  Submitted: ["Approved", "Rejected"],
  Approved: ["Disbursed"],
  Rejected: [],
  Disbursed: [],
};

function log(requestId, method, path, status, startedAt) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      requestId,
      method,
      path,
      status,
      durationMs: Date.now() - startedAt,
    }),
  );
}

function sendJson(res, status, body, requestId) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
    "x-request-id": requestId,
    "cache-control": "no-store",
  });
  res.end(payload);
}

async function parseJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function isAuthorized(req) {
  const header = req.headers.authorization ?? "";
  return header.startsWith("Bearer ") && tokens.has(header.slice(7));
}

function validateLoan(payload) {
  const errors = [];
  if (
    typeof payload.applicantName !== "string" ||
    payload.applicantName.trim().length < 2
  )
    errors.push("applicantName");
  if (typeof payload.amount !== "number" || payload.amount <= 0)
    errors.push("amount");
  if (
    !Number.isInteger(payload.termMonths) ||
    payload.termMonths < 1 ||
    payload.termMonths > 60
  )
    errors.push("termMonths");
  if (typeof payload.purpose !== "string" || payload.purpose.trim().length < 2)
    errors.push("purpose");
  return errors;
}

async function serveStatic(pathname, res, requestId) {
  const routes = {
    "/": "login.html",
    "/login": "login.html",
    "/dashboard": "dashboard.html",
    "/app.js": "app.js",
    "/styles.css": "styles.css",
  };
  const file = routes[pathname];
  if (!file) return false;

  const body = await readFile(join(root, "public", file));
  const type = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
  }[extname(file)];
  res.writeHead(200, {
    "content-type": type,
    "x-request-id": requestId,
    "cache-control": "no-store",
  });
  res.end(body);
  return true;
}

const server = createServer(async (req, res) => {
  const startedAt = Date.now();
  const requestId = req.headers["x-request-id"]?.toString() ?? randomUUID();
  const url = new URL(
    req.url ?? "/",
    `http://${req.headers.host ?? `127.0.0.1:${port}`}`,
  );
  let status = 500;

  try {
    if (req.method === "GET" && url.pathname === "/health") {
      status = 200;
      sendJson(
        res,
        status,
        { status: "ok", service: "synthetic-lending-platform" },
        requestId,
      );
      return;
    }

    if (
      req.method === "GET" &&
      (await serveStatic(url.pathname, res, requestId))
    ) {
      status = 200;
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/auth/login") {
      const body = await parseJson(req);
      if (
        body.email !== validUser.email ||
        body.password !== validUser.password
      ) {
        status = 401;
        sendJson(
          res,
          status,
          {
            error: "INVALID_CREDENTIALS",
            message: "Unable to sign in with the provided credentials.",
          },
          requestId,
        );
        return;
      }
      const token = randomUUID();
      tokens.add(token);
      status = 200;
      sendJson(
        res,
        status,
        { token, user: { email: validUser.email, role: validUser.role } },
        requestId,
      );
      return;
    }

    if (url.pathname.startsWith("/api/loans") && !isAuthorized(req)) {
      status = 401;
      sendJson(res, status, { error: "UNAUTHORIZED" }, requestId);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/loans") {
      status = 200;
      sendJson(res, status, { items: [...loans.values()] }, requestId);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/loans") {
      const body = await parseJson(req);
      const fields = validateLoan(body);
      if (fields.length > 0) {
        status = 400;
        sendJson(res, status, { error: "VALIDATION_ERROR", fields }, requestId);
        return;
      }
      const now = new Date().toISOString();
      const loan = {
        id: randomUUID(),
        applicantName: body.applicantName.trim(),
        amount: body.amount,
        termMonths: body.termMonths,
        purpose: body.purpose.trim(),
        status: "Draft",
        createdAt: now,
        updatedAt: now,
      };
      loans.set(loan.id, loan);
      status = 201;
      sendJson(res, status, loan, requestId);
      return;
    }

    const loanMatch = url.pathname.match(/^\/api\/loans\/([^/]+)$/);
    if (loanMatch && req.method === "GET") {
      const loan = loans.get(loanMatch[1]);
      if (!loan) {
        status = 404;
        sendJson(res, status, { error: "NOT_FOUND" }, requestId);
        return;
      }
      status = 200;
      sendJson(res, status, loan, requestId);
      return;
    }

    if (loanMatch && req.method === "DELETE") {
      const existed = loans.delete(loanMatch[1]);
      status = existed ? 204 : 404;
      res.writeHead(status, {
        "x-request-id": requestId,
        "cache-control": "no-store",
      });
      res.end();
      return;
    }

    const statusMatch = url.pathname.match(/^\/api\/loans\/([^/]+)\/status$/);
    if (statusMatch && req.method === "PATCH") {
      const loan = loans.get(statusMatch[1]);
      if (!loan) {
        status = 404;
        sendJson(res, status, { error: "NOT_FOUND" }, requestId);
        return;
      }
      const body = await parseJson(req);
      const allowed = transitions[loan.status] ?? [];
      if (!allowed.includes(body.status)) {
        status = 409;
        sendJson(
          res,
          status,
          {
            error: "INVALID_STATE_TRANSITION",
            currentStatus: loan.status,
            requestedStatus: body.status,
            allowedStatuses: allowed,
          },
          requestId,
        );
        return;
      }
      loan.status = body.status;
      loan.updatedAt = new Date().toISOString();
      status = 200;
      sendJson(res, status, loan, requestId);
      return;
    }

    status = 404;
    sendJson(res, status, { error: "NOT_FOUND" }, requestId);
  } catch (error) {
    status = 500;
    sendJson(
      res,
      status,
      {
        error: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      requestId,
    );
  } finally {
    log(requestId, req.method ?? "UNKNOWN", url.pathname, status, startedAt);
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(JSON.stringify({ event: "server_started", port }));
});
