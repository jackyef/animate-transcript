import { useSpeechRecognition } from "@/hooks/speech/useSpeechRecognition";
import { AnimatedTranscript } from "@/AnimatedTranscript";
import { useState } from "react";

export const App = () => {
  const speechRecognition = useSpeechRecognition({ language: "en-US" });
  const [showAnimatedTranscript, setShowAnimatedTranscript] = useState(false);

  return (
    <main>
      <button onClick={speechRecognition.toggleListeningState}>
        {speechRecognition.isListening ? "Stop" : "Start"}
      </button>
      <p>{speechRecognition.isListening && "Listening..."}</p>

      <div>
        <span dangerouslySetInnerHTML={{ __html: speechRecognition.output }} />{" "}
        <br />
        <span className="opacity-50">{speechRecognition.interimOutput}</span>
      </div>

      {!speechRecognition.isListening &&
        speechRecognition.detailedTranscripts.length > 0 && (
          <button onClick={() => setShowAnimatedTranscript((prev) => !prev)}>
            Show animated transcript
          </button>
        )}

      {showAnimatedTranscript && (
        <AnimatedTranscript
          audioBlobUrl={speechRecognition.audioRecordingBlobUrl}
          detailedTranscripts={speechRecognition.detailedTranscripts}
        />
      )}
    </main>
  );
};
