"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
export default function Testimonials(){

  const [fetchedCurrentTestimonials, setFetchedCurrentTestimonials] = useState<any[]>([]);
  const params = useParams()
 
  useEffect(() => {
    // Fetch current testimonials for the workspace
    const fetchCurrentTestimonials = async () => {
        const workspace_id = params.w_id
        try {
          const response = await axios.get(
            `/api/getCurrentTestimonials?w_id=${workspace_id}`
          );
          setFetchedCurrentTestimonials(response.data); // Set current testimonials directly from response
        } catch (err) {
          console.error("Error fetching current testimonials:", err);
        }
    };
    
    fetchCurrentTestimonials();
  }, []);


  return (
      <div className="flex gap-8">
        <div className="">
          {fetchedCurrentTestimonials.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-1 lg:grid-cols-4 gap-4 h-fit overflow-y-scroll custom-scroll">
              {fetchedCurrentTestimonials.map((testimonial) => (
                <div
                  key={testimonial.testimonials.testimonial_id + 'current'}
                  className="bg-card h-fit w-full border border-border p-4 rounded-lg shadow-lg relative flex flex-col gap-1"
                >
                                     
                  <p className="font-semibold text-lg text-foreground">
                    {testimonial.testimonials.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.testimonials.email}
                  </p>
                  
                  <div className="flex gap-1">
                    {
                      Array(testimonial.testimonials.rating).fill(0).map((e,i)=>{
                          return <div key={uuidv4()}>⭐</div>
                      })
                    }
                  </div>
                  <p className="mt-2 text-base text-foreground">
                    {testimonial.testimonials.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No current testimonials found for this workspace.</p>
          )}
        </div>
        </div>
)
}