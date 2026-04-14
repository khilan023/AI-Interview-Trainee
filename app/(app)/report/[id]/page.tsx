"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Download,
  Share2,
  Play,
  ChevronRight,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Loader2,
  MessageSquare,
  User,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  interviewStore,
  type InterviewSessionData,
} from "@/lib/interview-store";
import { interviewApi } from "@/lib/api";
import type { InterviewReport, SkillBreakdown } from "@/lib/types";
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

// Rating color helper
function getRatingColor(rating: number): string {
  if (rating >= 8) return "text-primary";
  if (rating >= 6) return "text-chart-3";
  return "text-destructive";
}

function getRatingBg(rating: number): string {
  if (rating >= 8) return "bg-primary/10";
  if (rating >= 6) return "bg-chart-3/10";
  return "bg-destructive/10";
}

// Skill color helper
function getSkillColor(value: number): string {
  if (value >= 80) return "bg-primary";
  if (value >= 60) return "bg-chart-3";
  return "bg-destructive";
}

// Priority badge helper
function getPriorityBadge(priority: string) {
  switch (priority) {
    case "high":
      return { variant: "destructive" as const, label: "High Priority" };
    case "medium":
      return { variant: "secondary" as const, label: "Medium Priority" };
    default:
      return { variant: "outline" as const, label: "Low Priority" };
  }
}

export default function ReportPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "Software Developer";
  const isPartial = searchParams.get("partial") === "true";

  const [session, setSession] = React.useState<InterviewSessionData | null>(
    null
  );
  const [report, setReport] = React.useState<InterviewReport | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = React.useState(false);

  // Load session data on mount
  React.useEffect(() => {
    const savedSession = interviewStore.getSession();
    setSession(savedSession);

    if (savedSession && savedSession.userResponses.length > 0) {
      // Try to fetch report from backend
      fetchReport(savedSession);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch report from backend API
  const fetchReport = async (sessionData: InterviewSessionData) => {
    setIsGeneratingReport(true);

    try {
      // TODO: Replace with actual API call to your FastAPI backend
      // The backend should analyze the Q&A pairs and generate feedback
      // const response = await interviewApi.getReport(sessionData.id);
      // if (response.data) {
      //   setReport(response.data);
      // }

      // For now, simulate API delay and show that we need backend
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // This is where your FastAPI backend would return real analysis
      // For demonstration, we'll show a placeholder message
      setReport(null);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setIsLoading(false);
      setIsGeneratingReport(false);
    }
  };

  // Calculate duration
  const duration = React.useMemo(() => {
    if (!session?.startedAt || !session?.completedAt) return "N/A";
    const start = new Date(session.startedAt);
    const end = new Date(session.completedAt);
    const diff = Math.floor((end.getTime() - start.getTime()) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}m ${secs}s`;
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading interview data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Back button */}
        <motion.div variants={itemVariants}>
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Interview Report
              </h1>
              {isPartial && <Badge variant="secondary">Partial</Badge>}
            </div>
            <p className="mt-1 text-muted-foreground">
              {role} Interview - {new Date().toLocaleDateString()} - Duration:{" "}
              {duration}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </motion.div>

        {/* Interview Transcript - Your Actual Responses */}
        <motion.div variants={itemVariants}>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <MessageSquare className="h-5 w-5 text-primary" />
                Your Interview Responses
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {session?.userResponses.length || 0} questions answered
              </CardDescription>
            </CardHeader>
            <CardContent>
              {session?.userResponses && session.userResponses.length > 0 ? (
                <div className="space-y-6">
                  {session.userResponses.map((qa, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-border bg-muted/30 p-4"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Question {index + 1}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {qa.question}
                          </p>
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-2/10">
                          <User className="h-4 w-4 text-chart-2" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Your Answer
                          </p>
                          <p
                            className={cn(
                              "text-sm text-foreground",
                              qa.answer === "[Skipped]" &&
                                "italic text-muted-foreground"
                            )}
                          >
                            {qa.answer === "[Skipped]"
                              ? "You skipped this question"
                              : qa.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">
                    No interview responses recorded.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Complete an interview to see your responses here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Feedback Section */}
        <motion.div variants={itemVariants}>
          <Card className="border-border bg-card overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Star className="h-5 w-5 text-chart-3" />
                AI Feedback & Analysis
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Personalized feedback based on your responses
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {isGeneratingReport ? (
                <div className="py-12 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  <p className="mt-4 font-medium text-foreground">
                    Analyzing your responses...
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Our AI is evaluating your answers and generating
                    personalized feedback.
                  </p>
                </div>
              ) : report ? (
                // Show actual report when backend returns it
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div
                    className={cn(
                      "flex flex-col items-center justify-center rounded-lg p-6",
                      getRatingBg(report.overallRating)
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Star
                        className={cn(
                          "h-8 w-8",
                          getRatingColor(report.overallRating)
                        )}
                      />
                      <span
                        className={cn(
                          "text-5xl font-bold",
                          getRatingColor(report.overallRating)
                        )}
                      >
                        {report.overallRating.toFixed(1)}
                      </span>
                    </div>
                    <p className="mt-2 text-lg font-medium text-foreground">
                      out of 10
                    </p>
                  </div>

                  {/* Skills Breakdown */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      {
                        name: "Communication",
                        value: report.skillBreakdown.communication,
                      },
                      {
                        name: "Technical Knowledge",
                        value: report.skillBreakdown.technicalKnowledge,
                      },
                      {
                        name: "Confidence",
                        value: report.skillBreakdown.confidence,
                      },
                      {
                        name: "Problem Solving",
                        value: report.skillBreakdown.problemSolving,
                      },
                    ].map((skill) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground">{skill.name}</span>
                          <span className="font-medium text-muted-foreground">
                            {skill.value}%
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.value}%` }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className={cn(
                              "h-full rounded-full",
                              getSkillColor(skill.value)
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Strengths & Weaknesses */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <h4 className="flex items-center gap-2 font-semibold text-foreground mb-3">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Strengths
                      </h4>
                      <ul className="space-y-2">
                        {report.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                            <span className="text-foreground">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 font-semibold text-foreground mb-3">
                        <TrendingDown className="h-4 w-4 text-chart-3" />
                        Areas to Improve
                      </h4>
                      <ul className="space-y-2">
                        {report.weaknesses.map((w, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <div className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full border-2 border-chart-3" />
                            <span className="text-foreground">{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                // Backend integration required message
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-chart-3/10">
                    <AlertTriangle className="h-8 w-8 text-chart-3" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Backend Integration Required
                  </h3>
                  <p className="mt-2 max-w-md mx-auto text-sm text-muted-foreground">
                    To generate AI feedback based on your actual responses, connect
                    your FastAPI backend. The backend should analyze the Q&A pairs
                    and return scores, strengths, weaknesses, and recommendations.
                  </p>
                  <div className="mt-6 rounded-lg bg-muted p-4 text-left max-w-lg mx-auto">
                    <p className="text-xs font-mono text-muted-foreground mb-2">
                      Required API endpoint:
                    </p>
                    <code className="text-xs text-primary">
                      POST /api/v1/interviews/{"{id}"}/report
                    </code>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Request body should include the Q&A pairs from session storage.
                      Response should match the InterviewReport type.
                    </p>
                  </div>
                  <div className="mt-6 flex justify-center gap-3">
                    <Button variant="outline" asChild>
                      <Link href="/interview/select">Practice Again</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div variants={itemVariants}>
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
              <div>
                <h3 className="font-semibold text-foreground">
                  Ready for another round?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Practice makes perfect. Try another interview to improve your
                  skills.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/history">View History</Link>
                </Button>
                <Button asChild className="gap-2">
                  <Link href="/interview/select">
                    <Play className="h-4 w-4" />
                    New Interview
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
