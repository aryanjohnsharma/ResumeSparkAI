import React from 'react'

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  const subtitle = score > 69
    ? 'Strong ATS alignment'
    : score > 49
      ? 'Solid foundation'
      : 'Needs improvement';

  const scoreState = score > 69
    ? "status-chip status-chip--success"
    : score > 49
      ? "status-chip status-chip--warning"
      : "status-chip status-chip--danger";

  return (
    <section className="surface-card-strong w-full p-6 md:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <p className="eyebrow">Applicant Tracking Fit</p>
          <h2 className="panel-title">ATS Score</h2>
          <p className="max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
            This estimate reflects how legible and relevant your resume looks to
            automated screening systems before a recruiter ever sees it.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={scoreState}>
            <span className="size-2 rounded-full bg-current" />
            {subtitle}
          </div>
          <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Score
            </p>
            <p className="font-serif text-4xl text-[var(--text-primary)]">
              {score}
              <span className="text-lg text-[var(--text-secondary)]">/100</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={`${suggestion.tip}-${index}`}
            className="flex items-start gap-3 rounded-[1.25rem] border border-[color:var(--border)] bg-[var(--surface-soft)] px-4 py-4"
          >
            <span
              className={
                suggestion.type === "good"
                  ? "mt-1 inline-flex size-6 items-center justify-center rounded-full bg-[rgba(134,179,143,0.18)] text-[#bde3c4]"
                  : "mt-1 inline-flex size-6 items-center justify-center rounded-full bg-[rgba(214,162,92,0.18)] text-[#ecc285]"
              }
              aria-hidden="true"
            >
              {suggestion.type === "good" ? "+" : "!"}
            </span>
            <p className="text-sm leading-7 text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">
                {suggestion.type === "good" ? "Strength:" : "Improve:"}
              </span>{" "}
              {suggestion.tip}
            </p>
          </div>
        ))}
        {suggestions.length === 0 && (
          <div className="rounded-[1.25rem] border border-dashed border-[color:var(--border)] px-4 py-5 text-sm text-[var(--text-secondary)]">
            No ATS notes were returned for this run.
          </div>
        )}
      </div>

      <p className="mt-6 text-sm leading-7 text-[var(--text-secondary)]">
        Keep refining the phrasing, structure, and keyword alignment to improve
        your odds of getting past the filter and into a recruiter review queue.
      </p>
    </section>
  )
}

export default ATS
