//INSERT TESTIMONIAL API
//API Called in /[name]/page.tsx
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/client';


export async function POST(request: Request) {
    const supabase = createClient();

    try {
        const body = await request.json();

        const { w_id, admin, content_type, content, rating, email, name } = body;

        // Validate required fields
        if (!w_id || !admin || !content_type || !content || !rating || !email || !name ) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        console.log(w_id, admin, content_type, content, rating, email, name);
        // Check if the workspace exists
        const { data: workspace, error: workspaceError } = await supabase
            .from('workspaces')
            .select('id')
            .eq('id', w_id)
            .single();

        if (workspaceError || !workspace) {
            console.log("ERROR:", workspaceError);
            return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
        }

        // Insert the testimonial
        const { data, error } = await supabase
            .from('testimonials')
            .insert([
                {
                    w_id,
                    admin,
                    content_type,
                    content,
                    rating,
                    email,
                    name
                },
            ]);

        if (error) {
            console.log("ERROR",error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ msg: 'Testimonial created' }, { status: 201 });
    } catch (error) {
        console.log("ERROR",error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}