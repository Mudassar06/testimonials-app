// GET Current Testimonials details based on the workspace
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/client';

export async function GET(request: Request) {
    const supabase = createClient();
    const url = new URL(request.url);
    const w_id = url.searchParams.get('w_id');

    try {
        // Fetch current testimonials and join with the testimonials table
        const { data: currentTestimonials, error: currentError } = await supabase
            .from('current_testimonials')
            .select('testimonials(*)')
            .eq('w_id', w_id);

        if (currentError) {
            return NextResponse.json({ error: currentError.message }, { status: 500 });
        }

        return NextResponse.json(currentTestimonials, { status: 200 });
    } catch (error) {
        console.error("Error fetching current testimonials:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}