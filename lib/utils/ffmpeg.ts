import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export const transcodeWebm = async (blob: Blob, extension: string) => {
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  const ffmpeg = new FFmpeg();
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  const inputName = "input.webm";
  const outputName = `output.${extension}`;

  await ffmpeg.writeFile(inputName, new Uint8Array(await blob.arrayBuffer()));

  await ffmpeg.exec(["-i", "input.avi", "output.mp4"]);
  const outputData = (await ffmpeg.readFile(outputName)) as any;
  const outputBlob = new Blob([outputData.buffer], {
    type: `audio/${extension}`,
  });

  return outputBlob;
};
