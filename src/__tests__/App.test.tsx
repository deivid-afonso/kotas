import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import App from "../App";

function mockApi() {
  const users = new Map<string, { id: number; name: string; email: string; password: string; role: "admin" | "user" }>();
  users.set("admin@test.com", { id: 1, name: "Admin Test", email: "admin@test.com", password: "test-password", role: "admin" });
  let nextId = 2;

  globalThis.fetch = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
    const path = typeof url === "string" ? url : url.toString();
    const body = init?.body ? JSON.parse(init.body as string) : {};

    if (path.endsWith("/auth/login")) {
      const u = users.get(String(body.email).toLowerCase());
      if (!u || u.password !== body.password) {
        return new Response(JSON.stringify({ error: "E-mail ou senha incorretos." }), { status: 401 });
      }
      return new Response(JSON.stringify({ token: "fake", user: { id: u.id, name: u.name, email: u.email, role: u.role } }));
    }
    if (path.endsWith("/auth/register")) {
      if (users.has(String(body.email).toLowerCase())) {
        return new Response(JSON.stringify({ error: "Este e-mail já está cadastrado." }), { status: 409 });
      }
      const u = { id: nextId++, name: body.name, email: String(body.email).toLowerCase(), password: body.password, role: "user" as const };
      users.set(u.email, u);
      return new Response(JSON.stringify({ token: "fake", user: { id: u.id, name: u.name, email: u.email, role: u.role } }), { status: 201 });
    }
    if (path.endsWith("/auth/me")) {
      return new Response(JSON.stringify({ user: { id: 1, name: "Admin Test", email: "admin@test.com", role: "admin" } }));
    }
    if (path.endsWith("/requests") || path.endsWith("/requests/mine") || path.endsWith("/users")) {
      return new Response(JSON.stringify([]));
    }
    return new Response(JSON.stringify({}), { status: 200 });
  }) as typeof fetch;
}

afterEach(() => {
  cleanup();
  try { localStorage.clear(); } catch { /* ok */ }
  vi.restoreAllMocks();
});

beforeEach(() => {
  try { localStorage.clear(); } catch { /* ok */ }
  mockApi();
});

function renderApp(route = "/") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("App - Login", () => {
  it("shows login page when unauthenticated", async () => {
    renderApp();
    expect(await screen.findByText("Faça login para gerenciar suas assinaturas")).toBeInTheDocument();
  });

  it("rejects wrong password", async () => {
    renderApp();
    await userEvent.type(await screen.findByPlaceholderText("seu@email.com"), "admin@test.com");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "wrong");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(await screen.findByText("E-mail ou senha incorretos.")).toBeInTheDocument();
  });

  it("logs in as admin", async () => {
    renderApp();
    await userEvent.type(await screen.findByPlaceholderText("seu@email.com"), "admin@test.com");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "test-password");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));
    await waitFor(() => expect(screen.queryByText(/Bom dia, Admin/)).toBeInTheDocument(), { timeout: 3000 });
  });

  it("registers and logs in as new user", async () => {
    renderApp();
    await userEvent.click(await screen.findByRole("button", { name: "Criar uma conta" }));
    await userEvent.type(await screen.findByPlaceholderText("Seu nome"), "Lais Teste");
    await userEvent.type(screen.getByPlaceholderText("seu@email.com"), "lais@email.com");
    await userEvent.type(screen.getByPlaceholderText("Mínimo 6 caracteres"), "lais123456");
    await userEvent.type(screen.getByPlaceholderText("Repita a senha"), "lais123456");
    await userEvent.click(screen.getByRole("button", { name: /Criar conta/ }));
    await waitFor(() => expect(screen.queryByText(/Olá, Lais/)).toBeInTheDocument(), { timeout: 3000 });
  });
});
