import Hero from "@/components/hero";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Index() {
  return (
    <div>
      <iframe className="w-screen" src="http://localhost:3000/testimonials/821e27d1-ce7e-4194-ba66-f93cf654273e" ></iframe>
    </div>
  );
}
