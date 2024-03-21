"use client";

import React, { useState } from "react";
import RecordButton from "./record-button";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoveLeft, MoveRight } from "lucide-react";

export default function RecordingSession() {
  const [currIdx, setCurrIdx] = useState(0);
  const utterances = [
    "Hello, how can I help you today?",
    "I'm experiencing issues with my account.",
    "Sure, I can assist you with that. Could you please provide me with your account details?",
    "My username is johndoe123.",
    "Thank you. What seems to be the problem?",
  ];

  const handleNext = () => {
    setCurrIdx((prev) => (prev < utterances.length - 1 ? prev + 1 : prev));
  };
  const handlePrev = () => {
    setCurrIdx((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <>
      <div className="text-muted-foreground space-y-1">
        <div className="flex gap-2 justify-center items-center">
          <Button variant="ghost" size="icon" onClick={handlePrev}>
            <ChevronLeft />
          </Button>
          <span>
            {currIdx + 1} of {utterances.length}
          </span>
          <Button variant="ghost" size="icon" onClick={handleNext}>
            <ChevronRight />
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Click the record button and verbalize below sentence.
        </p>
      </div>
      <div className="space-y-8 mb-16">
        <p className="text-3xl font-bold text-balance text-center">
          {utterances[currIdx]}
        </p>
        <RecordButton />
      </div>
    </>
  );
}
