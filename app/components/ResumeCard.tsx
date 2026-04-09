import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    let objectUrl = "";

    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;

      objectUrl = URL.createObjectURL(blob);
      setResumeUrl(objectUrl);
    };

    loadResume();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fs, imagePath]);

  const overallScore = feedback?.overallScore ?? 0;
  const scoreState =
    overallScore > 69
      ? "status-chip status-chip--success"
      : overallScore > 49
        ? "status-chip status-chip--warning"
        : "status-chip status-chip--danger";

  return (
    <Link to={`/resume/${id}`} className="resume-card-link group">
      <article className="surface-card-strong flex h-full flex-col gap-6 p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="eyebrow">Analysis Snapshot</p>
            <h2 className="panel-title break-words">
              {companyName || "Untitled Resume Review"}
            </h2>
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              {jobTitle || "AI-generated feedback for your latest upload."}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
            <div className={scoreState}>
              <span className="size-2 rounded-full bg-current" />
              {overallScore > 69
                ? "Strong match"
                : overallScore > 49
                  ? "Good potential"
                  : "Needs work"}
            </div>
            <ScoreCircle score={overallScore} />
          </div>
        </div>

        <div className="preview-frame overflow-hidden">
          {resumeUrl ? (
            <img
              src={resumeUrl}
              alt={`${companyName || "Resume"} preview`}
              className="h-[20rem] w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02] md:h-[22rem]"
            />
          ) : (
            <div className="loading-pulse flex h-[20rem] items-center justify-center rounded-[1rem] bg-[var(--surface-soft)] md:h-[22rem]">
              <span className="text-sm uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Loading Preview
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[color:var(--border)] pt-4 text-sm text-[var(--text-secondary)]">
          <span>Open full breakdown</span>
          <span className="text-[var(--text-primary)] transition-transform duration-200 group-hover:translate-x-1">
            View report
          </span>
        </div>
      </article>
    </Link>
  );
};

export default ResumeCard;
