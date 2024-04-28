import { ModeToggle } from "@/components/mode-toggle";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8 py-24 px-4">
      <div className="text-center">
        <h1 className="font-bold tracking-tighter text-2xl md:text-4xl mb-2">
          Speech Corpus Creator
        </h1>
        <p className="text-primary/75 text-sm md:text-base">
          Build your own speech corpus dataset with ease.
        </p>
      </div>
      <Image
        src={"/images/hero.png"}
        width={400}
        height={400}
        alt="a voice talent woman holding microphone and wearing headphone"
      />
      <p className="text-sm md:text-base">
        Select or create a utterance set to start
      </p>
      {/* <ModeToggle /> */}
    </div>
  );
}
