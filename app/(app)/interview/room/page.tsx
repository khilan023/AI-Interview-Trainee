"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AIAvatar } from "@/components/interview/ai-avatar";
import { UserVideo } from "@/components/interview/user-video";
import { InterviewControls } from "@/components/interview/interview-controls";
import { mockQuestions } from "@/lib/mock-data";
import { interviewStore } from "@/lib/interview-store";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { cn } from "@/lib/utils";

// Interview phases
type InterviewPhase =
  | "intro"
  | "technical"
  | "behavioral"
  | "scenario"
  | "hr"
  | "closing";

interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
}

export default function InterviewRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "Software Developer";

  // Interview state
  const [isStarted, setIsStarted] = React.useState(false);
  const [showEndDialog, setShowEndDialog] = React.useState(false);
  const [currentPhase, setCurrentPhase] =
    React.useState<InterviewPhase>("intro");
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [showTranscript, setShowTranscript] = React.useState(true);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = React.useState("");
  const [userTranscript, setUserTranscript] = React.useState("");
  const [textToSpeak, setTextToSpeak] = React.useState("");
  const [currentQuestionForAnswer, setCurrentQuestionForAnswer] =
    React.useState("");

  // Speech recognition hook for capturing user's verbal responses
  const {
    isListening,
    transcript: liveTranscript,
    finalTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: isSpeechSupported,
  } = useSpeechRecognition({
    onResult: (text, isFinal) => {
      setUserTranscript(text);
    },
    onError: (error) => {
      console.error("Speech recognition error:", error);
    },
  });

  // Initialize session on mount
  React.useEffect(() => {
    interviewStore.createSession(role);
  }, [role]);

  // Get questions for role
  const questions = React.useMemo(() => {
    const roleKey = role.toLowerCase().replace(/\s+/g, "-");
    return mockQuestions[roleKey] || mockQuestions["software-developer"];
  }, [role]);

  // Timer
  React.useEffect(() => {
    if (!isStarted) return;
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isStarted]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Add message to transcript and store
  const addMessage = (
    msgRole: "ai" | "user",
    content: string,
    qIndex?: number
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        role: msgRole,
        content,
        timestamp: new Date(),
      },
    ]);
    // Also save to interview store for report
    interviewStore.addMessage({ role: msgRole, content, questionIndex: qIndex });
  };

  // Speak text using TTS
  const speakText = React.useCallback((text: string) => {
    setTextToSpeak(text);
  }, []);

  // Callbacks for AI avatar speaking
  const handleSpeakingStart = React.useCallback(() => {
    setIsSpeaking(true);
  }, []);

  const handleSpeakingEnd = React.useCallback(() => {
    setIsSpeaking(false);
  }, []);

  // Start interview
  const startInterview = () => {
    setIsStarted(true);
    const introMessage = `Hello! Welcome to your ${role} interview. I'm your AI interviewer today. I'll be asking you a series of questions to assess your skills and experience. Feel free to take your time with each answer. Let's begin! ${questions[0]}`;
    setCurrentQuestion(questions[0]);
    setCurrentQuestionForAnswer(questions[0]);
    addMessage("ai", introMessage, 0);
    speakText(introMessage);
  };

  // Handle recording toggle
  const handleToggleRecording = () => {
    if (isRecording) {
      // Stop recording and speech recognition
      setIsRecording(false);
      stopListening();
      setIsProcessing(true);

      // Give a moment for final transcript to settle
      setTimeout(() => {
        // Use the captured transcript from Web Speech API
        // This is the user's ACTUAL verbal response
        const userResponse =
          userTranscript.trim() ||
          finalTranscript.trim() ||
          "[No speech detected - please ensure microphone is enabled]";

        addMessage("user", userResponse, questionIndex);

        // Save Q&A pair to store for report
        interviewStore.addQAPair(currentQuestionForAnswer, userResponse);

        // Reset transcript for next question
        resetTranscript();
        setUserTranscript("");

        // Generate next question
        setTimeout(() => {
          setIsProcessing(false);
          const nextIndex = questionIndex + 1;

          if (nextIndex < questions.length) {
            const aiResponse = `Thank you for that response. ${questions[nextIndex]}`;
            setQuestionIndex(nextIndex);
            setCurrentQuestion(questions[nextIndex]);
            setCurrentQuestionForAnswer(questions[nextIndex]);
            addMessage("ai", aiResponse, nextIndex);
            speakText(aiResponse);
          } else {
            // End interview - save session and go to report
            interviewStore.completeSession(false);
            const closingMessage =
              "Thank you for your responses. That concludes our interview. You've done well! Let me prepare your detailed feedback report.";
            addMessage("ai", closingMessage);
            speakText(closingMessage);
            setCurrentPhase("closing");
            setTimeout(() => {
              const session = interviewStore.getSession();
              router.push(
                `/report/${session?.id || "interview"}?role=${encodeURIComponent(role)}`
              );
            }, 5000);
          }
        }, 2000);
      }, 500);
    } else {
      // Start recording and speech recognition
      setIsRecording(true);
      setUserTranscript("");
      resetTranscript();

      // Start Web Speech API for real-time transcription
      if (isSpeechSupported) {
        startListening();
      }
    }
  };

  // Handle end interview
  const handleEndInterview = () => {
    setShowEndDialog(true);
  };

  const confirmEndInterview = () => {
    setShowEndDialog(false);
    interviewStore.completeSession(true);
    const closingMessage =
      "I understand you'd like to end the interview early. Thank you for your time. Let me generate your feedback report based on your responses so far.";
    addMessage("ai", closingMessage);
    speakText(closingMessage);
    setTimeout(() => {
      const session = interviewStore.getSession();
      router.push(
        `/report/${session?.id || "interview"}?role=${encodeURIComponent(role)}&partial=true`
      );
    }, 3000);
  };

  // Handle skip question
  const handleSkipQuestion = () => {
    // Save that this question was skipped
    interviewStore.addQAPair(currentQuestionForAnswer, "[Skipped]");

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const nextIndex = questionIndex + 1;
      if (nextIndex < questions.length) {
        const aiResponse = `No problem, let's move on. ${questions[nextIndex]}`;
        setQuestionIndex(nextIndex);
        setCurrentQuestion(questions[nextIndex]);
        setCurrentQuestionForAnswer(questions[nextIndex]);
        addMessage("ai", aiResponse, nextIndex);
        speakText(aiResponse);
      }
    }, 1000);
  };

  // Handle hint request
  const handleRequestHint = () => {
    const hints = [
      "Consider breaking down your answer into specific examples from your experience.",
      "Think about the STAR method: Situation, Task, Action, Result.",
      "Focus on quantifiable achievements when possible.",
    ];
    const hint = hints[Math.floor(Math.random() * hints.length)];
    const hintMessage = `Hint: ${hint}`;
    addMessage("ai", hintMessage);
    speakText(hintMessage);
  };

  // Progress percentage
  const progress = (questionIndex / questions.length) * 100;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(elapsedTime)}
          </Badge>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">
              {role} Interview
            </p>
            <p className="text-xs text-muted-foreground">
              Question {questionIndex + 1} of {questions.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden w-32 sm:block">
            <Progress value={progress} className="h-2" />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTranscript(!showTranscript)}
            className="gap-1"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Transcript</span>
            {showTranscript ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Video area */}
        <div className="flex flex-1 flex-col gap-4 p-4 lg:flex-row">
          {/* User video */}
          <div className="min-h-[200px] flex-1 lg:min-h-0">
            <UserVideo isRecording={isRecording} className="h-full" />
          </div>

          {/* AI Avatar */}
          <div className="min-h-[200px] flex-1 lg:min-h-0">
            <AIAvatar
              isSpeaking={isSpeaking}
              message={isStarted ? currentQuestion : undefined}
              expression={
                isSpeaking ? "neutral" : isProcessing ? "thinking" : "neutral"
              }
              textToSpeak={textToSpeak}
              onSpeakingStart={handleSpeakingStart}
              onSpeakingEnd={handleSpeakingEnd}
              className="h-full"
            />
          </div>
        </div>

        {/* Transcript sidebar */}
        <AnimatePresence>
          {showTranscript && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden overflow-hidden border-l border-border lg:block"
            >
              <div className="flex h-full w-80 flex-col">
                <div className="border-b border-border p-4">
                  <h3 className="font-semibold text-foreground">Conversation</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "rounded-lg p-3",
                          message.role === "ai"
                            ? "bg-muted"
                            : "ml-4 bg-primary/10"
                        )}
                      >
                        <p className="mb-1 text-xs font-medium text-muted-foreground">
                          {message.role === "ai" ? "AI Interviewer" : "You"}
                        </p>
                        <p className="text-sm text-foreground">
                          {message.content}
                        </p>
                      </div>
                    ))}
                    {isRecording && (
                      <div className="ml-4 rounded-lg bg-primary/10 p-3 border-2 border-primary/30">
                        <p className="mb-1 text-xs font-medium text-primary flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                          </span>
                          Listening... (speak now)
                        </p>
                        <p className="text-sm text-foreground min-h-[20px]">
                          {userTranscript || liveTranscript || (
                            <span className="text-muted-foreground italic">
                              Your speech will appear here...
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="border-t border-border p-4">
        {!isStarted ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-muted-foreground">
              Ready to begin your {role} interview?
            </p>
            <Button size="lg" onClick={startInterview}>
              Start Interview
            </Button>
          </div>
        ) : (
          <div className="relative flex justify-center">
            <InterviewControls
              isRecording={isRecording}
              isProcessing={isProcessing || isSpeaking}
              canSkip={!isRecording && questionIndex < questions.length - 1}
              onToggleRecording={handleToggleRecording}
              onEndInterview={handleEndInterview}
              onSkipQuestion={handleSkipQuestion}
              onRequestHint={handleRequestHint}
            />
          </div>
        )}
      </div>

      {/* End interview dialog */}
      <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              End Interview Early?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ve answered {questionIndex} of {questions.length}{" "}
              questions. Ending now will generate a partial report based on your
              responses so far.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Interview</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmEndInterview}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              End Interview
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
