//For checking if the workspace belongs to the current user
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/client';
import { createClient as createSsrClient } from "@/utils/supabase/server";

export async function GET(request: Request, { params }: { params: { name: string } }) {
    const supabase = createClient();
    const supabaseSsr = createSsrClient();
    const { data: { user } } = await supabaseSsr.auth.getUser();
    const { name } = params;
    try {
        const { data, error } = await supabase
            .from('workspaces')
            .select('*')
            .eq('w_name', name)
            .eq('admin', user?.id)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}