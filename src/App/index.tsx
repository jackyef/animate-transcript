import { useSpeechRecognition } from "@/hooks/speech/useSpeechRecognition";
import { useState } from "react";
import { saveBlobUrlToFile, saveFile, readFile } from "@/utils/file";
import { AlignedTranscript, BetterPlayer } from "@/BetterPlayer";
import { useForceAligner } from "@/hooks/speech/useForceAligner";

export const App = () => {
  const speechRecognition = useSpeechRecognition({ language: "en-US" });
  const [showAnimatedTranscript, setShowAnimatedTranscript] = useState(false);
  const [loadedData, setLoadedData] = useState<{
    audioBlobUrl: string;
    alignedTranscript: AlignedTranscript;
  } | null>(null);
  const [loadedDataKey, setLoadedDataKey] = useState(0);
  const { alignedTranscript, requestAlignedTranscript } = useForceAligner(
    speechRecognition.audioRecordingBlobUrl!,
    speechRecognition.output
  );

  return (
    <main>
      <div className="flex gap-2">
        <button onClick={speechRecognition.toggleListeningState}>
          {speechRecognition.isListening ? "Stop" : "Start"}
        </button>
        <button
          onClick={async () => {
            const result = await readFile();

            setLoadedData(result);
          }}
        >
          Load existing data
        </button>
          <button
            onClick={() => {
              setLoadedDataKey((prev) => prev + 1);
            }}
          >
            Reset
          </button>
        {!speechRecognition.isListening && speechRecognition.output && (
          <button
            onClick={() => {
              requestAlignedTranscript();
            }}
          >
            Create aligned transcript
          </button>
        )}
      </div>
      <p>{speechRecognition.isListening && "Listening..."}</p>

      <div>
        <span dangerouslySetInnerHTML={{ __html: speechRecognition.output }} />{" "}
        <br />
        <span className="opacity-50">{speechRecognition.interimOutput}</span>
      </div>

      {!speechRecognition.isListening &&
        speechRecognition.detailedTranscripts.length > 0 && (
          <>
            <button
              onClick={() => {
                saveBlobUrlToFile(
                  speechRecognition.audioRecordingBlobUrl as string,
                  `${new Date().toTimeString()}.wav`
                );
                saveFile(
                  JSON.stringify(
                    speechRecognition.detailedTranscripts,
                    null,
                    2
                  ),
                  `${new Date().toTimeString()}.json`
                );
                saveFile(
                  speechRecognition.output,
                  `${new Date().toTimeString()}.txt`
                );
              }}
            >
              Save recording and transcript
            </button>
            <button onClick={() => setShowAnimatedTranscript((prev) => !prev)}>
              Show animated transcript
            </button>
          </>
        )}

      {/* {showAnimatedTranscript && (
        <AnimatedTranscriptPlayer
          audioBlobUrl={speechRecognition.audioRecordingBlobUrl}
          detailedTranscripts={speechRecognition.detailedTranscripts}
        />
      )} */}

      {Boolean(alignedTranscript) && (
        <BetterPlayer
          key={loadedDataKey}
          audioBlobUrl={speechRecognition.audioRecordingBlobUrl!}
          alignedTranscript={alignedTranscript!}
          // detailedTranscripts={loadedData?.detailedTranscripts!}
        />
      )}

      {Boolean(loadedData) && (
        <BetterPlayer
          key={loadedDataKey}
          audioBlobUrl={loadedData?.audioBlobUrl!}
          alignedTranscript={loadedData?.alignedTranscript!}
          // detailedTranscripts={loadedData?.detailedTranscripts!}
        />
      )}
    </main>
  );
};
