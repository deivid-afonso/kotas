import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import App from "../App";

afterEach(() => {
  cleanup();
  try { localStorage.clear(); } catch { /* ok */ }
});

beforeEach(() => {
  try { localStorage.clear(); } catch { /* ok */ }
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

  it("validates empty email on submit", async () => {
    renderApp();
    const btn = await screen.findByRole("button", { name: "Entrar" });
    await userEvent.click(btn);
    expect(await screen.findByText("Informe seu e-mail.")).toBeInTheDocument();
  });

  it("validates invalid email format", async () => {
    renderApp();
    await userEvent.type(await screen.findByPlaceholderText("seu@email.com"), "notanemail");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "123");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(await screen.findByText("Formato de e-mail inválido.")).toBeInTheDocument();
  });

  it("rejects wrong password", async () => {
    renderApp();
    await userEvent.type(await screen.findByPlaceholderText("seu@email.com"), "admin@assina.com");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "wrong");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(await screen.findByText("E-mail ou senha incorretos.")).toBeInTheDocument();
  });

  it("logs in as admin", async () => {
    renderApp();
    await userEvent.type(await screen.findByPlaceholderText("seu@email.com"), "deividsa@gmail.com");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "Pedro123@@11");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));
    await waitFor(() => expect(screen.queryByText(/Bom dia, Deivid/)).toBeInTheDocument(), { timeout: 3000 });
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
