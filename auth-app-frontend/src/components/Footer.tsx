import { FiMail } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="inline-block size-6 rounded-md bg-linear-to-r from-primary to-primary/40" />
              <span>AuthForge</span>
            </div>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              A production-oriented authentication and authorization platform
              built with modern full-stack technologies.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/armaanmulani"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <FaGithub className="size-4" />
            </a>

            <a
              href="https://www.linkedin.com/in/armaanmulani/"
              className="flex size-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <FaLinkedin className="size-4" />
            </a>

            <a
              href="mailto:armaan.mulani@outlook.com"
              className="flex size-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <FiMail className="size-4" />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AuthForge. All rights reserved.</p>

          <p>
            Built by{" "}
            <span className="font-medium text-foreground">Armaan Mulani</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
