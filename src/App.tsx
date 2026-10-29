import { lazy, Suspense, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { ErrorBoundary } from "./components/ErrorBoundary";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Services = lazy(() => import("./pages/Services"));
const Participants = lazy(() => import("./pages/Participants"));
const Requests = lazy(() => import("./pages/Requests"));
const Charges = lazy(() => import("./pages/Charges"));
const Pix = lazy(() => import("./pages/Pix"));
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Loading() {
  return (
    <div className="page-loading" role="status" aria-label="Carregando">
      <div className="spinner" />
    </div>
  );
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className={`app-shell ${darkMode ? "dark" : ""}`}>
      <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="main-content">
        <Topbar
          onMenuOpen={() => setMobileOpen(true)}
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
        />
        <div className="page-content">
          <ErrorBoundary>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="services" element={<Services />} />
                <Route path="participants" element={<Participants />} />
                <Route path="requests" element={<Requests />} />
                <Route path="charges" element={<Charges />} />
                <Route path="pix" element={<Pix />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings darkMode={darkMode} onToggleTheme={toggleTheme} />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
