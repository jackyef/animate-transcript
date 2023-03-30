import { useEffect, useState } from "react";

export const useAudioDuration = (audioBlobUrl?: string) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!audioBlobUrl) return;

    (async () => {
      const audioCtx = new window.AudioContext();

      const arrayBuffer = await fetch(audioBlobUrl).then((res) => res.arrayBuffer());
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      setDuration(audioBuffer.duration);

      audioCtx.close();
    })()
  })

  return duration * 1000;
}