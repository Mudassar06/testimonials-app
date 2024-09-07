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
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated user.
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      <div>
        <Link
          href="/protected/create-workspace"
          className="mb-2 rounded-md border border-foreground/20 px-4 py-2 text-center text-foreground no-underline"
        >
          Create Workspace
        </Link>
      </div>
      <div>
        <h1 className="font-bold text-2xl mb-4">My Workspaces</h1>
        {workspaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.map((workspace) => (
              <div key={workspace.id} className="bg-card border border-border p-4 rounded-lg shadow-lg">
                <h3 className="font-semibold text-lg text-foreground">{workspace.workspace_title}</h3>
                <p className="text-sm text-muted-foreground">Name: {workspace.w_name}</p>
                <p className="text-sm text-muted-foreground">Description: {workspace.workspace_desc}</p>
                <p className="text-sm text-muted-foreground">Created At: {new Date(workspace.created_at).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Updated At: {new Date(workspace.updated_at).toLocaleString()}</p>
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