import { motion } from "framer-motion";
import {
  Bell,
  FolderKanban,
  Home,
  LineChart,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useAuth from "@/services/Store";
import { useNavigate } from "react-router";
import { getCurrUser } from "@/services/AuthService";
import { useState } from "react";
import type User from "@/models/User";
import toast from "react-hot-toast";

const navigationItems = [
  {
    label: "Overview",
    icon: Home,
    active: true,
  },
  {
    label: "Analytics",
    icon: LineChart,
    active: false,
  },
  {
    label: "Customers",
    icon: Users,
    active: false,
  },
  {
    label: "Projects",
    icon: FolderKanban,
    active: false,
  },
  {
    label: "Settings",
    icon: Settings,
    active: false,
  },
];

const projects = [
  {
    name: "Project Alpha",
    status: "Active",
    owner: "Aditi",
    updated: "Today",
  },
  {
    name: "Campaign Nova",
    status: "Active",
    owner: "Rohit",
    updated: "2d ago",
  },
  {
    name: "Archive 2024",
    status: "Archived",
    owner: "Neha",
    updated: "1w ago",
  },
  {
    name: "Website Redesign",
    status: "Active",
    owner: "Arjun",
    updated: "3h ago",
  },
];

const UserHome = () => {
  const user = useAuth((state) => state.user);
  const navigate = useNavigate();
  const [currUser, setCurrUser] = useState<User | null>(null);
  const getUserData = async () => {
    try {
      const currUser = await getCurrUser(user?.email);
      toast.success("Access granted!");
      setCurrUser(currUser);
    } catch (error) {
      console.log(error);
      toast.error("Error occured!");
    }
  };
  return (
    <div className="min-h-[calc(100vh-73px)] bg-background text-foreground">
      {/* ==================== SIDEBAR ==================== */}

      <aside className="fixed bottom-0 left-0 top-18.25 z-40 hidden w-64 border-r border-border/60 bg-card/40 backdrop-blur-xl lg:block">
        {/* Sidebar Header */}
        <div className="flex h-14 items-center gap-2 border-b border-border/60 px-4">
          <span className="inline-block text-center h-6 w-6 rounded-md bg-linear-to-r from-primary to-primary/40"></span>

          <span className="font-semibold">Auth Admin</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 p-3">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.3,
                }}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  item.active
                    ? "bg-muted text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </motion.button>
            );
          })}
        </nav>
      </aside>

      {/* ==================== MAIN CONTENT ==================== */}

      <main className="lg:pl-64">
        {/* Dashboard Toolbar */}
        <div className="flex h-14 items-center justify-end gap-2 border-b border-border/60 px-4 lg:px-6">
          {/* Search */}
          <div className="relative hidden w-full max-w-md sm:block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search..."
              className="h-9 bg-background/50 pl-9"
            />
          </div>

          {/* Notifications */}
          <Button
            variant="outline"
            size="icon"
            className="size-9 cursor-pointer"
          >
            <Bell className="size-4" />
          </Button>

          {/* User */}
          <Button
            onClick={() => {
              navigate("/dashboard/profile");
            }}
            variant="outline"
            className="h-9 cursor-pointer gap-2"
          >
            <img
              src={user?.image}
              onError={(e) => {
                e.currentTarget.src =
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIlA6bJtRIjslWV6Sh-l2BHcvtVEbDbV236R-_ONObVg&s=10";
              }}
              className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary"
            />

            <span className="hidden sm:inline">{user?.name}</span>
          </Button>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Overview
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Quick insights for your project.
              </p>
            </div>

            <Button className="w-fit cursor-pointer" onClick={getUserData}>
              Get current user
            </Button>
            <p>{currUser?.name}</p>
          </motion.div>

          {/* ==================== STAT CARDS ==================== */}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Revenue"
              subtitle="Last 7 days"
              value="$24,120"
              change="▲ 4.2% this week"
              delay={0}
            />

            <StatCard
              title="Orders"
              subtitle="Last 7 days"
              value="1,238"
              change="▲ 1.1%"
              delay={0.1}
            />

            <StatCard
              title="Active Users"
              subtitle="Last 7 days"
              value="8,420"
              change="▼ 0.6%"
              delay={0.2}
            />

            {/* Uptime */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.5,
              }}
            >
              <Card className="h-full border-border/60 bg-card/60 backdrop-blur-xl">
                <CardContent className="p-6">
                  <p className="font-semibold">Uptime</p>

                  <p className="mt-3 text-sm text-muted-foreground">
                    Last 7 days
                  </p>

                  <p className="mt-8 text-3xl font-semibold tracking-tight">
                    99.97%
                  </p>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "99.97%" }}
                      transition={{
                        delay: 0.6,
                        duration: 1,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ==================== PROJECTS ==================== */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.45,
              duration: 0.6,
            }}
            className="mt-6"
          >
            <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-xl">
              {/* Tabs */}
              <div className="flex items-center justify-between border-b border-border/60 p-4">
                <div className="flex items-center gap-1 rounded-lg bg-muted/60 p-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 cursor-pointer"
                  >
                    All
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 cursor-pointer text-muted-foreground"
                  >
                    Active
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 cursor-pointer text-muted-foreground"
                  >
                    Archived
                  </Button>
                </div>

                <span className="text-sm text-muted-foreground">
                  Showing 4 results
                </span>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block">
                <div className="grid grid-cols-[2fr_1fr_1fr_100px] border-b border-border/60 px-4 py-3 text-sm font-medium">
                  <span>Name</span>
                  <span>Status</span>
                  <span>Owner</span>
                  <span className="text-right">Updated</span>
                </div>

                {projects.map((project, index) => (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: 0.55 + index * 0.08,
                    }}
                    className="grid grid-cols-[2fr_1fr_1fr_100px] items-center border-b border-border/50 px-4 py-3 text-sm last:border-b-0 transition-colors hover:bg-muted/30"
                  >
                    <span className="font-medium">{project.name}</span>

                    <span>
                      <StatusBadge status={project.status} />
                    </span>

                    <span>{project.owner}</span>

                    <span className="text-right text-muted-foreground">
                      {project.updated}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Mobile */}
              <div className="divide-y divide-border/50 md:hidden">
                {projects.map((project) => (
                  <div
                    key={project.name}
                    className="flex items-center justify-between p-4"
                  >
                    <div>
                      <p className="font-medium">{project.name}</p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {project.owner} · {project.updated}
                      </p>
                    </div>

                    <StatusBadge status={project.status} />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

/* ==================== STAT CARD ==================== */

interface StatCardProps {
  title: string;
  subtitle: string;
  value: string;
  change: string;
  delay: number;
}

const StatCard = ({ title, subtitle, value, change, delay }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.5,
      }}
      whileHover={{
        y: -3,
        transition: {
          duration: 0.2,
        },
      }}
    >
      <Card className="h-full border-border/60 bg-card/60 backdrop-blur-xl transition-shadow duration-300 hover:shadow-lg">
        <CardContent className="p-6">
          <p className="font-semibold">{title}</p>

          <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>

          <p className="mt-8 text-3xl font-semibold tracking-tight">{value}</p>

          <span className="mt-3 inline-flex rounded-md bg-muted px-2 py-1 text-xs font-medium">
            {change}
          </span>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/* ==================== STATUS BADGE ==================== */

const StatusBadge = ({ status }: { status: string }) => {
  const active = status === "Active";

  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
};

export default UserHome;
