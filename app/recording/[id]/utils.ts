import JSZip from "jszip";
import { FileSystemItem, Folder, UtteranceType } from "./types";

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
  prefix: string,
  pattern: string,
  suffix: string,
  format: string,
  limit = -1
) => {
  const fileArray: FileSystemItem[] = [];
  for (let i = 0; i < utterances.length; i++) {
    if (
      i > limit - 1 &&
      i < utterances.length - limit &&
      utterances.length > 5
    ) {
      const file = {
        name: "..",
        id: "etc",
        format: "",
        type: "file",
      };
      fileArray.push(file);
      i = utterances.length - limit - 1;
    } else {
      const name = generateAudioName(
        prefix,
        suffix,
        pattern,
        utterances[i].id,
        utterances.length,
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

export async function generateCSVBlob(
  data: any[][],
  delimiter: string = ","
): Promise<Blob> {
  try {
    const csvContent = data.map((row) => row.join(delimiter)).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    return blob;
  } catch (error) {
    throw new Error(
      "Error generating CSV: " +
        (error instanceof Error ? error.message : JSON.stringify(error))
    );
  }
}
