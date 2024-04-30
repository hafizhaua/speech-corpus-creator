import { Link } from "next-view-transitions";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReactCountryFlag from "react-country-flag";

interface SetCardProps {
  id: string;
  title: string;
  language: string;
  author?: string;
  countryCode?: string;
}

export const SetCard: React.FC<SetCardProps> = ({
  id,
  title,
  language,
  author,
  countryCode,
}) => {
  return (
    <Link href={"/library/" + id}>
      <Card className="flex flex-col w-full h-full overflow-x-hidden hover:bg-muted transition">
        <CardHeader>
          <CardTitle className="">
            <p className="text-lg font-bold">{title}</p>
          </CardTitle>
          <CardDescription className="flex gap-2 items-center">
            <ReactCountryFlag countryCode={countryCode || ""} svg /> {language}
          </CardDescription>
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
