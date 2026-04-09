import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score }: { title: string, score: number }) => {
  const textColor =
    score > 70
      ? "text-[#bde3c4]"
      : score > 49
        ? "text-[#ecc285]"
        : "text-[#ebadad]";

  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-[color:var(--border)] bg-[var(--surface-soft)] px-4 py-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <p className="text-lg font-semibold text-[var(--text-primary)]">{title}</p>
        <ScoreBadge score={score} />
      </div>
      <p className="text-lg font-semibold text-[var(--text-secondary)]">
        <span className={textColor}>{score}</span>/100
      </p>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <section className="surface-card-strong w-full p-6 md:p-7">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="surface-muted flex justify-center p-4">
          <ScoreGauge score={feedback.overallScore} />
        </div>

        <div className="space-y-3">
          <p className="eyebrow">Overall Performance</p>
          <h2 className="panel-title">Your Resume Score</h2>
          <p className="max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
            This summary blends your ATS compatibility, clarity, structure, and
            skill signaling into one view so you can prioritize the biggest
            improvements first.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
        <Category title="Content" score={feedback.content.score} />
        <Category title="Structure" score={feedback.structure.score} />
        <Category title="Skills" score={feedback.skills.score} />
      </div>
    </section>
  );
};

export default Summary;
