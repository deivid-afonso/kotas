import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

function renderApp(route = "/") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  );
}

describe("App", () => {
  it("renders the sidebar brand", () => {
    renderApp();
    expect(screen.getByText("assina")).toBeInTheDocument();
  });

  it("renders dashboard by default", async () => {
    renderApp();
    expect(await screen.findByText(/Bom dia, Admin/)).toBeInTheDocument();
  });

  it("renders services page", async () => {
    renderApp("/services");
    expect(await screen.findByRole("heading", { name: "Serviços", level: 1 })).toBeInTheDocument();
  });

  it("renders 404 for unknown routes", async () => {
    renderApp("/nonexistent");
    expect(await screen.findByText("Página não encontrada")).toBeInTheDocument();
  });
});
