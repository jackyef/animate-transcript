import { useSpeechRecognition } from "@/hooks/speech/useSpeechRecognition";
import { saveBlobUrlToFile, saveFile, readFile } from "@/utils/file";
import { Player } from "@/components/Player";
import { useForceAligner } from "@/hooks/speech/useForceAligner";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Textarea } from "@/components/ui/Textarea";

export const Recorder = () => {
  const {
    isListening,
    toggleListeningState,
    output,
    interimOutput,
    audioRecordingBlobUrl,
  } = useSpeechRecognition({ language: "en-US" });
  const [transcript, setTranscript] = useState("");
  const [playerKey, setPlayerKey] = useState(0);
  const { isLoading, alignedTranscript, requestAlignedTranscript } =
    useForceAligner();
  const recognizedTranscript = `${output} ${interimOutput}`;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 items-center w-full">
        {!alignedTranscript && !isLoading && (
          <>
            <div>
              <Button
                variant={isListening ? "destructive" : "subtle"}
                onClick={() => {
                  toggleListeningState();

                  if (isListening) {
                    // When toggling to stop listening
                    // save the final output
                    setTranscript(output);
                  }
                }}
              >
                {isListening ? "Stop recording" : "Start"}
              </Button>
            </div>

            <Textarea
              className="min-h-[16rem]"
              value={isListening ? recognizedTranscript : transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
          </>
        )}

        {!isListening && output && !Boolean(alignedTranscript) && (
          <>
            <Button
              disabled={isLoading}
              onClick={() => {
                requestAlignedTranscript(audioRecordingBlobUrl!, transcript);
              }}
            >
              {isLoading ? "please wait..." : "Create aligned transcript"}
            </Button>
          </>
        )}
      </div>

      {Boolean(alignedTranscript) && (
        <div className="flex flex-col items-center">
          <Button
            onClick={() => setPlayerKey((prev) => prev + 1)}
            variant="ghost"
          >
            Replay
          </Button>
          <Player
            key={playerKey}
            audioBlobUrl={audioRecordingBlobUrl!}
            alignedTranscript={alignedTranscript!}
          />

          <Button
            onClick={async () => {
              try {
                await saveBlobUrlToFile(
                  audioRecordingBlobUrl as string,
                  `${new Date().toTimeString()}.wav`
                );
                await saveFile(
                  JSON.stringify(alignedTranscript, null, 2),
                  `${new Date().toTimeString()}.json`
                );
              } catch {
                // no-op
              }
            }}
          >
            Save (this will save 2 files, the audio and the transcript)
          </Button>
        </div>
      )}
    </div>
  );
};
