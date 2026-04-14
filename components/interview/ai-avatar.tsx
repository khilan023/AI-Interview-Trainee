"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AIAvatarProps {
  isSpeaking: boolean;
  message?: string;
  expression?: "neutral" | "thinking" | "happy" | "concerned";
  className?: string;
  textToSpeak?: string;
  onSpeakingStart?: () => void;
  onSpeakingEnd?: () => void;
}

export function AIAvatar({
  isSpeaking,
  message,
  expression = "neutral",
  className,
  textToSpeak,
  onSpeakingStart,
  onSpeakingEnd,
}: AIAvatarProps) {
  const [isMuted, setIsMuted] = React.useState(false);
  const [isActuallySpeaking, setIsActuallySpeaking] = React.useState(false);
  const speechSynthRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const lastSpokenTextRef = React.useRef<string>("");

  // Text-to-speech effect
  React.useEffect(() => {
    if (!textToSpeak || isMuted || textToSpeak === lastSpokenTextRef.current) {
      return;
    }

    // Cancel any ongoing speech
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    lastSpokenTextRef.current = textToSpeak;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      speechSynthRef.current = utterance;

      // Configure voice settings
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to find a good English voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (voice) =>
          voice.lang.startsWith("en") &&
          (voice.name.includes("Google") ||
            voice.name.includes("Microsoft") ||
            voice.name.includes("Samantha") ||
            voice.name.includes("Daniel"))
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      } else {
        const englishVoice = voices.find((voice) =>
          voice.lang.startsWith("en")
        );
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
      }

      utterance.onstart = () => {
        setIsActuallySpeaking(true);
        onSpeakingStart?.();
      };

      utterance.onend = () => {
        setIsActuallySpeaking(false);
        onSpeakingEnd?.();
      };

      utterance.onerror = () => {
        setIsActuallySpeaking(false);
        onSpeakingEnd?.();
      };

      // Small delay to ensure voices are loaded
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [textToSpeak, isMuted, onSpeakingStart, onSpeakingEnd]);

  // Handle mute toggle
  const handleMuteToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (newMuted && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsActuallySpeaking(false);
    }
  };

  // Load voices on mount (needed for some browsers)
  React.useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Use actual speaking state or passed isSpeaking prop
  const speakingState = isActuallySpeaking || isSpeaking;

  // Animation for speaking indicator
  const speakingVariants = {
    speaking: {
      scale: [1, 1.1, 1],
      transition: {
        repeat: Infinity,
        duration: 0.5,
      },
    },
    silent: {
      scale: 1,
    },
  };

  // Get expression styles
  const getExpressionStyle = () => {
    switch (expression) {
      case "thinking":
        return "from-chart-2/20 to-chart-2/5";
      case "happy":
        return "from-primary/20 to-primary/5";
      case "concerned":
        return "from-chart-3/20 to-chart-3/5";
      default:
        return "from-muted/50 to-muted/20";
    }
  };

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center rounded-xl bg-gradient-to-b p-6",
        getExpressionStyle(),
        className
      )}
    >
      {/* Background office effect */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-chart-2/5 blur-3xl" />
      </div>

      {/* Mute button */}
      <div className="absolute right-4 top-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMuteToggle}
          className="h-8 w-8 bg-background/50 backdrop-blur-sm"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Avatar placeholder */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Avatar head/body */}
        <motion.div
          animate={speakingState ? "speaking" : "silent"}
          variants={{
            speaking: { y: [0, -2, 0] },
            silent: { y: 0 },
          }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="relative"
        >
          {/* Avatar silhouette - placeholder for AI video API */}
          <div className="relative h-48 w-48 overflow-hidden rounded-full bg-gradient-to-b from-muted to-muted/50 shadow-lg">
            {/* Head shape */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-b from-card to-muted" />
            
            {/* Eyes */}
            <div className="absolute left-1/2 top-1/3 flex -translate-x-1/2 gap-8">
              <motion.div
                animate={expression === "thinking" ? { y: -2 } : { y: 0 }}
                className="h-3 w-3 rounded-full bg-foreground/80"
              />
              <motion.div
                animate={expression === "thinking" ? { y: -2 } : { y: 0 }}
                className="h-3 w-3 rounded-full bg-foreground/80"
              />
            </div>

            {/* Mouth */}
            <motion.div
              animate={
                speakingState
                  ? { scaleY: [1, 1.5, 0.8, 1.2, 1], scaleX: [1, 0.9, 1.1, 0.95, 1] }
                  : { scaleY: 1, scaleX: 1 }
              }
              transition={speakingState ? { repeat: Infinity, duration: 0.3 } : {}}
              className={cn(
                "absolute bottom-1/4 left-1/2 -translate-x-1/2 rounded-full bg-foreground/60",
                speakingState ? "h-4 w-8" : "h-2 w-10"
              )}
            />

            {/* Professional attire hint */}
            <div className="absolute -bottom-4 left-1/2 h-20 w-32 -translate-x-1/2 rounded-t-full bg-primary/80" />
          </div>

          {/* Speaking indicator ring */}
          <AnimatePresence>
            {speakingState && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -inset-2"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="h-full w-full rounded-full border-2 border-primary/50"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Name tag */}
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-foreground">AI Interviewer</p>
          <p className="text-sm text-muted-foreground">Interview Assistant</p>
        </div>

        {/* Speaking indicator */}
        <AnimatePresence>
          {speakingState && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 flex items-center gap-1"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: [8, 20, 8] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.5,
                    delay: i * 0.1,
                  }}
                  className="w-1 rounded-full bg-primary"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Current message */}
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-6 left-6 right-6"
          >
            <div className="rounded-lg bg-card/90 p-4 shadow-lg backdrop-blur-sm">
              <p className="text-sm leading-relaxed text-foreground">
                {message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Placeholder notice */}
      <div className="absolute bottom-2 right-2 z-10">
        <p className="text-xs text-muted-foreground/50">
          AI Avatar Placeholder
        </p>
      </div>
    </div>
  );
}
