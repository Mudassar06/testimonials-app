import { NextResponse } from "next/server";
import { CreateWorkspaceRequest } from "@/lib/types";
import { createClient } from '@/utils/supabase/client'
import { createClient as createSsrClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    const supabase = createClient();
    const supabaseSsr = createSsrClient();
    const { data: { user } } = await supabaseSsr.auth.getUser();
    console.log(user?.id,"USERID");

    try {

        const body = await request.json();
        // console.log('Received body:', body);

        const { w_name, workspace_title, workspace_desc }: CreateWorkspaceRequest = body;
        // console.log("kaendfdiehfif", w_name, workspace_title, workspace_desc )
        
        if (!w_name || !workspace_title) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if workspace name already exists
        const { data: existingWorkspace } = await supabase
            .from('workspaces')
            .select('w_name')
            .eq('w_name', w_name)
            .single();

        if (existingWorkspace) {
            return NextResponse.json({ error: 'Workspace name already exists' }, { status: 400 });
        }
    
        const { data, error } = await supabase
          .from('workspaces')
          .insert([
            {
              w_name,
              admin: user?.id,
              workspace_title,
              workspace_desc,
            },
          ]);
    
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
    
        return NextResponse.json({ msg: 'Workspace created' }, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }
}