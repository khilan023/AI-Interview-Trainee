"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Video, VideoOff, Mic, MicOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserVideoProps {
  className?: string;
  isRecording?: boolean;
}

export function UserVideo({ className, isRecording }: UserVideoProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = React.useState(false);
  const [videoEnabled, setVideoEnabled] = React.useState(true);
  const [audioEnabled, setAudioEnabled] = React.useState(true);
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Initialize webcam
  React.useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        setHasVideo(true);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Could not access camera/microphone");
        setHasVideo(false);
      }
    };

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Toggle video
  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-muted",
        className
      )}
    >
      {/* Video feed */}
      {hasVideo && videoEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted-foreground/10">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
          {error && (
            <p className="mt-4 text-sm text-muted-foreground">{error}</p>
          )}
        </div>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-destructive px-3 py-1"
        >
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="h-2 w-2 rounded-full bg-destructive-foreground"
          />
          <span className="text-xs font-medium text-destructive-foreground">
            Recording
          </span>
        </motion.div>
      )}

      {/* Name tag */}
      <div className="absolute bottom-4 left-4 rounded-md bg-background/80 px-3 py-1.5 backdrop-blur-sm">
        <p className="text-sm font-medium text-foreground">You</p>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <Button
          variant={videoEnabled ? "secondary" : "destructive"}
          size="icon"
          className="h-10 w-10"
          onClick={toggleVideo}
        >
          {videoEnabled ? (
            <Video className="h-5 w-5" />
          ) : (
            <VideoOff className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant={audioEnabled ? "secondary" : "destructive"}
          size="icon"
          className="h-10 w-10"
          onClick={toggleAudio}
        >
          {audioEnabled ? (
            <Mic className="h-5 w-5" />
          ) : (
            <MicOff className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
