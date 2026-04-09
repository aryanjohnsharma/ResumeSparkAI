import { useTheme } from "~/lib/theme";
import { cn } from "~/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn("theme-toggle", className)}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {isDarkMode ? (
          <svg viewBox="0 0 24 24" className="size-4 fill-current">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7.1 7.1 0 1 0 9.8 9.8Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="size-4 fill-current">
            <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0-16 1.1 2.7L16 6l-2.9 1.3L12 10 10.9 7.3 8 6l2.9-1.3L12 2Zm8 9 2 1-2 1-1 2-1-2-2-1 2-1 1-2 1 2Zm-16 0 2 1-2 1-1 2-1-2-2-1 2-1 1-2 1 2Zm3.5 7.5 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5.5-1 .5 1Zm9 0 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5.5-1 .5 1Z" />
          </svg>
        )}
      </span>
      <span>{isDarkMode ? "Dark mode" : "Light mode"}</span>
    </button>
  );
};

export default ThemeToggle;
