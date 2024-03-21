import React from "react";
import RecordingSession from "./recording-session";

export default function RecordingPage() {
  const utterances = [
    "Hello, how can I help you today?",
    "I'm experiencing issues with my account.",
    "Sure, I can assist you with that. Could you please provide me with your account details?",
    "My username is johndoe123.",
    "Thank you. What seems to be the problem?",
  ];

  return (
    <div className="p-8 md:px-10 md:py-12 min-h-screen flex flex-col gap-12 items-center justify-center">
      <RecordingSession />
    </div>
  );
}
