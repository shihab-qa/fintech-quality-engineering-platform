const page = document.body.dataset.page;
const tokenKey = "portfolio-token";

async function api(path, options = {}) {
  const token = localStorage.getItem(tokenKey);

  const response = await fetch(path, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const body = response.status === 204 ? undefined : await response.json();

  return { response, body };
}

if (page === "login") {
  document
    .querySelector("#login-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const alert = document.querySelector("#login-alert");
      alert.textContent = "";

      const formElement = event.currentTarget;
      const form = new FormData(formElement);

      const result = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });

      if (!result.response.ok) {
        alert.textContent = result.body.message;
        return;
      }

      localStorage.setItem(tokenKey, result.body.token);
      window.location.assign("/dashboard");
    });
}

if (page === "dashboard") {
  if (!localStorage.getItem(tokenKey)) {
    window.location.assign("/login");
  }

  const body = document.querySelector("#applications-body");
  const alert = document.querySelector("#form-alert");

  async function loadApplications() {
    const result = await api("/api/loans");

    if (result.response.status === 401) {
      localStorage.removeItem(tokenKey);
      window.location.assign("/login");
      return;
    }

    body.replaceChildren(...result.body.items.map(renderRow));
  }

  function renderRow(loan) {
    const row = document.createElement("tr");
    row.dataset.loanId = loan.id;

    const values = [
      loan.applicantName,
      new Intl.NumberFormat("en-US").format(loan.amount),
      `${loan.termMonths} months`,
      loan.purpose,
      loan.status,
    ];

    for (const value of values) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    }

    const action = document.createElement("td");

    if (loan.status === "Draft") {
      const button = document.createElement("button");

      button.type = "button";
      button.textContent = "Submit";

      button.addEventListener("click", async () => {
        const result = await api(`/api/loans/${loan.id}/status`, {
          method: "PATCH",
          body: JSON.stringify({
            status: "Submitted",
          }),
        });

        if (result.response.ok) {
          await loadApplications();
        }
      });

      action.append(button);
    } else {
      action.textContent = "—";
    }

    row.append(action);

    return row;
  }

  document
    .querySelector("#loan-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      alert.textContent = "";

      const formElement = event.currentTarget;
      const form = new FormData(formElement);

      const result = await api("/api/loans", {
        method: "POST",
        body: JSON.stringify({
          applicantName: form.get("applicantName"),
          amount: Number(form.get("amount")),
          termMonths: Number(form.get("termMonths")),
          purpose: form.get("purpose"),
        }),
      });

      if (!result.response.ok) {
        alert.textContent = "Unable to create the application.";
        return;
      }

      formElement.reset();
      await loadApplications();
    });

  document.querySelector("#logout").addEventListener("click", () => {
    localStorage.removeItem(tokenKey);
    window.location.assign("/login");
  });

  await loadApplications();
}
