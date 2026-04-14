"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Play,
  History,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
  Target,
  Award,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import { mockInterviews } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Format date helper
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Format duration helper
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
}

// Get rating color
function getRatingColor(rating: number): string {
  if (rating >= 8) return "text-primary";
  if (rating >= 6) return "text-chart-3";
  return "text-destructive";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const interviews = mockInterviews;

  // Calculate stats
  const totalInterviews = interviews.length;
  const averageRating =
    interviews.reduce((acc, i) => acc + (i.overallRating || 0), 0) / totalInterviews || 0;
  const totalTime = interviews.reduce((acc, i) => acc + (i.duration || 0), 0);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">
              {getGreeting()}, {user?.name?.split(" ")[0] || "there"}!
            </h1>
            <p className="mt-1 text-muted-foreground">
              Ready to ace your next interview? Let's practice!
            </p>
          </div>
          <Button asChild size="lg" className="gap-2">
            <Link href="/interview/select">
              <Play className="h-5 w-5" />
              Start New Interview
            </Link>
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Interviews</p>
                <p className="text-2xl font-bold text-foreground">{totalInterviews}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                <Star className="h-6 w-6 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold text-foreground">{averageRating.toFixed(1)}/10</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                <Clock className="h-6 w-6 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Practice Time</p>
                <p className="text-2xl font-bold text-foreground">{Math.floor(totalTime / 60)} min</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                <TrendingUp className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Improvement</p>
                <p className="text-2xl font-bold text-foreground">+15%</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Interviews */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Recent Interviews</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Your latest practice sessions
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/history" className="gap-1">
                    View all
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interviews.slice(0, 3).map((interview, index) => (
                    <motion.div
                      key={interview.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <History className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{interview.role}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(interview.startedAt)}
                            <span className="text-border">|</span>
                            <Clock className="h-3 w-3" />
                            {formatDuration(interview.duration || 0)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={cn("text-lg font-bold", getRatingColor(interview.overallRating || 0))}>
                            {interview.overallRating?.toFixed(1)}
                          </p>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/report/${interview.id}`}>View Report</Link>
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills Overview */}
          <motion.div variants={itemVariants}>
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Award className="h-5 w-5" />
                  Skills Overview
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Based on your recent interviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Communication", value: 78, color: "bg-primary" },
                    { name: "Technical Knowledge", value: 82, color: "bg-chart-2" },
                    { name: "Confidence", value: 70, color: "bg-chart-3" },
                    { name: "Problem Solving", value: 85, color: "bg-chart-4" },
                  ].map((skill, index) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{skill.name}</span>
                        <span className="font-medium text-muted-foreground">{skill.value}%</span>
                      </div>
                      <Progress value={skill.value} className="h-2" />
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
                  <p className="text-sm font-medium text-foreground">Top Recommendation</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Focus on improving your confidence during technical discussions.
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    High Priority
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
              <CardDescription className="text-muted-foreground">
                Jump into practice or review your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: "Technical Interview",
                    description: "Practice coding questions",
                    href: "/interview/select?role=software-developer",
                    icon: Target,
                  },
                  {
                    title: "HR Interview",
                    description: "Behavioral questions",
                    href: "/interview/select?role=hr-practice",
                    icon: History,
                  },
                  {
                    title: "View Reports",
                    description: "Review past feedback",
                    href: "/history",
                    icon: TrendingUp,
                  },
                  {
                    title: "Update Profile",
                    description: "Manage your settings",
                    href: "/profile",
                    icon: Award,
                  },
                ].map((action) => (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="group rounded-lg border border-border bg-background/50 p-4 transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    <action.icon className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary" />
                    <h3 className="mt-3 font-medium text-foreground">{action.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
