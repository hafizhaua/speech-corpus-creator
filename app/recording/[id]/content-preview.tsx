import { ExportFormType, UtteranceType } from "./types";
import { generateAudioName } from "./utils";

export const TranscriptContent = ({
  fileName,
  utterances,
  formValue,
}: {
  fileName: string;
  utterances: UtteranceType[];
  formValue: ExportFormType;
}) => {
  const renderItems = () => {
    const items: React.JSX.Element[] = [];

    for (let i = 0; i < utterances.length; i++) {
      const name = generateAudioName(
        formValue.audioPrefix,
        formValue.audioSuffix,
        formValue.audioNamePattern,
        utterances[i].id,
        utterances.length,
        i + 1
      );
      if (utterances.length > 7) {
        if (i < 3 || i >= utterances.length - 3) {
          items.push(
            <RenderUtterance
              key={name}
              id={name}
              delimiter={formValue.transcriptionDelimiter}
              utterance={utterances[i].text}
            />
          );
        } else if (i === 3) {
          items.push(<p className="my-2">...</p>);
        }
      } else {
        items.push(
          <RenderUtterance
            key={name}
            id={name}
            delimiter={formValue.transcriptionDelimiter}
            utterance={utterances[i].text}
          />
        );
      }
    }

    return items;
  };
  return (
    <div className="w-full relative">
      <span className="rounded-md text-xs px-4 py-2 bg-muted text-right text-muted-foreground mb-4">
        {fileName === "." ? "sample.csv" : fileName}
      </span>
      <div className="absolute w-full bg-muted rounded-md rounded-tl-none py-4 px-4 text-xs">
        <code className=" text-ellipsis w-full overflow-hidden">
          {renderItems()}
        </code>
      </div>
    </div>
  );
};

const RenderUtterance = ({
  id,
  utterance,
  delimiter,
}: {
  id: string;
  utterance: string;
  delimiter: string;
}) => {
  return (
    <p className="truncate">
      <span className="text-red-300">{id}</span>
      {delimiter}
      <span className="text-green-300">{utterance}</span>
    </p>
  );
};
