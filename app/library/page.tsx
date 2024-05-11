import React from "react";
import { SetList } from "./set-list";

export default async function UtteranceLibrary() {
  return (
    <div className="px-6 py-10  md:px-10 md:py-12 flex flex-col gap-8 h-screen">
      <div className="">
        <h1 className="text-2xl font-bold mb-2">Utterance Library</h1>
        <p className="text-muted-foreground">
          Browse some utterance sets made by others that you can also use.
        </p>
      </div>
      <SetList />
    </div>
  );
}
