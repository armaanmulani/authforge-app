import { motion } from "framer-motion";
import {
  ArrowRight,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Link } from "react-router";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const technologies = [
  "Spring Boot",
  "Spring Security",
  "React",
  "TypeScript",
  "MySQL",
  "JWT",
  "OAuth 2.0",
  "Cloudflare R2",
];

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Authentication",
    description:
      "JWT-based authentication with access and refresh tokens designed for secure session management.",
  },
  {
    icon: LockKeyhole,
    title: "Authorization & RBAC",
    description:
      "Role-based access control makes it possible to protect resources according to user permissions.",
  },
  {
    icon: KeyRound,
    title: "OAuth 2.0",
    description:
      "Sign in using trusted identity providers such as Google and GitHub.",
  },
  {
    icon: UserRound,
    title: "User Management",
    description:
      "Manage profiles, passwords, account security, roles, and profile images from one platform.",
  },
];

function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute left-1/2 top-0 -z-10 size-125 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div className="mx-auto max-w-6xl px-6 py-24 text-center md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl border border-border/60 bg-muted/40 shadow-lg">
              <ShieldCheck className="size-7 text-primary" />
            </div>

            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary">
              About AuthForge
            </p>

            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
              Authentication built with{" "}
              <span className="text-primary">security in mind.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              AuthForge is a production-oriented full-stack authentication and
              authorization platform built to provide a secure, reusable, and
              modern foundation for applications that need user identity and
              access management.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/signup">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="size-4" />
                </Button>
              </Link>

              <a
                href="https://github.com/armaanmulani/authforge-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="gap-2">
                  <FaGithub className="size-4" />
                  View on GitHub
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is AuthForge */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              The Project
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              More than just a login system.
            </h2>

            <p className="mt-5 leading-7 text-muted-foreground">
              AuthForge was designed as a reusable authentication platform
              rather than a simple login and registration implementation. It
              brings authentication, authorization, account management, OAuth,
              password recovery, and security controls together in one system.
            </p>

            <p className="mt-4 leading-7 text-muted-foreground">
              The goal is to provide a solid foundation that can be integrated
              into applications without rebuilding authentication from scratch
              every time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card
                  key={feature.title}
                  className="border-border/60 bg-card/60 backdrop-blur-xl"
                >
                  <CardContent className="p-5">
                    <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>

                    <h3 className="font-semibold">{feature.title}</h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Technology Stack
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Built with modern technologies
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              AuthForge combines a secure Spring backend with a modern React
              frontend and cloud-based infrastructure.
            </p>
          </div>

          <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
            {technologies.map((technology) => (
              <div
                key={technology}
                className="rounded-lg border border-border/60 bg-card/60 px-4 py-2.5 text-sm font-medium backdrop-blur transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                {technology}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl">
          <div className="grid md:grid-cols-[1fr_320px]">
            <div className="p-8 md:p-12">
              <p className="text-sm font-medium uppercase tracking-wider text-primary">
                The Developer
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Built by Armaan Mulani
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
                AuthForge is a full-stack project focused on applying real
                production concepts to authentication and authorization,
                including secure token handling, OAuth 2.0, role-based access
                control, password recovery, email verification, cloud storage,
                and deployment.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="https://github.com/armaanmulani" target="_blank">
                  <Button variant="outline" className="gap-2 cursor-pointer">
                    <FaGithub className="size-4" />
                    GitHub
                  </Button>
                </a>

                <a
                  href="https://www.linkedin.com/in/armaanmulani/"
                  target="_blank"
                >
                  <Button variant="outline" className={"cursor-pointer"}>
                    LinkedIn
                  </Button>
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center border-t border-border/60 bg-muted/20 p-8 md:border-l md:border-t-0">
              <a href="https://armaanmulani.netlify.app" target="_blank">
                <div className="text-center">
                  <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary/40 text-2xl font-bold text-primary-foreground shadow-xl">
                    AM
                  </div>

                  <p className="mt-4 font-semibold">Armaan Mulani</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Full-Stack Developer
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to forge your authentication?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Explore AuthForge, create an account, and experience the platform
            yourself.
          </p>

          <div className="mt-7">
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Create an Account
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
