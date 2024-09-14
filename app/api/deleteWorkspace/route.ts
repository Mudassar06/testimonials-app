import { NextResponse } from "next/server";
import { DeleteWorkspaceRequest } from "@/lib/types";
import { createClient } from '@/utils/supabase/client'
import { createClient as createSsrClient } from "@/utils/supabase/server";

export async function DELETE(request: Request) {
    const supabase = createClient();
    const supabaseSsr = createSsrClient();
    const { data: { user } } = await supabaseSsr.auth.getUser();
    // console.log(user?.id,"USERID");

    try {

        if (!request.body) {
            return NextResponse.json({ error: 'Request body is missing' }, { status: 400 });
        }
        const body = await request.json();
        console.log('Received body:', body);

        const { id }: DeleteWorkspaceRequest = body;
        // console.log("kaendfdiehfif", w_name, workspace_title, workspace_desc )
        console.log("ID_WS ",id)
        if (!id ) {
          return NextResponse.json({ error: 'Missing id field' }, { status: 400 });
        }
        // Check if workspace name already exists
        const { data: existingWorkspace } = await supabase
            .from('workspaces')
            .select('id')
            .eq('id', id)
            .single();

        if (!existingWorkspace) {
            return NextResponse.json({ error: 'Workspace does not exists' }, { status: 400 });
        }
    
        const { error } = await supabase
          .from('workspaces')
          .delete()
          .eq('id', id)
    
        if (error) {
            console.log("DELETE ERROR ",error)
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
    
        return NextResponse.json({ msg: 'Workspace deleted' }, { status: 200 });
      } catch (error) {
        console.log("HUHWDU",error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }
}