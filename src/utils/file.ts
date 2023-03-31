import { AlignedTranscript } from "@/components/Player";

export async function saveFile(
  file: FileSystemWriteChunkType,
  suggestedName: string
) {
  // create a new handle
  const newHandle = await window.showSaveFilePicker({ suggestedName });

  // create a FileSystemWritableFileStream to write to
  const writableStream = await newHandle.createWritable();

  // write our file
  await writableStream.write(file);

  // close the file and write the contents to disk.
  await writableStream.close();
}

export async function blobUrlToBlob(blobUrl: string) {
  return fetch(blobUrl).then((response) => response.blob());
}

export async function saveBlobUrlToFile(
  blobUrl: string,
  suggestedName: string
) {
  const blob = await blobUrlToBlob(blobUrl);
  await saveFile(blob, suggestedName);
}

export async function readFile() {
  const fileHandles = await window.showOpenFilePicker({
    types: [
      {
        accept: {
          "application/json": [".json"],
          "text/plain": [".txt"],
          "audio/wav": [".wav"],
        },
      },
    ],
    excludeAcceptAllOption: true,
    multiple: true,
  });

  const result: {
    alignedTranscript: AlignedTranscript;
    audioBlobUrl: string;
    transcript: string;
  } = {} as any;

  await Promise.all(
    fileHandles.map((fileHandle) => {
      return (async () => {
        const file = await fileHandle.getFile();
        const text = await file.text();

        if (file.name.endsWith(".json")) {
          result.alignedTranscript = JSON.parse(text) as AlignedTranscript;
        }

        if (file.name.endsWith(".wav")) {
          result.audioBlobUrl = URL.createObjectURL(file);
        }

        if (file.name.endsWith(".txt")) {
          result.transcript = text;
        }

        return text;
      })();
    })
  );

  return result;
}
