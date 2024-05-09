import { AuthProfile } from "./auth-profile";
import { MyUtteranceLibrary } from "./my-utterance-library";

export const Sidebar = () => {
  return (
    <div className="h-screen hidden md:flex gap-4 flex-col items-center p-4">
      <AuthProfile />
      <MyUtteranceLibrary />
    </div>
  );
};
