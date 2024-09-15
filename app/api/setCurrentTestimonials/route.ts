import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function POST(request: Request) {

    const supabase = createClient();

    try {
        const { w_id, testimonial_ids,action } = await request.json();
        
        if (!action || !w_id || !testimonial_ids || !Array.isArray(testimonial_ids)) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }
       
        // [1,2,3]
        console.log(testimonial_ids,' -- inc')


        if(action == 'REMOVE'){
            console.log('delete',testimonial_ids)
            const { error:deleteError } = await supabase.from("current_testimonials").delete().in('testimonial_id', testimonial_ids)
            if (deleteError) {
                console.error("Error in setCurrentTestimonials API:", deleteError);
                return NextResponse.json({ error: deleteError.message }, { status: 500 });
            }
        }else if(action == 'ADD'){
        console.log('add')
        const { data, error } = await supabase
            .from("current_testimonials")
            .insert(
                testimonial_ids?.map((testimonial_id: any) => {
                    
                        return {
                            w_id,
                            testimonial_id,
                        }
                })
            );
            if (error) {
                console.error("Error in setCurrentTestimonials API:", error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
            return NextResponse.json({ data }, { status: 200 });
        }
        

        return NextResponse.json({ status: 200 });


    } catch (error) {

        return NextResponse.json({ error: "Internal server error" }, { status: 500 });

    }

}