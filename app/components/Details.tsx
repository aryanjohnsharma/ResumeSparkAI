import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
    <div
      className={cn(
        "score-pill",
        score > 69
          ? "status-chip status-chip--success"
          : score > 39
            ? "status-chip status-chip--warning"
            : "status-chip status-chip--danger"
      )}
    >
      <span className="size-2 rounded-full bg-current" />
      <p>{score}/100</p>
    </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <p className="panel-title text-[1.45rem]">{title}</p>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="grid w-full gap-3 rounded-[1.35rem] border border-[color:var(--border)] bg-[var(--surface-soft)] px-5 py-4 md:grid-cols-2">
        {tips.map((tip, index) => (
          <div className="flex flex-row gap-3 items-center" key={index}>
            <span
              className={cn(
                "inline-flex size-7 items-center justify-center rounded-full text-sm font-semibold",
                tip.type === "good"
                  ? "bg-[rgba(134,179,143,0.18)] text-[#bde3c4]"
                  : "bg-[rgba(214,162,92,0.18)] text-[#ecc285]"
              )}
              aria-hidden="true"
            >
              {tip.type === "good" ? "+" : "!"}
            </span>
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              {tip.tip}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 w-full">
        {tips.map((tip, index) => (
          <div
            key={index + tip.tip}
            className={cn(
              "flex flex-col gap-3 rounded-[1.35rem] border p-5",
              tip.type === "good"
                ? "border-[rgba(134,179,143,0.25)] bg-[rgba(134,179,143,0.09)] text-[#d5edd9]"
                : "border-[rgba(214,162,92,0.25)] bg-[rgba(214,162,92,0.09)] text-[#f0d09e]"
            )}
          >
            <div className="flex flex-row gap-3 items-center">
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)] text-base font-semibold">
                {tip.type === "good" ? "+" : "!"}
              </span>
              <p className="text-lg font-semibold">{tip.tip}</p>
            </div>
            <p className="text-sm leading-7 text-current/90">{tip.explanation}</p>
          </div>
        ))}
        {tips.length === 0 && (
          <div className="rounded-[1.35rem] border border-dashed border-[color:var(--border)] px-5 py-4 text-sm text-[var(--text-secondary)]">
            No detailed notes were generated for this category.
          </div>
        )}
      </div>
    </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    <section className="surface-card-strong flex flex-col gap-4 w-full p-6 md:p-7">
      <div className="space-y-3">
        <p className="eyebrow">Detailed Notes</p>
        <h2 className="panel-title">Category-by-category feedback</h2>
        <p className="text-sm leading-7 text-[var(--text-secondary)]">
          Open each section to see strengths, weak spots, and practical changes
          you can make before the next application.
        </p>
      </div>

      <Accordion defaultOpen="tone-style" className="space-y-3">
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader
              title="Tone & Style"
              categoryScore={feedback.toneAndStyle.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader
              title="Content"
              categoryScore={feedback.content.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <CategoryHeader
              title="Structure"
              categoryScore={feedback.structure.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader
              title="Skills"
              categoryScore={feedback.skills.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default Details;
