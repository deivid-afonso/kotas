import { lazy, Suspense, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import { useAuth } from "./contexts/AuthContext";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { ErrorBoundary } from "./components/ErrorBoundary";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const Services = lazy(() => import("./pages/Services"));
const Participants = lazy(() => import("./pages/Participants"));
const Requests = lazy(() => import("./pages/Requests"));
const Charges = lazy(() => import("./pages/Charges"));
const UserCharges = lazy(() => import("./pages/UserCharges"));
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
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const { darkMode, toggleTheme } = useTheme();
  const { user, isAdmin } = useAuth();

  if (!user) {
    return (
      <div className={`app-shell ${darkMode ? "dark" : ""}`}>
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            {authView === "login" ? (
              <Login onGoRegister={() => setAuthView("register")} />
            ) : (
              <Register onGoLogin={() => setAuthView("login")} />
            )}
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  }

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
              {isAdmin ? (
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
              ) : (
                <Routes>
                  <Route index element={<UserDashboard />} />
                  <Route path="charges" element={<UserCharges />} />
                  <Route path="settings" element={<Settings darkMode={darkMode} onToggleTheme={toggleTheme} />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              )}
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
