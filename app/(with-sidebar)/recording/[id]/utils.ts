import JSZip from "jszip";
import { FileSystemItem, Folder, UtteranceType } from "./types";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export const normalizeSentence = (sentence: string) => {
  let withoutPunctuation = sentence.replace(
    /[.,\/#!?$%\^&\*;:{}=\-_'`~()]/g,
    ""
  );

  let lowercaseWithoutPunctuation = withoutPunctuation.toLowerCase();

  return lowercaseWithoutPunctuation;
};

export const downloadBlob = async (blob: Blob): Promise<void> => {
  const downloadBlob = blob;
  const fileExt = "webm";
  const url = URL.createObjectURL(downloadBlob);

  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = `audio.${fileExt}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

export const createFolder = (name: string): Folder => {
  return {
    id: Math.random().toString(36).substring(2, 9), // Generate a random ID
    name,
    format: "",
    type: "folder",
    children: [],
  };
};

export const createFolderStructureFromPath = (
  root: Folder,
  path: string,
  content: FileSystemItem[]
): Folder => {
  // if (!path || path === "/") {
  //   return null; // Return null for an empty or root path
  // }

  const pathParts = path.split("/").filter((part) => part !== "");

  let currentFolder: Folder | null = root;

  for (let i = 0; i < pathParts.length; i++) {
    const folderName = pathParts[i];
    const existingFolder: any = currentFolder?.children?.find(
      (item): item is Folder =>
        item.type === "folder" && item.name === folderName
    );

    if (existingFolder) {
      currentFolder = existingFolder;
    } else {
      const newFolder = createFolder(folderName);
      currentFolder?.children?.push(newFolder);
      currentFolder = newFolder;
    }
  }

  if (content) {
    currentFolder?.children?.push(...content);
  }

  return root;
};

export const createFileArray = (
  utterances: UtteranceType[],
  recordedCount: number,
  prefix: string,
  pattern: string,
  suffix: string,
  format: string,
  limit = -1
) => {
  const fileArray: FileSystemItem[] = [];
  for (let i = 0; i < recordedCount; i++) {
    if (i > limit - 1 && i < recordedCount - limit && recordedCount > 5) {
      const file = {
        name: "..",
        id: "etc",
        format: "",
        type: "file",
      };
      fileArray.push(file);
      i = recordedCount - limit - 1;
    } else {
      const name = generateAudioName(
        prefix,
        suffix,
        pattern,
        utterances[i].id,
        recordedCount,
        i + 1
      );
      const file = {
        name,
        id: name,
        format,
        type: "file",
      };

      fileArray.push(file);
    }
  }

  return fileArray;
};

export const padWithLeadingZeros = (maxValue: number, n: number): string => {
  const maxDigits = Math.floor(Math.log10(maxValue) + 1);
  const nString = n.toString();
  const paddingLength = maxDigits - nString.length;

  if (paddingLength <= 0) {
    return nString;
  }

  const padding = "0".repeat(paddingLength);
  return padding + nString;
};

export const generateAudioName = (
  prefix: string,
  suffix: string,
  pattern: string,
  id: string,
  maxLength: number,
  index: number
) => {
  let key = id;
  if (pattern === "zeros") {
    key = padWithLeadingZeros(maxLength, index);
  } else if (pattern === "asc") {
    key = index.toString();
  }

  return prefix + key + suffix;
};

export function generateShortId(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function generateBlob(
  data: any[][],
  format: string = "csv",
  delimiter: string = ","
): Promise<Blob> {
  try {
    console.log(format);
    const csvContent = data.map((row) => row.join(delimiter)).join("\n");
    const blob = new Blob([csvContent], { type: `text/${format}` });
    return blob;
  } catch (error) {
    throw new Error(
      "Error generating CSV: " +
        (error instanceof Error ? error.message : JSON.stringify(error))
    );
  }
}

export const encodeAudio = async (
  ffmpeg: any,
  idx: number,
  recordingBlob: Blob,
  format: string,
  sampleRate: number,
  channelCount: number
) => {
  await ffmpeg.writeFile(`input${idx}.webm`, await fetchFile(recordingBlob));

  try {
    if (format === "wav") {
      await ffmpeg.exec([
        "-i",
        `input${idx}.webm`,
        "-f",
        "wav",
        "-acodec",
        "pcm_s16le",
        "-ac",
        channelCount.toString(),
        "-ar",
        sampleRate.toString(),
        "-vn",
        "-b:a",
        "192k",
        `output${idx}.wav`,
      ]);
      const data = (await ffmpeg.readFile(`output${idx}.wav`)) as any;
      // console.log(data);

      // Clean up files to free memory
      await ffmpeg.deleteFile(`input${idx}.webm`);
      await ffmpeg.deleteFile(`output${idx}.wav`);
      // await ffmpeg.terminate();

      return new Blob([data.buffer], { type: "audio/wav" });
    } else if (format === "mp3") {
      await ffmpeg.exec([
        "-i",
        `input${idx}.webm`,
        "-f",
        "mp3",
        "-acodec",
        "libmp3lame",
        "-ac",
        channelCount.toString(),
        "-ar",
        sampleRate.toString(),
        "-vn",
        "-b:a",
        "192k",
        `output${idx}.mp3`,
      ]);
      const data = (await ffmpeg.readFile(`output${idx}.mp3`)) as any;
      // console.log(data);

      // Clean up files to free memory
      await ffmpeg.deleteFile(`input${idx}.webm`);
      await ffmpeg.deleteFile(`output${idx}.mp3`);
      // await ffmpeg.terminate();

      return new Blob([data.buffer], { type: "audio/mp3" });
    } else {
      await ffmpeg.exec([
        "-i",
        `input${idx}.webm`,
        "-c:a",
        "libopus",
        "-ac",
        channelCount.toString(),
        "-ar",
        sampleRate.toString(),
        `output${idx}.webm`,
      ]);
      const data = (await ffmpeg.readFile(`output${idx}.webm`)) as any;

      // console.log(data);

      // Clean up files to free memory
      // await ffmpeg.deleteFile(`input${idx}.webm`);
      // await ffmpeg.deleteFile(`output${idx}.webm`);
      // await ffmpeg.terminate();

      return new Blob([data.buffer], { type: "audio/webm" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const stringSimilarity = (
  str1: string,
  str2: string,
  substringLength: number = 2,
  caseSensitive: boolean = false
) => {
  if (!caseSensitive) {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
  }

  if (str1.length < substringLength || str2.length < substringLength) return 0;

  const map = new Map();
  for (let i = 0; i < str1.length - (substringLength - 1); i++) {
    const substr1 = str1.substr(i, substringLength);
    map.set(substr1, map.has(substr1) ? map.get(substr1) + 1 : 1);
  }

  let match = 0;
  for (let j = 0; j < str2.length - (substringLength - 1); j++) {
    const substr2 = str2.substr(j, substringLength);
    const count = map.has(substr2) ? map.get(substr2) : 0;
    if (count > 0) {
      map.set(substr2, count - 1);
      match++;
    }
  }

  return (match * 2) / (str1.length + str2.length - (substringLength - 1) * 2);
};

const sorensenDiceCoefficient = (
  str1: string,
  str2: string,
  substringLength: number = 2,
  caseSensitive: boolean = false
): number => {
  if (!caseSensitive) {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
  }

  if (str1.length < substringLength || str2.length < substringLength) return 0;

  const createSubstringMap = (
    str: string,
    len: number
  ): Map<string, number> => {
    const map = new Map<string, number>();
    for (let i = 0; i <= str.length - len; i++) {
      const substr = str.substr(i, len);
      map.set(substr, (map.get(substr) || 0) + 1);
    }
    return map;
  };

  const map1 = createSubstringMap(str1, substringLength);
  const map2 = createSubstringMap(str2, substringLength);

  let match = 0;
  map2.forEach((count, substr) => {
    if (map1.has(substr)) {
      match += Math.min(count, map1.get(substr) as number);
    }
  });

  return (2 * match) / (str1.length + str2.length - 2 * (substringLength - 1));
};
