import { Link } from "react-router";
import ThemeToggle from "~/components/ThemeToggle";

const Navbar = () => {
  return (
    <header className="nav-shell">
      <div className="app-container">
        <nav className="nav-bar flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center overflow-hidden rounded-2xl bg-[rgba(201,100,66,0.14)] p-1.5">
              <img
                src="/images/MAIN%20LOGO.png"
                alt="ResumeSparkAI logo"
                className="size-full object-contain"
              />
            </div>
            <div>
              <p className="brand-wordmark">ResumeSparkAI</p>
              <p className="brand-caption">Resume Intelligence</p>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
            <Link to="/upload" className="button-primary">
              Upload Resume
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
