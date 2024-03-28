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
