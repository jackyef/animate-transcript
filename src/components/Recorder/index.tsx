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
  const { alignedTranscript, requestAlignedTranscript } = useForceAligner();
  const recognizedTranscript = `${output} ${interimOutput}`;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 items-center w-full">
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
          value={isListening ? recognizedTranscript : transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />

        {!isListening && output && (
          <>
            <Button
              onClick={() => {
                requestAlignedTranscript(audioRecordingBlobUrl!, transcript);
              }}
            >
              Create aligned transcript
            </Button>
          </>
        )}
      </div>

      {Boolean(alignedTranscript) && (
        <>
          <Button
            onClick={() => {
              saveBlobUrlToFile(
                audioRecordingBlobUrl as string,
                `${new Date().toTimeString()}.wav`
              );
              saveFile(
                JSON.stringify(alignedTranscript, null, 2),
                `${new Date().toTimeString()}.json`
              );
            }}
          >
            Save (this will save 2 files, the audio and the transcript)
          </Button>
          <Player
            audioBlobUrl={audioRecordingBlobUrl!}
            alignedTranscript={alignedTranscript!}
          />
        </>
      )}
    </div>
  );
};
