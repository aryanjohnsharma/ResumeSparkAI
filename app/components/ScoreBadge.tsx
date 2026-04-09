interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let badgeClass = "";
  let badgeText = "";

  if (score > 70) {
    badgeClass = "status-chip status-chip--success";
    badgeText = "Strong";
  } else if (score > 49) {
    badgeClass = "status-chip status-chip--warning";
    badgeText = "Good Start";
  } else {
    badgeClass = "status-chip status-chip--danger";
    badgeText = "Needs Work";
  }

  return (
    <div className={badgeClass}>
      <span className="size-2 rounded-full bg-current" />
      <p>{badgeText}</p>
    </div>
  );
};

export default ScoreBadge;
