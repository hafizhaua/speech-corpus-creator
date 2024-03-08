import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SetCardProps {
  title: string;
  language: string;
}

export const SetCard: React.FC<SetCardProps> = ({ title, language }) => {
  return (
    <Link href={"/library/1"}>
      <Card className="flex flex-col w-full h-full overflow-x-hidden hover:bg-muted transition">
        <CardHeader>
          <CardTitle className="">
            <p className="text-lg font-bold">{title}</p>
          </CardTitle>
          <CardDescription>{language}</CardDescription>
        </CardHeader>

        <CardFooter className="text-muted-foreground">
          <p className="">
            by <span className="font-semibold">Hafizha Ulinnuha Ahmad</span>
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
};
