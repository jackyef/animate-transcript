import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAudioDuration } from "./hooks/useAudioDuration";
import { useRefs } from "./hooks/useRefs";

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
};

type Props = {
  alignedTranscript: AlignedTranscript;
  audioBlobUrl?: string | null;
};

export const BetterPlayer = ({
  alignedTranscript,
  audioBlobUrl = "",
}: Props) => {
  const { words } = alignedTranscript;
  const containerRef = useRef<HTMLDivElement>(null);
  const refs = useRefs(words.length);
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
      <div
        ref={containerRef}
        className={clsx(
          "w-full max-w-lg mx-auto my-8 leading-7",
          "h-[22rem] overflow-y-hidden"
        )}
      >
        {words.map((word, index) => {
          if (word.case === "not-found-in-audio") return null;

          return (
            <motion.div
              ref={refs[index]}
              key={`${word.word}-${index}`}
              className={clsx(
                "inline-block mr-[4px] px-2 py-3 my-1 rounded-lg",
                "text-6xl font-bold"
              )}
              animate={{
                background: ["#ffffff", "#000000", "#000000", "#ffffff"],
                color: ["#000000", "#ffffff", "#ffffff", "#000000"],
                opacity: [0.5, 1, 1, 1],
              }}
              onAnimationComplete={() => {
                // Scroll the next word into view if needed.
                const nextWord = refs[index + 1]
                  ?.current as unknown as HTMLDivElement;

                if (nextWord && containerRef.current) {
                  const baseY = nextWord.offsetTop;
                  const activeElementHeight = nextWord.offsetHeight;

                  if (
                    baseY + activeElementHeight >
                    containerRef.current.scrollTop + containerRef.current.offsetHeight
                  ) {
                    containerRef.current.scrollTo({
                      top: baseY - 50 - activeElementHeight,
                      behavior: "smooth",
                    });
                  }
                }
              }}
              transition={{
                type: ["spring", "spring", "spring", "spring"],
                bounce: [1.5, 1.5, 1.5, 1.5],
                duration: 0.25 + (word.end - word.start),
                times: [0, 0.1, 0.85, 1],
                delay: word.start,
              }}
            >
              {word.word}
            </motion.div>
          );
        })}
      </div>
    </>
  );
};
