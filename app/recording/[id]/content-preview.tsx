import { ExportFormType, UtteranceType } from "./types";
import { padWithLeadingZeros } from "./utils";

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
      let key: string = utterances[i].id.toString();
      if (formValue.audioNamePattern === "zeros") {
        key = padWithLeadingZeros(utterances.length, i + 1);
      } else if (formValue.audioNamePattern === "asc") {
        key = (i + 1).toString();
      }
      if (utterances.length > 7) {
        if (i < 3 || i >= utterances.length - 3) {
          items.push(
            <RenderUtterance
              key={key}
              id={key}
              utt={utterances[i]}
              formValue={formValue}
            />
          );
        } else if (i === 3) {
          items.push(<p className="my-2">...</p>);
        }
      } else {
        items.push(
          <RenderUtterance
            key={key}
            id={key}
            utt={utterances[i]}
            formValue={formValue}
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
  utt,
  formValue,
  id,
}: {
  utt: UtteranceType;
  formValue: ExportFormType;
  id: string;
}) => {
  return (
    <p className="truncate">
      <span className="text-red-300">
        {formValue.audioPrefix}
        {id}
        {formValue.audioSuffix}
      </span>
      {formValue.transcriptionDelimiter}
      <span className="text-green-300">{utt.text}</span>
    </p>
  );
};
