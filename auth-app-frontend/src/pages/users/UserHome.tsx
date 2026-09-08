import { motion } from "framer-motion";
import {
  Activity,
  Bell,
  ChevronRight,
  Home,
  KeyRound,
  LineChart,
  LogIn,
  Search,
  Settings,
  ShieldCheck,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useAuth from "@/services/Store";
import { useNavigate } from "react-router";

const recentActivity = [
  {
    type: "login",
    title: "Successful login",
    description: "Google OAuth authentication",
    time: "Just now",
    icon: LogIn,
  },
  {
    type: "user",
    title: "New user registered",
    description: "Account created successfully",
    time: "12 min ago",
    icon: UserPlus,
  },
  {
    type: "security",
    title: "Password updated",
    description: "Account security settings changed",
    time: "2h ago",
    icon: KeyRound,
  },
  {
    type: "system",
    title: "Authentication service",
    description: "All systems operational",
    time: "5h ago",
    icon: ShieldCheck,
  },
];

const navigationItems = [
  {
    label: "Overview",
    icon: Home,
    active: true,
  },
  {
    label: "Authentication",
    icon: KeyRound,
    active: false,
  },
  {
    label: "Users",
    icon: Users,
    active: false,
  },
  {
    label: "Security",
    icon: ShieldCheck,
    active: false,
  },
  {
    label: "Analytics",
    icon: LineChart,
    active: false,
  },
  {
    label: "Settings",
    icon: Settings,
    active: false,
  },
];

const getInitials = (name?: string) => {
  if (!name?.trim()) return "U";

  return name
    .trim()
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const UserHome = () => {
  const user = useAuth((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-73px)] bg-background text-foreground">
      {/* ==================== SIDEBAR ==================== */}
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border/60 bg-card/40 backdrop-blur-xl lg:block">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center gap-3 border-b border-border/60 px-5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="size-4" />
            </div>

            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">AuthForge</p>

              <p className="text-[11px] text-muted-foreground">Admin Console</p>
            </div>
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

        <main className="min-w-0 flex-1">
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
              onClick={() => navigate("/dashboard/profile")}
              variant="ghost"
              className="h-9 cursor-pointer gap-2 px-2"
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="size-7 rounded-full object-cover ring-1 ring-border"
                />
              ) : (
                <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary ring-1 ring-border">
                  {getInitials(user?.name)}
                </div>
              )}

              <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">
                {user?.name || "User"}
              </span>
            </Button>
          </div>

          {/* Dashboard Content */}
          <div className="p-4 lg:p-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
            >
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary shadow-[0_0_10px] shadow-primary/60" />

                  <span className="text-xs font-medium uppercase tracking-wider text-primary">
                    System Operational
                  </span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome back, {user?.name?.split(" ")[0] || "there"}!
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                  Here's what's happening with your AuthForge system.
                </p>
              </div>

              <Button
                variant="outline"
                className="w-fit cursor-pointer"
                onClick={() => navigate("/dashboard/profile")}
              >
                <Settings className="size-4" />
                Manage Account
              </Button>
            </motion.div>

            {/* ==================== STAT CARDS ==================== */}

            <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Users"
                subtitle="Registered accounts"
                value="8,420"
                change="+4.2% this month"
                icon={Users}
                delay={0}
              />

              <StatCard
                title="Active Sessions"
                subtitle="Currently authenticated"
                value="1,238"
                change="+1.1% today"
                icon={Activity}
                delay={0.1}
              />

              <StatCard
                title="Authentication"
                subtitle="Successful requests"
                value="99.97%"
                change="Healthy"
                icon={ShieldCheck}
                delay={0.2}
              />

              <StatCard
                title="New Users"
                subtitle="Last 7 days"
                value="284"
                change="+12.8%"
                icon={UserPlus}
                delay={0.3}
              />
            </div>

            {/* ==================== PROJECTS ==================== */}

            {/* Recent Activity + Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              {/* Recent Authentication Activity */}
              <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Recent Authentication Activity
                    </CardTitle>
                    <CardDescription>
                      Latest activity across your AuthForge system
                    </CardDescription>
                  </div>

                  <Button variant="ghost" size="sm" className="gap-1">
                    View all
                    <ChevronRight className="size-4" />
                  </Button>
                </CardHeader>

                <CardContent className="space-y-2">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;

                    return (
                      <motion.div
                        key={activity.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="flex items-center gap-4 rounded-xl border border-transparent p-3 transition-colors hover:border-border/60 hover:bg-muted/40"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40">
                          <Icon className="size-4 text-primary" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">
                            {activity.title}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {activity.description}
                          </p>
                        </div>

                        <span className="shrink-0 text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                  <CardDescription>
                    Manage your authentication system
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="h-auto w-full justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                        <Users className="size-4 text-primary" />
                      </div>

                      <div className="text-left">
                        <p className="text-sm font-medium">Manage Users</p>
                        <p className="text-xs text-muted-foreground">
                          View and manage accounts
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto w-full justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                        <ShieldCheck className="size-4 text-primary" />
                      </div>

                      <div className="text-left">
                        <p className="text-sm font-medium">Security</p>
                        <p className="text-xs text-muted-foreground">
                          Review security settings
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto w-full justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                        <KeyRound className="size-4 text-primary" />
                      </div>

                      <div className="text-left">
                        <p className="text-sm font-medium">Authentication</p>
                        <p className="text-xs text-muted-foreground">
                          Configure authentication
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
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
  icon: LucideIcon;
}

const StatCard = ({
  title,
  subtitle,
  value,
  change,
  delay,
  icon: Icon,
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.5,
      }}
      whileHover={{
        y: -4,
        transition: {
          duration: 0.2,
        },
      }}
    >
      <Card className="group h-full overflow-hidden border-border/60 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:shadow-xl">
        <CardContent className="relative p-5">
          <div className="absolute right-4 top-4 size-20 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>

              <p className="mt-1 text-xs text-muted-foreground/70">
                {subtitle}
              </p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-lg border border-border/60 bg-muted/40">
              <Icon className="size-4 text-primary" />
            </div>
          </div>

          <p className="relative mt-7 text-3xl font-bold tracking-tight">
            {value}
          </p>

          <div className="relative mt-3 flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              {change}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserHome;
