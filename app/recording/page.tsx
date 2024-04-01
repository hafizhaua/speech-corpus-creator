import {
  File,
  FileAudio,
  FileSpreadsheet,
  Folder,
  FolderArchive,
} from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { ExportForm } from "./export-form";

export default function Output() {
  const fileStructure: Folder = {
    id: 1,
    name: "MySpeech.zip",
    type: "folder",

    children: [
      {
        id: 2,
        name: "wavs",
        type: "folder",
        children: [
          { id: 3, name: "1", type: "file", format: "wav" },
          { id: 4, name: "2", type: "file", format: "wav" },
          { id: 8, name: "3", type: "file", format: "wav" },
          { id: 9, name: "4", type: "file", format: "wav" },
        ],
      },
      {
        id: 5,
        name: "metadata",
        type: "folder",
        children: [{ id: 7, name: "utterances", type: "file", format: "csv" }],
      },
    ],
  };

  const transcriptContent = [""];

  return (
    <div className="p-8 py-12 md:px-10 md:py-12 space-y-4">
      <h1 className="text-2xl font-bold">Export Configuration</h1>
      <p className="text-muted-foreground">
        Congratulations on completing the recording process. Lastly, choose how
        you would like to format the corpus and it will be ready for download!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5">
          <ExportForm />
        </div>
        <div className="md:col-span-7 ">
          <div className="md:top-8 md:sticky py-8 px-6 rounded-lg border border-muted space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest">
              Result Preview
            </h2>

            <div className="flex gap-4">
              <div className="space-y-4">
                <h2 className="text-xs text-muted-foreground uppercase tracking-widest">
                  File Structure
                </h2>
                <FileTree data={[fileStructure]} />
              </div>
              <div className="flex-1 space-y-4">
                <h2 className="text-xs text-muted-foreground uppercase tracking-widest">
                  Transcript Content
                </h2>
                <TranscriptContent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface File {
  id: number;
  name: string;
  format: string;
  type: "file"; // Corrected to specify type as 'file'
}

interface Folder {
  id: number;
  name: string;
  type: "folder"; // Corrected to specify type as 'folder'
  children: FileSystemItem[]; // Recursive type definition
}

type FileSystemItem = Folder | File;

interface FileTreeProps {
  data: FileSystemItem[];
}

const FileTree: React.FC<FileTreeProps> = ({ data }) => {
  const renderTree = (items: FileSystemItem[]) => {
    return (
      <ul className="pl-4 space-y-2 text-primary/75 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            {item.type === "file" ? (
              <div className="flex gap-2 items-center">
                {item.format === "csv" ? (
                  <FileSpreadsheet className="w-5 h-5" />
                ) : (
                  <FileAudio className="w-5 h-5" />
                )}
                <span className="">
                  {item.name}.{item.format}
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  {item.id === 1 ? (
                    <FolderArchive className="w-5 h-5 text-white" />
                  ) : (
                    <Folder className="w-5 h-5" />
                  )}
                  <span className="">{item.name}</span>
                </div>
                {renderTree((item as Folder).children)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return <div>{renderTree(data)}</div>;
};

const TranscriptContent = () => {
  return (
    <div className="">
      <span className="rounded-md text-xs px-4 py-2 bg-muted text-right text-muted-foreground mb-4">
        utterances.csv
      </span>
      <div className="bg-muted w-full rounded-md rounded-tl-none py-4 px-4 text-xs">
        <code className="text-ellipsis w-full overflow-hidden">
          <p className="">HUA1|Hello, how you do?</p>
          <p className="">HUA2|Nothing interested right here</p>
          <p className="">...</p>
          <p className="">HUA78|What about the backside Chinese restaurant?</p>
          <p className="">HUA79|Napping is a love-hate all time activity.</p>
        </code>
      </div>
    </div>
  );
};
