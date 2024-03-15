import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SetCardProps {
  id: string;
  title: string;
  language: string;
  author?: string;
}

export const SetCard: React.FC<SetCardProps> = ({
  id,
  title,
  language,
  author,
}) => {
  return (
    <Link href={"/library/" + id}>
      <Card className="flex flex-col w-full h-full overflow-x-hidden hover:bg-muted transition">
        <CardHeader>
          <CardTitle className="">
            <p className="text-lg font-bold">{title}</p>
          </CardTitle>
          <CardDescription>{language}</CardDescription>
        </CardHeader>

        {author && (
          <CardFooter className="text-muted-foreground">
            <p className="">
              by <span className="font-semibold">{author}</span>
            </p>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
};
