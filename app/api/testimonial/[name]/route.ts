//For checking weather the workspace exists for the testimonial
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/client';

export async function GET(request: Request, { params }: { params: { name: string } }) {
    const supabase = createClient();
    const { name } = params;
    try {
        const { data, error } = await supabase
            .from('workspaces') 
            .select('*') //Consider sending just the data that is enough to be exposed (keep the id)
            .eq('w_name', name)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'No workspace for testimonial found' }, { status: 404 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}