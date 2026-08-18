// "use client"

// import { useState, useRef, useEffect } from "react"
// import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack } from "lucide-react"
// import { Slider } from "@/components/ui/slider"
// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils"

// interface VideoPlayerProps {
//   src: string
//   poster?: string
//   onProgress?: (progress: { currentTime: number; duration: number }) => void
//   onComplete?: () => void
//   autoPlay?: boolean
//   startTime?: number
// }

// export function VideoPlayer({
//   src,
//   poster,
//   onProgress,
//   onComplete,
//   autoPlay = false,
//   startTime = 0,
// }: VideoPlayerProps) {
//   const videoRef = useRef<HTMLVideoElement>(null)
//   const containerRef = useRef<HTMLDivElement>(null)
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [currentTime, setCurrentTime] = useState(0)
//   const [duration, setDuration] = useState(0)
//   const [volume, setVolume] = useState(1)
//   const [isMuted, setIsMuted] = useState(false)
//   const [isFullscreen, setIsFullscreen] = useState(false)
//   const [showControls, setShowControls] = useState(true)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isControlsVisible, setIsControlsVisible] = useState(true)
//   const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

//   // Initialize video
//   useEffect(() => {
//     const video = videoRef.current
//     if (!video) return

//     const handleLoadedMetadata = () => {
//       setDuration(video.duration)
//       setIsLoading(false)

//       // Set initial time if provided
//       if (startTime > 0 && startTime < video.duration) {
//         video.currentTime = startTime
//         setCurrentTime(startTime)
//       }

//       // Autoplay if enabled
//       if (autoPlay) {
//         video.play().catch(() => {
//           // Autoplay was prevented
//           setIsPlaying(false)
//         })
//       }
//     }

//     const handleTimeUpdate = () => {
//       setCurrentTime(video.currentTime)

//       if (onProgress) {
//         onProgress({
//           currentTime: video.currentTime,
//           duration: video.duration,
//         })
//       }

//       // Check if video is complete
//       if (video.currentTime >= video.duration * 0.95) {
//         if (onComplete) {
//           onComplete()
//         }
//       }
//     }

//     const handleEnded = () => {
//       setIsPlaying(false)
//       if (onComplete) {
//         onComplete()
//       }
//     }

//     video.addEventListener("loadedmetadata", handleLoadedMetadata)
//     video.addEventListener("timeupdate", handleTimeUpdate)
//     video.addEventListener("ended", handleEnded)

//     return () => {
//       video.removeEventListener("loadedmetadata", handleLoadedMetadata)
//       video.removeEventListener("timeupdate", handleTimeUpdate)
//       video.removeEventListener("ended", handleEnded)
//     }
//   }, [src, autoPlay, onProgress, onComplete, startTime])

//   // Handle fullscreen changes
//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       setIsFullscreen(!!document.fullscreenElement)
//     }

//     document.addEventListener("fullscreenchange", handleFullscreenChange)
//     return () => {
//       document.removeEventListener("fullscreenchange", handleFullscreenChange)
//     }
//   }, [])

//   // Auto-hide controls
//   useEffect(() => {
//     if (!isControlsVisible) return

//     const hideControls = () => {
//       setIsControlsVisible(false)
//     }

//     if (controlsTimeoutRef.current) {
//       clearTimeout(controlsTimeoutRef.current)
//     }

//     if (isPlaying) {
//       controlsTimeoutRef.current = setTimeout(hideControls, 3000)
//     }

//     return () => {
//       if (controlsTimeoutRef.current) {
//         clearTimeout(controlsTimeoutRef.current)
//       }
//     }
//   }, [isPlaying, isControlsVisible])

//   const togglePlay = () => {
//     const video = videoRef.current
//     if (!video) return

//     if (isPlaying) {
//       video.pause()
//     } else {
//       video.play().catch(() => {
//         // Play was prevented
//       })
//     }

//     setIsPlaying(!isPlaying)
//   }

//   const toggleMute = () => {
//     const video = videoRef.current
//     if (!video) return

//     video.muted = !isMuted
//     setIsMuted(!isMuted)
//   }

//   const handleVolumeChange = (value: number[]) => {
//     const video = videoRef.current
//     if (!video) return

//     const newVolume = value[0]
//     video.volume = newVolume
//     setVolume(newVolume)

//     if (newVolume === 0) {
//       video.muted = true
//       setIsMuted(true)
//     } else if (isMuted) {
//       video.muted = false
//       setIsMuted(false)
//     }
//   }

//   const handleSeek = (value: number[]) => {
//     const video = videoRef.current
//     if (!video) return

//     const newTime = value[0]
//     video.currentTime = newTime
//     setCurrentTime(newTime)
//   }

//   const toggleFullscreen = () => {
//     const container = containerRef.current
//     if (!container) return

//     if (!isFullscreen) {
//       if (container.requestFullscreen) {
//         container.requestFullscreen()
//       }
//     } else {
//       if (document.exitFullscreen) {
//         document.exitFullscreen()
//       }
//     }
//   }

//   const skipForward = () => {
//     const video = videoRef.current
//     if (!video) return

//     const newTime = Math.min(video.currentTime + 10, video.duration)
//     video.currentTime = newTime
//     setCurrentTime(newTime)
//   }

//   const skipBackward = () => {
//     const video = videoRef.current
//     if (!video) return

//     const newTime = Math.max(video.currentTime - 10, 0)
//     video.currentTime = newTime
//     setCurrentTime(newTime)
//   }

//   const formatTime = (time: number) => {
//     const minutes = Math.floor(time / 60)
//     const seconds = Math.floor(time % 60)
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
//   }

//   return (
//     <div
//       ref={containerRef}
//       className={cn("group relative aspect-video w-full overflow-hidden rounded-lg bg-black", isFullscreen && "h-full")}
//       onMouseMove={() => {
//         setIsControlsVisible(true)
//         if (controlsTimeoutRef.current) {
//           clearTimeout(controlsTimeoutRef.current)
//         }
//         if (isPlaying) {
//           controlsTimeoutRef.current = setTimeout(() => {
//             setIsControlsVisible(false)
//           }, 3000)
//         }
//       }}
//     >
//       {isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
//         </div>
//       )}

//       <video ref={videoRef} src={src} poster={poster} className="h-full w-full" onClick={togglePlay} playsInline />

//       <div
//         className={cn(
//           "absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300",
//           (isControlsVisible || !isPlaying) && "opacity-100",
//         )}
//       >
//         <div className="space-y-2">
//           <Slider
//             value={[currentTime]}
//             min={0}
//             max={duration || 100}
//             step={0.1}
//             onValueChange={handleSeek}
//             className="cursor-pointer"
//           />

//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={togglePlay}>
//                 {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
//               </Button>

//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8 text-white hover:bg-white/20"
//                 onClick={skipBackward}
//               >
//                 <SkipBack className="h-5 w-5" />
//               </Button>

//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8 text-white hover:bg-white/20"
//                 onClick={skipForward}
//               >
//                 <SkipForward className="h-5 w-5" />
//               </Button>

//               <span className="text-sm text-white">
//                 {formatTime(currentTime)} / {formatTime(duration)}
//               </span>
//             </div>

//             <div className="flex items-center space-x-2">
//               <div className="relative flex items-center">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8 text-white hover:bg-white/20"
//                   onClick={toggleMute}
//                 >
//                   {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
//                 </Button>

//                 <div className="hidden w-24 group-hover:block">
//                   <Slider
//                     value={[isMuted ? 0 : volume]}
//                     min={0}
//                     max={1}
//                     step={0.01}
//                     onValueChange={handleVolumeChange}
//                   />
//                 </div>
//               </div>

//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8 text-white hover:bg-white/20"
//                 onClick={toggleFullscreen}
//               >
//                 <Maximize className="h-5 w-5" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipForward,
  SkipBack,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src: string;
  title: string;
  poster?: string;
  onProgress?: (progress: {
    currentTime: number;
    duration: number;
    percent: number;
  }) => void;
  onComplete?: () => void;
  startTime?: number;
  autoplay?: boolean;
  className?: string;
}

export function VideoPlayer({
  src,
  title,
  poster,
  onProgress,
  onComplete,
  startTime = 0,
  autoplay = false,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);

      // Calculate percentage
      const percent = (video.currentTime / video.duration) * 100;

      // Call onProgress callback
      onProgress?.({
        currentTime: video.currentTime,
        duration: video.duration,
        percent,
      });

      // Check if video is complete (within 1 second of the end)
      if (video.duration > 0 && video.currentTime >= video.duration - 1) {
        onComplete?.();
      }
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleLoadedData = () => {
      setIsLoaded(true);
      if (startTime > 0 && startTime < video.duration) {
        video.currentTime = startTime;
      }
      if (autoplay) {
        video.play().catch(() => {
          // Autoplay was prevented
          console.log("Autoplay prevented by browser");
        });
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);
    video.addEventListener("loadeddata", handleLoadedData);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
      video.removeEventListener("loadeddata", handleLoadedData);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [onProgress, onComplete, startTime, autoplay]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0];
    video.volume = newVolume / 100;

    if (newVolume === 0) {
      video.muted = true;
    } else if (video.muted) {
      video.muted = false;
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const seekTime = (value[0] / 100) * duration;
    video.currentTime = seekTime;
  };

  const toggleFullscreen = () => {
    const videoContainer = document.getElementById("video-container");
    if (!videoContainer) return;

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.min(video.currentTime + 10, video.duration);
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(video.currentTime - 10, 0);
  };

  const handleMouseMove = () => {
    setShowControls(true);

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      id="video-container"
      className={cn(
        "group relative overflow-hidden rounded-lg bg-black",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="h-full w-full"
        poster={poster}
        preload="metadata"
        onClick={togglePlay}
        title={title}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Play/Pause overlay button (shown on hover or when paused) */}
      <div
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform opacity-0 transition-opacity",
          (showControls || !isPlaying) && "opacity-100"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-16 w-16 rounded-full bg-black/50 text-white hover:bg-black/70"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="h-8 w-8" />
          ) : (
            <Play className="h-8 w-8" />
          )}
        </Button>
      </div>

      {/* Video controls */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity",
          (showControls || !isPlaying) && "opacity-100"
        )}
      >
        <div className="mb-2">
          <Slider
            value={[isLoaded ? (currentTime / duration) * 100 : 0]}
            max={100}
            step={0.1}
            onValueChange={handleSeek}
            className="h-1"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white"
              onClick={skipBackward}
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white"
              onClick={skipForward}
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            <div className="text-xs text-white">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>

            <div className="w-24">
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="h-1"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white"
              onClick={toggleFullscreen}
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
// 