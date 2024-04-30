import { z } from "zod";

export type UtteranceType = {
  id: string;
  text: string;
};

export type ConfigDataType = {
  // fileFormat: string;
  sampleRate?: number;
  sampleSize?: number;
  channels?: number;
  features?: string[];
};

export type RecordingDataType = {
  idx: number;
  utterance: UtteranceType;
  audioBlob: Blob;
};

export interface File {
  id: string;
  name: string;
  format: string;
  type: string; // Corrected to specify type as 'file'
}

export interface Folder {
  id: string;
  name: string;
  format: string;
  type: string; // Corrected to specify type as 'folder'
  children?: FileSystemItem[]; // Recursive type definition
}

export type FileSystemItem = Folder | File;

export interface FileTreeProps {
  formValue: ExportFormType;
  recordedCount: number;
  utterances: UtteranceType[];
}

export const formSchema = z.object({
  preset: z.string().optional(),
  fileFormat: z.string().min(1),
  fileName: z.string().min(1),
  audioPath: z.string(),
  audioFormat: z.string().min(1),
  audioNamePattern: z.string().min(1),
  audioPrefix: z.string(),
  audioSuffix: z.string(),
  transcriptionPath: z.string(),
  transcriptionName: z.string().min(1),
  transcriptionFormat: z.string().min(1),
  transcriptionDelimiter: z.string().min(1),
  includePath: z.boolean(),
  sampleRate: z.coerce.number(),
  sampleSize: z.coerce.number(),
  channels: z.coerce.number(),
});
// export type ExportFormType = {
//   fileFormat: string;
//   fileName: string;
//   audioPath: string;
//   audioFormat: string;
//   audioNamePattern: string;
//   audioPrefix: string;
//   audioSuffix: string;
//   transcriptionPath: string;
//   transcriptionName: string;
//   transcriptionFormat: string;
//   transcriptionDelimiter: string;
// };

export type ExportFormType = z.infer<typeof formSchema>;
