export type UtteranceType = {
  id: string;
  text: string;
};

export type ConfigDataType = {
  fileFormat: string;
  sampleRate: number;
  sampleSize: number;
  channels: number;
  features: string[];
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
  utterances: UtteranceType[];
}

export type ExportFormType = {
  fileFormat: string;
  fileName: string;
  audioPath: string;
  audioNamePattern: string;
  audioPrefix: string;
  audioSuffix: string;
  transcriptionPath: string;
  transcriptionName: string;
  transcriptionFormat: string;
  transcriptionDelimiter: string;
};
