import { DetailedTranscript } from "@/hooks/speech/useSpeechRecognition";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const normalizeTimestamp = (transcripts: DetailedTranscript[]) => {
  const startTimestamp = transcripts[0].startTimestamp;

  return transcripts.map((transcript) => ({
    ...transcript,
    startTimestamp: transcript.startTimestamp - startTimestamp,
  }));
};

type Props = {
  detailedTranscripts: DetailedTranscript[];
};

// TODO: Add audio playback
export const AnimatedTranscript = ({ detailedTranscripts }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const normalizedTranscripts = useMemo(
    () => normalizeTimestamp(detailedTranscripts),
    [detailedTranscripts]
  );

  const prev = normalizedTranscripts[currentIndex - 1];
  const curr = normalizedTranscripts[currentIndex];
  const next = normalizedTranscripts[currentIndex + 1];

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (next) {
      timeout = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, next.duration);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [normalizedTranscripts, next]);

  const currentTranscriptWords = curr.transcript.split(" ");

  return (
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
          const durationPerWord = curr.duration / currentTranscriptWords.length / 1000;

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
              {word}{' '}
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
  );
};
