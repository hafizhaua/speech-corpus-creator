import Image from "next/image";
import HeroImage from "@/public/images/hero.webp";
import Link from "next/link";

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
        src={HeroImage}
        width={400}
        height={400}
        placeholder="blur"
        alt="a voice talent woman holding microphone and wearing headphone"
      />
      <p className="text-sm md:text-base text-muted-foreground">
        Select,{" "}
        <Link
          className="text-primary/80 hover:text-primary transition"
          href="/create"
        >
          create
        </Link>
        , or{" "}
        <Link
          className="text-primary/80 hover:text-primary transition"
          href="/library"
        >
          browse
        </Link>{" "}
        a utterance set to start
      </p>
      {/* <ModeToggle /> */}
    </div>
  );
}
