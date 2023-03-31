import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAudioDuration } from "./hooks/useAudioDuration";

type Word = {
  alignedWord: string;
  case: string;
  end: number;
  endOffset: number;
  start: number;
  startOffset: number;
  word: string;
};

export type AlignedTranscript = {
  transcript: string;
  words: Word[];
}

type Props = {
  alignedTranscript: AlignedTranscript;
  audioBlobUrl?: string | null;
};

export const BetterPlayer = ({
  alignedTranscript,
  audioBlobUrl = "",
}: Props) => {
  const { words } = alignedTranscript;
  const audioDuration = useAudioDuration(audioBlobUrl);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (audioDuration > 0) {
      setIsInitialized(true);
    }
  }, [audioDuration]);

  if (!isInitialized) return null;

  return (
    <>
      <audio src={audioBlobUrl ?? ""} autoPlay controls />
      <motion.div layout className={clsx("w-full max-w-lg mx-auto my-8")}>
        <AnimatePresence mode="popLayout">
          {words.map((word, index) => {
            return (
              <motion.div
                key={`${word.word}-${index}`}
                className="inline-block mr-1 px-2 py-1 rounded-lg"
                animate={{
                  background: ["#ffffff", "#000000", "#ffffff"],
                  color: ["#000000", "#ffffff", "#000000"],
                  opacity: [0.5, 1, 1],
                }}
                transition={{
                  type: ["spring", "spring", "spring"],
                  bounce: [1.5, 1.5, 1.5],
                  duration: 2 * (word.end - word.start),
                  delay: word.start,
                }}
              >
                {word.word}
              </motion.div>
            );
          })}
    
        </AnimatePresence>
      </motion.div>
    </>
  );
};
