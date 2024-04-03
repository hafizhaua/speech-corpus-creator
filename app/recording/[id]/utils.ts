import { FileSystemItem, Folder } from "./types";

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
  count: number,
  prefix: string,
  pattern: string,
  suffix: string,
  format: string,
  limit = -1
) => {
  const fileArray = [];

  for (let i = 1; i <= count; i++) {
    if (i > limit && i < count - limit && count > 10) {
      const file = {
        name: "..",
        id: "etc",
        format: "",
        type: "file",
      };
      fileArray.push(file);
      i = count - limit;
    } else {
      let id = i.toString();

      if (pattern === "uuid") {
        id = Math.random().toString(36).substring(2, 5);
      }

      const name = prefix + id + suffix;
      const file = {
        name,
        id,
        format,
        type: "file",
      };

      fileArray.push(file);
    }
  }

  return fileArray as FileSystemItem[];
};
