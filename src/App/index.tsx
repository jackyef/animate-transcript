import { useSpeechRecognition } from "@/hooks/speech/useSpeechRecognition";
import { AnimatedTranscriptPlayer } from "@/AnimatedTranscriptPlayer";
import { useState } from "react";
import { saveBlobUrlToFile, saveFile, readFile } from "@/utils/file";
import { DetailedTranscript } from "@/hooks/speech/useSpeechRecognition";

export const App = () => {
  const speechRecognition = useSpeechRecognition({ language: "en-US" });
  const [showAnimatedTranscript, setShowAnimatedTranscript] = useState(false);
  const [loadedData, setLoadedData] = useState<{
    detailedTranscripts: DetailedTranscript[];
    audioBlobUrl: string;
  } | null>(null);

  return (
    <main>
      <button onClick={speechRecognition.toggleListeningState}>
        {speechRecognition.isListening ? "Stop" : "Start"}
      </button>
      <button onClick={async () => {
        const result = await readFile()

        setLoadedData(result);
      }}>
        Load existing data
      </button>
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
              }}
            >
              Save recording and transcript
            </button>
            <button onClick={() => setShowAnimatedTranscript((prev) => !prev)}>
              Show animated transcript
            </button>
          </>
        )}

      {showAnimatedTranscript && (
        <AnimatedTranscriptPlayer
          audioBlobUrl={speechRecognition.audioRecordingBlobUrl}
          detailedTranscripts={speechRecognition.detailedTranscripts}
        />
      )}

      {Boolean(loadedData) && (
        <AnimatedTranscriptPlayer
          audioBlobUrl={loadedData?.audioBlobUrl!}
          detailedTranscripts={loadedData?.detailedTranscripts!}
        />
      )}
    </main>
  );
};
