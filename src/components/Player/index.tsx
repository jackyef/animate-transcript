import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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

export const Player = ({ alignedTranscript, audioBlobUrl = "" }: Props) => {
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

  if (!isInitialized)
    return (
      <div
        className={clsx(
          "w-full max-w-2xl mx-auto my-8 px-8 leading-7",
          "h-[24rem] overflow-y-hidden relative",
          "border-dashed border-8 border-slate-300 rounded-xl"
        )}
      ></div>
    );

  return (
    <>
      <audio src={audioBlobUrl ?? ""} autoPlay />
      <div
        ref={containerRef}
        className={clsx(
          "w-full max-w-2xl mx-auto my-8 px-8 leading-7",
          "h-[24rem] overflow-y-hidden relative",
          "border-dashed border-8 border-slate-300 rounded-xl"
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
                    containerRef.current.scrollTop +
                      containerRef.current.offsetHeight
                  ) {
                    containerRef.current.scrollTo({
                      top: baseY - activeElementHeight,
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
