import { DetailedTranscript } from "@/hooks/speech/useSpeechRecognition";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAudioDuration } from "./hooks/useAudioDuration";

const normalizeTimestamp = (
  transcripts: DetailedTranscript[],
  audioDuration: number
) => {
  const last = transcripts[transcripts.length - 1];
  const endTimestamp = last.startTimestamp + last.duration;
  const startTimestamp = endTimestamp - audioDuration;

  return transcripts.map((transcript) => ({
    ...transcript,
    startTimestamp: transcript.startTimestamp - startTimestamp,
  }));
};

type Props = {
  detailedTranscripts: DetailedTranscript[];
  audioBlobUrl?: string;
};

// TODO: Add audio playback
export const AnimatedTranscript = ({
  detailedTranscripts,
  audioBlobUrl,
}: Props) => {
  const audioDuration = useAudioDuration(audioBlobUrl);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const normalizedTranscripts = useMemo(
    () => normalizeTimestamp(detailedTranscripts, audioDuration),
    [detailedTranscripts, audioDuration]
  );

  const prev = normalizedTranscripts[currentIndex - 1];
  const curr = normalizedTranscripts[currentIndex];
  const next = normalizedTranscripts[currentIndex + 1];

  useEffect(() => {
    if (audioDuration > 0) {
      setIsInitialized(true);
    }
  }, [audioDuration]);

  useEffect(() => {
    if (!isInitialized) return;
    let timeout: ReturnType<typeof setTimeout>;

    if (next) {
      timeout = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, next.startTimestamp - curr.startTimestamp);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [normalizedTranscripts, next, curr, isInitialized]);

  const currentTranscriptWords = curr.transcript.split(" ");

  return (
    <>
      <audio src={audioBlobUrl} autoPlay />
      <AnimatePresence mode="popLayout">
        {Boolean(prev) && (
          <motion.div
            key={currentIndex - 1}
            className="opacity-60"
            initial={{ y: 15 }}
            animate={{ y: 0 }}
            exit={{ y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {prev.transcript}
          </motion.div>
        )}
        <motion.div
          key={currentIndex}
          initial={{ y: 15 }}
          animate={{ y: 0 }}
          exit={{ y: -15 }}
          transition={{ duration: 0.3 }}
        >
          {currentTranscriptWords.map((word, index) => {
            const durationPerWord =
              curr.duration / currentTranscriptWords.length / 1000;

            return (
              <motion.span
                key={index}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: durationPerWord,
                  delay: index * durationPerWord,
                }}
              >
                {word}{" "}
              </motion.span>
            );
          })}
        </motion.div>
        {Boolean(next) && (
          <motion.div
            key={currentIndex + 1}
            className="opacity-60"
            initial={{ y: 15 }}
            animate={{ y: 0 }}
            exit={{ y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {next.transcript}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
