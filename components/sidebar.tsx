import { AuthProfile } from "./auth-profile";
import { MyUtteranceLibrary } from "./my-utterance-library";

export const Sidebar = () => {
  return (
    <div className="hidden md:flex gap-4 flex-col h-full items-center p-4">
      <AuthProfile />
      <MyUtteranceLibrary />
    </div>
  );
};
