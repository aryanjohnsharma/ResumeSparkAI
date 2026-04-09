import { useEffect, useState } from "react";

const REPO_URL = "https://github.com/aryanjohnsharma/ResumeSparkAI";
const PUTER_DOCS_URL = "https://docs.puter.com/";
const GITHUB_PROFILE_URL = "https://github.com/aryanjohnsharma";
const X_PROFILE_URL = "https://x.com/aryanjohnsharma";
const EMAIL_ADDRESS = "aryanjohnsharma@gmail.com";

const stackItems = [
  { label: "Built with", value: "Puter.js", href: PUTER_DOCS_URL },
  { label: "Styled with", value: "Tailwind CSS", href: "https://tailwindcss.com/" },
  { label: "Deployed on", value: "React Router + Vite", href: "https://reactrouter.com/" },
];

const Footer = () => {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (copyState === "idle") return;

    const timeout = window.setTimeout(() => setCopyState("idle"), 1800);
    return () => window.clearTimeout(timeout);
  }, [copyState]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  };

  return (
    <footer className="footer-shell">
      <div className="app-container">
        <div className="footer-bar">
          <div className="footer-row">
            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Created and designed by Aryan Sharma &copy; 2026
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-[var(--text-secondary)]">
                <a
                  href={PUTER_DOCS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-copy-button"
                >
                  <PuterIcon className="size-4" />
                  How it&apos;s made with Puter.js
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="footer-copy-button"
                >
                  <MailIcon className="size-4" />
                  {copyState === "copied"
                    ? "Email copied"
                    : copyState === "error"
                      ? "Copy failed"
                      : "Copy Email"}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="button-secondary"
              >
                <GitHubIcon className="size-4" />
                Repo
              </a>
              <a
                href={`${REPO_URL}/stargazers`}
                target="_blank"
                rel="noopener noreferrer"
                className="button-primary"
              >
                <StarIcon className="size-4" />
                Star on GitHub
              </a>
            </div>
          </div>

          <div className="footer-stack-row">
            <div className="footer-stack-items">
              {stackItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-stack-chip"
                >
                  <span className="footer-stack-label">{item.label}</span>
                  <span className="footer-stack-value">{item.value}</span>
                </a>
              ))}
            </div>

            <div className="footer-social-items">
              <a
                href={GITHUB_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-icon-link"
                aria-label="GitHub"
                title="GitHub"
              >
                <GitHubIcon className="size-4" />
              </a>
              <a
                href={X_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-icon-link"
                aria-label="X"
                title="X"
              >
                <TwitterXIcon className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-marquee" aria-hidden="true">
          <div className="footer-marquee-track">
            <div className="footer-marquee-group">
              <span>ResumeSparkAI <em className="footer-marquee-separator">✦</em></span>
              <span>ResumeSparkAI <em className="footer-marquee-separator">✦</em></span>
              <span>ResumeSparkAI <em className="footer-marquee-separator">✦</em></span>
              <span>ResumeSparkAI <em className="footer-marquee-separator">✦</em></span>
              <span>ResumeSparkAI <em className="footer-marquee-separator">✦</em></span>
            </div>
            <div className="footer-marquee-group">
              <span>ResumeSparkAI <em className="footer-marquee-separator">✦</em></span>
              <span>ResumeSparkAI <em className="footer-marquee-separator">✦</em></span>
              <span>ResumeSparkAI <em className="footer-marquee-separator">✦</em></span>
              <span>ResumeSparkAI <em className="footer-marquee-separator">✦</em></span>
              <span>ResumeSparkAI <em className="footer-marquee-separator">✦</em></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

function iconProps(className?: string) {
  return {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M9 19c-4.5 1.5-4.5-2.5-6-3" />
      <path d="M15 22v-3.9a3.4 3.4 0 0 0-.9-2.6c3 0 6-1.8 6-6a4.7 4.7 0 0 0-1.3-3.2 4.4 4.4 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.8 11.8 0 0 0-6.6 0C6.3 3 5.3 3.3 5.3 3.3a4.4 4.4 0 0 0-.1 3.2A4.7 4.7 0 0 0 4 9.7c0 4.2 3 6 6 6a3.4 3.4 0 0 0-.9 2.6V22" />
    </svg>
  );
}

function TwitterXIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9.294 6.928 14.357 1h-1.2L8.761 6.147 5.251 1H1.2l5.31 7.787L1.2 15h1.2l4.643-5.443L10.75 15H14.8L9.294 6.928Zm-1.64 1.922-.538-.774L2.84 1.93h1.844l3.45 4.968.538.774 4.486 6.456h-1.844L7.654 8.85Z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function PuterIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="m12 3 2.8 5.6 6.2.9-4.5 4.4 1 6.1L12 17l-5.5 3 1-6.1L3 9.5l6.2-.9L12 3Z" />
    </svg>
  );
}

export default Footer;
