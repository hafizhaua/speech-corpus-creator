import { Input } from "@/components/ui/input";
import { login, signup } from "./actions";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GithubButton } from "./github-button";

export default async function LoginPage() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/");
  }

  return (
    <div className="p-8 py-12 md:px-10 md:py-12 space-y-8">
      <div className="">
        <h1 className="text-2xl font-bold mb-2">User Authentication</h1>
        <p className="text-muted-foreground">
          Login to your account or create a new one to access additional
          features
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <form className="flex flex-col gap-4">
          <Label htmlFor="email">Email:</Label>
          <Input id="email" name="email" type="email" required />
          <Label htmlFor="password">Password:</Label>
          <Input id="password" name="password" type="password" required />
          <Button formAction={login}>Log in</Button>
          <Button variant="secondary" formAction={signup}>
            Sign up
          </Button>
        </form>
        <div className="flex items-center gap-8">
          <hr className="flex-1" />
          <span className="text-center text-sm text-muted-foreground">
            or log in with
          </span>
          <hr className="flex-1" />
        </div>
        <GithubButton />
      </div>
    </div>
  );
}
