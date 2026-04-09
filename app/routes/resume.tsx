import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import ThemeToggle from "~/components/ThemeToggle";
import { usePuterStore } from "~/lib/puter";

export const meta = () => ([
  { title: "ResumeSparkAI | Review " },
  { name: "description", content: "Detailed overview of your resume" },
]);

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [resumeData, setResumeData] = useState<Resume | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
  }, [auth.isAuthenticated, id, isLoading, navigate]);

  useEffect(() => {
    let createdResumeUrl = "";
    let createdImageUrl = "";

    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;

      const data = JSON.parse(resume) as Resume;
      setResumeData(data);

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      createdResumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(createdResumeUrl);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;

      createdImageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(createdImageUrl);
      setFeedback(data.feedback);
    };

    loadResume();

    return () => {
      if (createdResumeUrl) URL.revokeObjectURL(createdResumeUrl);
      if (createdImageUrl) URL.revokeObjectURL(createdImageUrl);
    };
  }, [fs, id, kv]);

  return (
    <main className="app-shell">
      <header className="nav-shell">
        <div className="app-container">
          <div className="nav-bar flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/" className="back-link">
                <span aria-hidden="true">←</span>
                Back to dashboard
              </Link>
              <Link to="/upload" className="button-secondary">
                Upload another resume
              </Link>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="app-container pt-8 md:pt-10">
        <div className="grid gap-6 xl:grid-cols-[minmax(21rem,0.86fr)_minmax(0,1.14fr)]">
          <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
            <div className="hero-card p-6 md:p-7">
              <p className="eyebrow">Resume Review</p>
              <h1 className="section-title mt-3">
                {resumeData?.companyName || "Untitled Application"}
              </h1>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                {resumeData?.jobTitle ||
                  "Your full preview and AI assessment are shown below."}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <div className="status-chip">Dark by default</div>
                {feedback && (
                  <div
                    className={
                      feedback.overallScore >= 70
                        ? "status-chip status-chip--success"
                        : feedback.overallScore >= 50
                          ? "status-chip status-chip--warning"
                          : "status-chip status-chip--danger"
                    }
                  >
                    Score {feedback.overallScore}/100
                  </div>
                )}
              </div>
            </div>

            <div className="surface-card-strong p-4 md:p-5">
              {imageUrl && resumeUrl ? (
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  <div className="preview-frame">
                    <img
                      src={imageUrl}
                      className="max-h-[72vh] w-full object-contain"
                      title="resume"
                      alt="Uploaded resume preview"
                    />
                  </div>
                </a>
              ) : (
                <div className="loading-pulse flex min-h-[24rem] items-center justify-center rounded-[1.5rem] bg-[var(--surface-soft)]">
                  <img
                    src="/images/resume-scan-2.gif"
                    className="w-[180px]"
                    alt="Loading resume preview"
                  />
                </div>
              )}
            </div>
          </aside>

          <section className="flex flex-col gap-6">
            {feedback ? (
              <>
                <Summary feedback={feedback} />
                <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                <Details feedback={feedback} />
              </>
            ) : (
              <div className="surface-card-strong flex min-h-[32rem] flex-col items-center justify-center gap-5 p-8 text-center">
                <div className="status-chip">Preparing report</div>
                <h2 className="section-title">Finishing your analysis</h2>
                <p className="max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
                  We’re still loading the stored preview and feedback payload for
                  this resume.
                </p>
                <img
                  src="/images/resume-scan-2.gif"
                  className="w-full max-w-sm rounded-[1.5rem]"
                  alt="Loading resume analysis"
                />
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default Resume;
