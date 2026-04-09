import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import ThemeToggle from "~/components/ThemeToggle";
import { usePuterStore } from "~/lib/puter";

export const meta = () => ([
  { title: "ResumeSparkAI | Auth" },
  { name: "description", content: "Log into your account" },
]);

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = new URLSearchParams(location.search).get("next") || "/";
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, navigate, next]);

  return (
    <main className="app-shell">
      <section className="app-container pt-4">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
      </section>

      <section className="app-container flex min-h-[calc(100vh-7rem)] items-center py-10">
        <div className="grid w-full gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(28rem,0.9fr)]">
          <aside className="hero-card p-8 md:p-10">
            <div className="max-w-2xl space-y-6">
              <p className="eyebrow">ResumeSparkAI Access</p>
              <h1 className="page-title">Step into your review workspace.</h1>
              <p className="page-subtitle">
                Sign in to open your saved resume analyses, upload new drafts, and
                keep every ATS recommendation tied to the same workspace.
              </p>
            </div>

            <div className="mt-8 grid gap-3">
              {[
                "Secure Puter-backed auth for your existing review flow",
                "Saved resume previews and reports stay available after sign-in",
                "Theme toggle stays active here too, with dark mode as the starting view",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-4 rounded-[1.35rem] border border-[color:var(--border)] bg-[var(--surface-soft)] px-4 py-4"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-[rgba(201,100,66,0.14)] text-sm font-semibold text-[#edaf9a]">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-7 text-[var(--text-secondary)]">{item}</p>
                </div>
              ))}
            </div>
          </aside>

          <section className="surface-card-strong flex flex-col justify-between gap-8 p-8 md:p-10">
            <div className="space-y-4">
              <p className="eyebrow">Authentication</p>
              <h2 className="section-title">Welcome back</h2>
              <p className="text-sm leading-7 text-[var(--text-secondary)]">
                Use the same sign-in behavior that already powers the app. This
                redesign only updates the shell around it.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface-soft)] p-6">
              <p className="metric-label">Status</p>
              <p className="mt-3 font-serif text-3xl text-[var(--text-primary)]">
                {isLoading
                  ? "Checking session"
                  : auth.isAuthenticated
                    ? "Signed in"
                    : "Awaiting sign in"}
              </p>
              <p className="metric-copy">
                {auth.isAuthenticated
                  ? "Your workspace is ready."
                  : "Log in to continue your job journey and access your saved analyses."}
              </p>
            </div>

            <div>
              {isLoading ? (
                <button className="button-primary w-full animate-pulse" type="button">
                  Signing you in...
                </button>
              ) : auth.isAuthenticated ? (
                <button className="button-secondary w-full" onClick={auth.signOut} type="button">
                  Log Out
                </button>
              ) : (
                <button className="button-primary w-full" onClick={auth.signIn} type="button">
                  Log In
                </button>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Auth;
