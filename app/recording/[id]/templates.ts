export const RESET = {
  fileFormat: "",
  fileName: "",
  audioPath: "",
  audioFormat: "",
  audioNamePattern: "",
  audioPrefix: "",
  audioSuffix: "",
  transcriptionPath: "",
  transcriptionName: "",
  transcriptionFormat: "",
  transcriptionDelimiter: "",
};

export const LJSPEECH = {
  fileFormat: "zip",
  fileName: "ljspeech",
  audioPath: "wavs",
  audioFormat: "wav",
  audioNamePattern: "zeros",
  audioPrefix: "LJ001-",
  audioSuffix: "",
  transcriptionPath: "",
  transcriptionName: "transcripts",
  transcriptionFormat: "csv",
  transcriptionDelimiter: "|",
};

export const PIPER = {
  fileFormat: "zip",
  fileName: "piper",
  audioPath: "wavs",
  audioFormat: "wav",
  audioNamePattern: "asc",
  audioPrefix: "",
  audioSuffix: "",
  transcriptionPath: "",
  transcriptionName: "metadata",
  transcriptionFormat: "csv",
  transcriptionDelimiter: "|",
};

export const AUDIO_FORMATS = ["wav", "mp3", "webm"];
