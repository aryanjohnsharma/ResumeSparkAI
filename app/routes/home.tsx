import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeSparkAI" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, isLoading, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const storedResumes = (await kv.list("resume:*", true)) as KVItem[] | undefined;
      const parsedResumes =
        storedResumes?.map((resume) => JSON.parse(resume.value) as Resume) || [];

      setResumes(parsedResumes);
      setLoadingResumes(false);
    };

    loadResumes();
  }, [kv]);

  const stats = useMemo(() => {
    const total = resumes.length;
    const averageScore = total
      ? Math.round(
          resumes.reduce(
            (sum, resume) => sum + (resume.feedback?.overallScore ?? 0),
            0
          ) / total
        )
      : 0;

    const strongMatches = resumes.filter(
      (resume) => (resume.feedback?.overallScore ?? 0) >= 70
    ).length;

    return { total, averageScore, strongMatches };
  }, [resumes]);

  return (
    <main className="app-shell">
      <Navbar />

      <section className="app-container pt-8 md:pt-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(22rem,0.9fr)]">
          <div className="hero-card p-7 md:p-10">
            <div className="max-w-3xl space-y-6">
              <p className="eyebrow">Review Workspace</p>
              <h1 className="page-title">
                Sharpen each application before it reaches a hiring team.
              </h1>
              <p className="page-subtitle max-w-2xl">
                ResumeSparkAI keeps your uploads, AI scores, and ATS notes in one
                warm, dark-first workspace so you can review patterns and tighten
                the next draft with less guesswork.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/upload" className="button-primary">
                  Analyze a Resume
                </Link>
                <Link
                  to={resumes[0] ? `/resume/${resumes[0].id}` : "/upload"}
                  className="button-secondary"
                >
                  {resumes[0] ? "Open Latest Review" : "Start Your First Review"}
                </Link>
              </div>
            </div>
          </div>

          <aside className="surface-card-strong p-6 md:p-7">
            <p className="eyebrow">Dashboard Snapshot</p>
            <div className="mt-5 grid gap-4">
              <div className="metric-card">
                <p className="metric-label">Resumes analyzed</p>
                <p className="metric-value">{stats.total}</p>
                <p className="metric-copy">
                  Every upload stays available here for comparison and follow-up.
                </p>
              </div>
              <div className="metric-card">
                <p className="metric-label">Average score</p>
                <p className="metric-value">{stats.averageScore}</p>
                <p className="metric-copy">
                  A quick read on how your current portfolio of applications is
                  trending.
                </p>
              </div>
              <div className="metric-card">
                <p className="metric-label">Strong matches</p>
                <p className="metric-value">{stats.strongMatches}</p>
                <p className="metric-copy">
                  Reviews scoring 70+ and worth revisiting when you tailor the next
                  version.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-8 surface-card-strong p-6 md:p-7">
          <div className="flex flex-col gap-3 border-b border-[color:var(--border)] pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Your Review Library</p>
              <h2 className="section-title mt-3">Past submissions</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
              Re-open any saved report to inspect the preview, ATS score, and the
              detailed notes generated from your uploaded resume.
            </p>
          </div>

          {loadingResumes && (
            <div className="loading-pulse mt-8 flex min-h-[18rem] flex-col items-center justify-center gap-4 rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface-soft)] p-8 text-center">
              <img src="/images/resume-scan-2.gif" className="w-[180px]" alt="Loading resume scans" />
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Loading saved analyses
              </p>
            </div>
          )}

          {!loadingResumes && resumes.length > 0 && (
            <div className="mt-8 grid gap-5 xl:grid-cols-2">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          )}

          {!loadingResumes && resumes.length === 0 && (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-[color:var(--border)] bg-[var(--surface-soft)] p-8 md:p-10">
              <div className="max-w-2xl space-y-4">
                <div className="status-chip">Library is empty</div>
                <h3 className="panel-title">Upload your first resume to start the board.</h3>
                <p className="page-subtitle">
                  Once a resume is analyzed, it will appear here with a preview,
                  score summary, and a direct path back into the full report.
                </p>
                <Link to="/upload" className="button-primary mt-2">
                  Upload Resume
                </Link>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
