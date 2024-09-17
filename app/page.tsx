import Hero from "@/components/hero";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Index() {
  return (

    <div>
      <iframe className="w-screen" src="http://localhost:3000/testimonials/5cf6c28d-cd13-44cb-a9a2-d093bcb65afd" ></iframe>
    </div>
  
  );
}
