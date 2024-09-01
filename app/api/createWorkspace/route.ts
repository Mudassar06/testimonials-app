import { NextResponse } from "next/server";
import { CreateWorkspaceRequest } from "@/lib/types";
import { createClient } from '@/utils/supabase/client'

export async function POST(request: Request) {
    const supabase = createClient();

    //SOLVE THIS: TAKE USERID DIRECTLY FROM SUPABASE.AUTH
    const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(user?.id);

    try {

        const body = await request.json();
        console.log('Received body:', body);

        const { w_name, workspace_title, workspace_desc }: CreateWorkspaceRequest = body;
        console.log("kaendfdiehfif", w_name, workspace_title, workspace_desc )
        
        if (!w_name || !workspace_title) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
    
        const { data, error } = await supabase
          .from('workspaces')
          .insert([
            {
              w_name,
              admin: 'acd69e4e-5c7e-402b-863f-a4c0421494ea',
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
