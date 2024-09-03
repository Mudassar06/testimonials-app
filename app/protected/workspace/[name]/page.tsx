"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function WorkspacePage() {
  const { name } = useParams<{ name: string }>();
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [testimonials, setTestimonials] = useState<any[]>([]); // State to hold testimonials

  useEffect(() => {
    // Check whether the workspace exists for the given user
    const fetchWorkspace = async () => {
      try {
        const response = await axios.get(
          `/api/workspaces/${encodeURIComponent(name)}`
        );
        setWorkspace(response.data);
      } catch (err) {
        setError("Workspace not found");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [name]);

  useEffect(() => {
    // Fetch testimonials for the workspace
    const fetchTestimonials = async () => {
      if (workspace) {
        try {
          const response = await axios.get(
            `/api/readTestimonials?w_id=${workspace.id}`
          );
          setTestimonials(response.data);
        } catch (err) {
          console.error("Error fetching testimonials:", err);
        }
      }
    };

    fetchTestimonials();
  }, [workspace]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div>
        <h1>Workspace Name: {workspace.w_name}</h1>
        <p>Title: {workspace.workspace_title}</p>
        <p>Description: {workspace.workspace_desc}</p>
      </div>
      <h2 className="text-lg font-bold mb-4">My Testimonials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.length > 0 ? (
          testimonials.map((testimonial) => (
            <div
              key={testimonial.testimonial_id}
              className="bg-card p-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              <p className="font-semibold text-lg text-foreground">
                {testimonial.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {testimonial.email}
              </p>
              <p className="text-sm text-foreground">Rating: {testimonial.rating}</p>
              <p className="mt-2 text-base text-foreground">
                {testimonial.content}
              </p>
              <p className="text-xs text-muted-foreground">
                Type: {testimonial.content_type}
              </p>
            </div>
          ))
        ) : (
          <p>No testimonials found for this workspace.</p>
        )}
      </div>
    </div>
  );
}
