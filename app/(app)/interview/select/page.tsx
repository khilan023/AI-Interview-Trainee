"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Code,
  BarChart3,
  Globe,
  Shield,
  Brain,
  Users,
  ChevronRight,
  Search,
  Sparkles,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mockRoles } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  Code: Code,
  BarChart: BarChart3,
  Globe: Globe,
  Shield: Shield,
  Brain: Brain,
  Users: Users,
};

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

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);
  const [customRole, setCustomRole] = React.useState("");
  const [isCustomDialogOpen, setIsCustomDialogOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter roles based on search
  const filteredRoles = mockRoles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.categories.some((cat) =>
        cat.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleStartInterview = () => {
    if (selectedRole) {
      router.push(`/interview/room?role=${encodeURIComponent(selectedRole)}`);
    }
  };

  const handleCustomRole = () => {
    if (customRole.trim()) {
      setSelectedRole(customRole.trim());
      setIsCustomDialogOpen(false);
      router.push(`/interview/room?role=${encodeURIComponent(customRole.trim())}&custom=true`);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Choose Your Interview Role
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Select the role you want to practice for. Our AI interviewer will
            tailor questions specifically for your chosen position.
          </p>
        </motion.div>

        {/* Search and Custom Role */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center"
        >
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Sparkles className="h-4 w-4" />
                Custom Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enter Custom Role</DialogTitle>
                <DialogDescription>
                  Specify any job role and our AI will generate relevant
                  interview questions for you.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="customRole">Job Title / Role</Label>
                  <Input
                    id="customRole"
                    placeholder="e.g., Product Manager, DevOps Engineer..."
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleCustomRole}
                  disabled={!customRole.trim()}
                >
                  Start Interview
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Role Grid */}
        <motion.div
          variants={containerVariants}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredRoles.map((role, index) => {
            const IconComponent = iconMap[role.icon] || Brain;
            const isSelected = selectedRole === role.name;

            return (
              <motion.div
                key={role.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={cn(
                    "cursor-pointer border-2 transition-all",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                  onClick={() => setSelectedRole(role.name)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-lg",
                          isSelected ? "bg-primary" : "bg-muted"
                        )}
                      >
                        <IconComponent
                          className={cn(
                            "h-6 w-6",
                            isSelected
                              ? "text-primary-foreground"
                              : "text-muted-foreground"
                          )}
                        />
                      </div>
                      {isSelected && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-foreground">
                      {role.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {role.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {role.categories.map((category) => (
                        <Badge
                          key={category}
                          variant="secondary"
                          className="text-xs"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* No results */}
        {filteredRoles.length === 0 && (
          <motion.div variants={itemVariants} className="text-center py-12">
            <p className="text-muted-foreground">
              No roles found matching your search. Try a different term or
              create a custom role.
            </p>
          </motion.div>
        )}

        {/* Start Button */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-4"
        >
          <Button
            size="lg"
            className="gap-2 px-8"
            disabled={!selectedRole}
            onClick={handleStartInterview}
          >
            Start Interview
            <ChevronRight className="h-5 w-5" />
          </Button>

          {selectedRole && (
            <p className="text-sm text-muted-foreground">
              Selected:{" "}
              <span className="font-medium text-foreground">{selectedRole}</span>
            </p>
          )}
        </motion.div>

        {/* Tips */}
        <motion.div variants={itemVariants}>
          <Card className="border-border bg-muted/30">
            <CardHeader>
              <CardTitle className="text-base text-foreground">
                Interview Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  <span>
                    Find a quiet place with good lighting for your webcam
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  <span>
                    Speak clearly and at a moderate pace for best transcription
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  <span>
                    Take your time to think before answering - just like a real
                    interview
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  <span>
                    The AI will ask follow-up questions based on your responses
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
