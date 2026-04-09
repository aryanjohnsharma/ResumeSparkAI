import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import ThemeToggle from "~/components/ThemeToggle";
import { usePuterStore } from "~/lib/puter";

export const meta = () => ([
  { title: "ResumeSparkAI | Wipe Data" },
  { name: "description", content: "Clear all application data" },
]);

const WipeApp = () => {
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);

  const loadFiles = async () => {
    const storedFiles = (await fs.readDir("./")) as FSItem[] | undefined;
    setFiles(storedFiles || []);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [auth.isAuthenticated, isLoading, navigate]);

  const handleDelete = async () => {
    await Promise.all(files.map((file) => fs.delete(file.path)));
    await kv.flush();
    await loadFiles();
  };

  if (isLoading) {
    return (
      <main className="app-shell">
        <section className="app-container py-12">
          <div className="surface-card-strong p-8">
            <p className="panel-title">Loading workspace data...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-shell">
        <section className="app-container py-12">
          <div className="surface-card-strong p-8">
            <p className="panel-title">Error</p>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{error}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="app-container pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="back-link">
            <span aria-hidden="true">←</span>
            Back to dashboard
          </Link>
          <ThemeToggle />
        </div>
      </section>

      <section className="app-container py-8 md:py-10">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(24rem,1.1fr)]">
          <aside className="hero-card p-7 md:p-9">
            <p className="eyebrow">Danger Zone</p>
            <h1 className="section-title mt-3">Reset stored workspace data.</h1>
            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
              This clears files in the current Puter workspace and flushes the
              saved key-value review data. Use it only when you really want a clean
              slate.
            </p>

            <div className="mt-6 rounded-[1.5rem] border border-[rgba(201,106,106,0.25)] bg-[rgba(201,106,106,0.08)] p-5">
              <p className="metric-label">Authenticated as</p>
              <p className="mt-3 font-serif text-3xl text-[var(--text-primary)]">
                {auth.user?.username || "Unknown user"}
              </p>
            </div>

            <button className="button-primary mt-8 w-full" onClick={handleDelete} type="button">
              Wipe App Data
            </button>
          </aside>

          <section className="surface-card-strong p-6 md:p-8">
            <div className="space-y-3 border-b border-[color:var(--border)] pb-5">
              <p className="eyebrow">Current Files</p>
              <h2 className="section-title">Workspace contents</h2>
              <p className="text-sm leading-7 text-[var(--text-secondary)]">
                These are the files currently visible in the connected storage for
                this app.
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-[color:var(--border)] bg-[var(--surface-soft)] px-4 py-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{file.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      {file.path}
                    </p>
                  </div>
                </div>
              ))}

              {files.length === 0 && (
                <div className="rounded-[1.25rem] border border-dashed border-[color:var(--border)] px-4 py-6 text-sm text-[var(--text-secondary)]">
                  No files found in the current workspace.
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default WipeApp;
