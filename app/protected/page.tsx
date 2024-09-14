'use client';
import { createClient } from '@/utils/supabase/client';
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProtectedPage() {
  const supabase = createClient();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null); // State to hold user data
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        redirect("/sign-in");
        return;
      }

      setUser(user); // Set user state
      setLoading(false); // Update loading state
    };

    fetchUser();
  }, [supabase]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await axios.get('/api/getWorkspaces');
        setWorkspaces(response.data);
      } catch (err) {
        console.error("Error fetching workspaces:", err);
      }
    };

    fetchWorkspaces();
  }, []);

  if (loading) return <div>Loading...</div>; // Show loading state

  return (
    <div className="flex-1 w-full flex flex-col gap-12">

        <div className='w-full flex justify-between items-center'>
          <h1 className="font-bold text-2xl max-sm:text-base ">Workspaces</h1>
        <Link
          href="/protected/create-workspace"
          className="w-fit rounded-md max-sm:text-xs border border-background/20 px-4 py-1 bg-blue-400 text-center text-white no-underline"
        >
          Add New
        </Link>

        </div>
      <div>
        {workspaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.map((workspace) => (
              <div key={workspace.id} className="bg-card flex flex-col gap-2 border border-border p-4 rounded-lg shadow-lg">
                <div className='flex'>

                <Link href={`/protected/workspace/${workspace.w_name}`}>
                    <h3 className="font-semibold text-lg text-foreground">{workspace.workspace_title}</h3>
                </Link>
                
                </div>
                {/* <p className="text-sm text-muted-foreground">Name: {workspace.w_name}</p> */}
                <p className="text-sm text-secondary-foreground">{workspace.workspace_desc}</p>
                <p className="text-xs text-muted-foreground">Updated - {new Date(workspace.updated_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No workspaces found.</p>
        )}
      </div>
    </div>
  );
}