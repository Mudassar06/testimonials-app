import { NextResponse } from "next/server";
import { DeleteWorkspaceRequest } from "@/lib/types";
import { createClient } from '@/utils/supabase/client'
import { createClient as createSsrClient } from "@/utils/supabase/server";

export async function DELETE(request: Request) {
    const supabase = createClient();
    const supabaseSsr = createSsrClient();
    const { data: { user } } = await supabaseSsr.auth.getUser();

    try {

        const { w_id, testimonial_ids } = await request.json();
        
        if (!w_id || !testimonial_ids || !Array.isArray(testimonial_ids)) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const { error } = await supabase
          .from('testimonials')
          .delete()
          .in('testimonial_id', testimonial_ids);
    
        if (error) {
            console.log("DELETE ERROR ",error)
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
    
        return NextResponse.json({ msg: 'Testimonial deleted' }, { status: 200 });
      } catch (error) {
        console.log("ERROR",error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }
}