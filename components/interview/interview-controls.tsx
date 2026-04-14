"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Phone,
  SkipForward,
  HelpCircle,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface InterviewControlsProps {
  isRecording: boolean;
  isProcessing: boolean;
  canSkip: boolean;
  onToggleRecording: () => void;
  onEndInterview: () => void;
  onSkipQuestion: () => void;
  onRequestHint: () => void;
}

export function InterviewControls({
  isRecording,
  isProcessing,
  canSkip,
  onToggleRecording,
  onEndInterview,
  onSkipQuestion,
  onRequestHint,
}: InterviewControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <TooltipProvider>
        {/* Hint button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 bg-transparent"
              onClick={onRequestHint}
              disabled={isProcessing}
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Get a hint</p>
          </TooltipContent>
        </Tooltip>

        {/* Skip button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 bg-transparent"
              onClick={onSkipQuestion}
              disabled={!canSkip || isProcessing}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Skip question</p>
          </TooltipContent>
        </Tooltip>

        {/* Main recording button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="icon"
            className={cn(
              "h-16 w-16 rounded-full",
              isRecording
                ? "bg-destructive hover:bg-destructive/90"
                : "bg-primary hover:bg-primary/90"
            )}
            onClick={onToggleRecording}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="h-7 w-7 animate-spin text-primary-foreground" />
            ) : isRecording ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <MicOff className="h-7 w-7 text-destructive-foreground" />
              </motion.div>
            ) : (
              <Mic className="h-7 w-7 text-primary-foreground" />
            )}
          </Button>
        </motion.div>

        {/* End interview button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="h-12 w-12"
              onClick={onEndInterview}
            >
              <Phone className="h-5 w-5 rotate-[135deg]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>End interview</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Recording status text */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-0 flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2"
          >
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="h-2 w-2 rounded-full bg-destructive"
            />
            <span className="text-sm font-medium text-destructive">
              Listening...
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
