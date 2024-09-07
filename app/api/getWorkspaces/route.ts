//GET Workspaces based on the admin
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/client';
import { createClient as createSsrClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
    const supabase = createClient();

    const supabaseSsr = createSsrClient();
    const { data: { user } } = await supabaseSsr.auth.getUser();
    const admin = user?.id;

    try {
        const { data: workspaces, error } = await supabase
            .from('workspaces')
            .select('*')
            .eq('admin', admin);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(workspaces, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}