import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    steady_state: {
      executor: "constant-vus",
      vus: 5,
      duration: "30s",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

const baseUrl = __ENV.BASE_URL || "http://127.0.0.1:4173";

export default function () {
  const response = http.get(`${baseUrl}/health`);
  check(response, {
    "health status is 200": (result) => result.status === 200,
    "service reports ok": (result) => result.json("status") === "ok",
  });
  sleep(1);
}
