export type ConfigDataType = {
  fileFormat: string;
  sampleRate: string;
  sampleSize: string;
  channels: string;
  features: string[];
};

export type RecordingDataType = {
  idx: number;
  label: string;
  audioBlob: Blob;
};
