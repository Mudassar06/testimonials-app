"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function WorkspacePage() {
  const { name } = useParams<{ name: string }>();
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [currentTestimonials, setCurrentTestimonials] = useState<any[]>([]);
  const [fetchedCurrentTestimonials, setFetchedCurrentTestimonials] = useState<any[]>([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);

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

  useEffect(() => {
    // Fetch current testimonials for the workspace
    const fetchCurrentTestimonials = async () => {
      if (workspace) {
        try {
          const response = await axios.get(
            `/api/getCurrentTestimonials?w_id=${workspace.id}`
          );
          setFetchedCurrentTestimonials(response.data); // Set current testimonials directly from response
        } catch (err) {
          console.error("Error fetching current testimonials:", err);
        }
      }
    };

    fetchCurrentTestimonials();
  }, [workspace, currentTestimonials]);

  const handleCheckboxChange = (testimonialId: string) => {
    setCurrentTestimonials(
      (prevSelected) =>
        prevSelected.includes(testimonialId)
          ? prevSelected.filter((id) => id !== testimonialId) // Uncheck
          : [...prevSelected, testimonialId] // Check
    );
  };

  const toggleCheckboxVisibility = () => {
    setShowCheckboxes(!showCheckboxes);
  };

  const confirmCurrentTestimonials = async () => {
    try {
      currentTestimonials.map((testimonial_id: string) =>
        console.log("w_id:", workspace.id, "t_id:", testimonial_id, "IDIUHWDIH")
      );
      const response = await axios.post("/api/setCurrentTestimonials", {
        w_id: workspace.id,
        testimonial_ids: currentTestimonials,
      });

      console.log("Current testimonials confirmed:", response.data);
      setCurrentTestimonials([]); 
      setShowCheckboxes(false);
    } catch (error) {
      console.error("Error confirming current testimonials:", error);
    }
  };

  // Check if a testimonial is already in the fetchedCurrentTestimonials array
  const isTestimonialInCurrentTestimonials = (testimonialId: string) => {
    return fetchedCurrentTestimonials.some(
      (testimonial) => testimonial.testimonials.testimonial_id === testimonialId
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Workspace Name: {workspace.w_name}
        </h1>
        <p className="text-lg font-bold text-foreground">
          Title: {workspace.workspace_title}
        </p>
        <p className="text-md font-bold text-foreground">
          Description: {workspace.workspace_desc}
        </p>
      </div>
      <h2 className="text-lg font-bold mb-4">My Testimonials</h2>
      <div className="flex justify-between mb-4">
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded"
          onClick={toggleCheckboxVisibility}
        >
          {showCheckboxes ? "Hide Checkboxes" : "Current Testimonials"}
        </button>
        {showCheckboxes && (
          <button
            className="bg-primary text-primary-foreground px-4 py-2 rounded"
            onClick={confirmCurrentTestimonials}
          >
            Confirm Current Testimonials
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.length > 0 ? (
          testimonials.map((testimonial) => (
            <div
              key={testimonial.testimonial_id}
              className="bg-card border border-border p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl relative"
            >
              {showCheckboxes && (
                <input
                  type="checkbox"
                  className="absolute top-2 right-2"
                  checked={currentTestimonials.includes(
                    testimonial.testimonial_id
                  ) || isTestimonialInCurrentTestimonials(testimonial.testimonial_id)}
                  onChange={() =>
                    handleCheckboxChange(testimonial.testimonial_id)
                  }
                />
              )}
              <p className="font-semibold text-lg text-foreground">
                {testimonial.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {testimonial.email}
              </p>
              <p className="text-sm text-foreground">
                Rating: {testimonial.rating}
              </p>
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
      <div>
        <h2 className="text-lg font-bold mb-4">Current Testimonials</h2>
        {fetchedCurrentTestimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fetchedCurrentTestimonials.map((testimonial) => (
              <div
                key={testimonial.testimonials.testimonial_id}
                className="bg-card border border-border p-4 rounded-lg shadow-lg"
              >
                <p className="font-semibold text-lg text-foreground">
                  {testimonial.testimonials.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.testimonials.email}
                </p>
                <p className="text-sm text-foreground">
                  Rating: {testimonial.testimonials.rating}
                </p>
                <p className="mt-2 text-base text-foreground">
                  {testimonial.testimonials.content}
                </p>
                <p className="text-xs text-muted-foreground">
                  Type: {testimonial.testimonials.content_type}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No current testimonials found for this workspace.</p>
        )}
      </div>
    </div>
  );
}