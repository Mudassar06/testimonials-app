import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function POST(request: Request) {
    const supabase = createClient();

    try {
        const { w_id, testimonial_ids } = await request.json();

        if (!w_id || !testimonial_ids || !Array.isArray(testimonial_ids)) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("current_testimonials")
            .insert(
                testimonial_ids.map((testimonial_id: string) => ({
                    w_id,
                    testimonial_id,
                }))
            );

        if (error) {
            console.error("Error in setCurrentTestimonials API:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        // console.error("Error in setCurrentTestimonials API:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}