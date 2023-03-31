import { useState } from "react";
import type { AlignedTranscript } from "@/components/Player";

const FORCE_ALIGNER_SERVICE =
  "http://localhost:8080/http://localhost:41234/transcriptions?async=false";

export const useForceAligner = () => {
  // send multipart form data
  const [alignedTranscript, setAlignedTranscript] =
    useState<AlignedTranscript | null>(null);

  const requestAlignedTranscript = async (audioBlobUrl: string, transcript: string) => {
    setAlignedTranscript(null);

    const formData = new FormData();
    const audioArrayBuffer = await new Promise<ArrayBuffer>((resolve) => {
      fetch(audioBlobUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const fileReader = new FileReader();
          fileReader.onload = () => {
            resolve(fileReader.result as ArrayBuffer);
            // Use the ArrayBuffer data here
          };
          fileReader.readAsArrayBuffer(blob);
        });
    });
    const blobParts = [new Uint8Array(audioArrayBuffer)];
    formData.append("audio", new File(blobParts, "audio.wav"));
    formData.append("transcript", transcript);

    const json = await fetch(FORCE_ALIGNER_SERVICE, {
      method: "POST",
      body: formData,
    }).then((response) => response.json());

    setAlignedTranscript(json as AlignedTranscript);
  };

  return {
    alignedTranscript,
    requestAlignedTranscript,
  };
};
