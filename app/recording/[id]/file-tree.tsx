import {
  FileAudio,
  FileSpreadsheet,
  FolderArchive,
  FolderIcon,
} from "lucide-react";
import { FileSystemItem, FileTreeProps, Folder } from "./types";
import { createFileArray, createFolderStructureFromPath } from "./utils";

export const FileTree: React.FC<FileTreeProps> = ({
  formValue,
  utterances,
}) => {
  let rootFile: Folder = {
    id: "root",
    name: `${
      formValue.fileName || formValue.fileFormat
        ? `${formValue.fileName}.${formValue.fileFormat}`
        : "sample.zip"
    }`,
    type: "folder",
    format: "",
    children: [],
  };

  const audioPath = formValue?.audioPath || "/";
  const transcriptionPath = formValue.transcriptionPath || "/";

  const audioFiles = createFileArray(
    utterances,
    formValue.audioPrefix,
    formValue.audioNamePattern,
    formValue.audioSuffix,
    "wav",
    3
  );

  rootFile = createFolderStructureFromPath(rootFile, audioPath, audioFiles);
  rootFile = createFolderStructureFromPath(rootFile, transcriptionPath, [
    {
      id: "utterances",
      name: formValue.transcriptionName || "sample",
      format: formValue.transcriptionFormat || "csv",
      type: "file",
    },
  ]);

  const fileStructure = rootFile;

  const renderTree = (items: FileSystemItem[]) => {
    return (
      <ul className="pl-4 space-y-2 text-primary/75 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            {item.type === "file" ? (
              <div className="flex gap-2 items-center">
                {["csv", "txt"].includes(item.format) ? (
                  <FileSpreadsheet className="w-5 h-5" />
                ) : (
                  ["wav", "mp3", "m4a", "webm"].includes(item.format) && (
                    <FileAudio className="w-5 h-5" />
                  )
                )}
                <span className="truncate">
                  {item.name}.{item.format}
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  {item.id === "root" ? (
                    <FolderArchive className="w-5 h-5 text-white" />
                  ) : (
                    <FolderIcon className="w-5 h-5" />
                  )}
                  <span className="">{item.name}</span>
                </div>
                {renderTree((item as Folder).children as FileSystemItem[])}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return <div>{renderTree([fileStructure])}</div>;
};
