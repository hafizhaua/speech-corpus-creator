"use client";

import React from "react";

type SetMetadataProps = {
  language: string;
  utterances: string;
};
export default function SetMetadata({
  language,
  utterances,
}: SetMetadataProps) {
  // Function to calculate word count
  const calculateWordCount = (text: string) => {
    return text.split(/\||\s/).length;
  };

  // Function to calculate number of sentences
  const calculateSentenceCount = (text: string) => {
    return text.split("|").length;
  };

  // Calculate word count and number of sentences
  const wordCount = calculateWordCount(utterances);
  const sentenceCount = calculateSentenceCount(utterances);
  return (
    <div className="flex gap-16">
      <div className="">
        <p className="text-muted-foreground text-xs tracking-wider uppercase">
          Language
        </p>
        <h2 className="font-bold mt-1">{language}</h2>
      </div>
      <div className="">
        <p className="text-muted-foreground text-xs tracking-wider uppercase">
          Utterance Count
        </p>
        <h2 className="font-bold mt-1">{sentenceCount}</h2>
      </div>
      <div className="">
        <p className="text-muted-foreground text-xs tracking-wider uppercase">
          Word Count
        </p>
        <h2 className="font-bold mt-1">{wordCount}</h2>
      </div>
      <div className="">
        <p className="text-muted-foreground text-xs tracking-wider uppercase">
          Recording Duration
        </p>
        <h2 className="font-bold mt-1">
          &#8776; {Math.floor(wordCount / 60 / 5) + 1 * 5} min
        </h2>
      </div>
    </div>
  );
}
