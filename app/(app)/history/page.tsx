"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  History,
  Clock,
  Calendar,
  Star,
  Search,
  Filter,
  ChevronRight,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockInterviews } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

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

// Get status badge variant
function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return { variant: "default" as const, label: "Completed" };
    case "in-progress":
      return { variant: "secondary" as const, label: "In Progress" };
    case "cancelled":
      return { variant: "destructive" as const, label: "Cancelled" };
    default:
      return { variant: "outline" as const, label: "Pending" };
  }
}

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

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("date");

  // Get unique roles
  const uniqueRoles = [...new Set(mockInterviews.map((i) => i.role))];

  // Filter and sort interviews
  const filteredInterviews = mockInterviews
    .filter((interview) => {
      const matchesSearch = interview.role
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || interview.role === roleFilter;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.overallRating || 0) - (a.overallRating || 0);
        case "duration":
          return (b.duration || 0) - (a.duration || 0);
        default:
          return (
            new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
          );
      }
    });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">
              Interview History
            </h1>
            <p className="mt-1 text-muted-foreground">
              Review your past interviews and track your progress
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/interview/select">
              <Play className="h-4 w-4" />
              New Interview
            </Link>
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search interviews..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Role filter */}
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {uniqueRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Most Recent</SelectItem>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                    <SelectItem value="duration">Longest Duration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results count */}
        <motion.div variants={itemVariants}>
          <p className="text-sm text-muted-foreground">
            Showing {filteredInterviews.length} interview
            {filteredInterviews.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Interview list */}
        <motion.div variants={containerVariants} className="space-y-4">
          {filteredInterviews.length === 0 ? (
            <motion.div variants={itemVariants}>
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <History className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium text-foreground">
                    No interviews found
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {searchQuery || roleFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Start practicing to see your history here"}
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/interview/select">Start Interview</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            filteredInterviews.map((interview, index) => {
              const status = getStatusBadge(interview.status);
              return (
                <motion.div
                  key={interview.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="border-border bg-card transition-colors hover:border-primary/50">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Left side - Info */}
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                            <History className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">
                                {interview.role}
                              </h3>
                              <Badge variant={status.variant}>
                                {status.label}
                              </Badge>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {formatDate(interview.startedAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {formatDuration(interview.duration || 0)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right side - Rating & Action */}
                        <div className="flex items-center gap-6">
                          {interview.overallRating && (
                            <div className="text-center">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-chart-3" />
                                <span
                                  className={cn(
                                    "text-2xl font-bold",
                                    getRatingColor(interview.overallRating)
                                  )}
                                >
                                  {interview.overallRating.toFixed(1)}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Rating
                              </p>
                            </div>
                          )}
                          <Button variant="outline" asChild>
                            <Link
                              href={`/report/${interview.id}`}
                              className="gap-1"
                            >
                              View Report
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
