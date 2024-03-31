export type ConfigDataType = {
  fileFormat: string;
  sampleRate: number;
  sampleSize: number;
  channels: number;
  features: string[];
};

export type RecordingDataType = {
  idx: number;
  label: string;
  audioBlob: Blob;
};
