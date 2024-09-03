//GET Testimonials based on the admin and it's workspace
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/client';

export async function GET(request: Request, { params }: { params: { w_id: string } }) {
    const supabase = createClient();
    const url = new URL(request.url);
    const w_id = url.searchParams.get('w_id');

    try {
        const { data: testimonials, error } = await supabase
            .from('testimonials')
            .select('*')
            .eq('w_id', w_id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(testimonials, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}