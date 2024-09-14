"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
export default function WorkspacePage() {
  const { name } = useParams<{ name: string }>();
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [currentTestimonials, setCurrentTestimonials] = useState<any[]>([]);
  const [fetchedCurrentTestimonials, setFetchedCurrentTestimonials] = useState<any[]>([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const router = useRouter();

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

  //DELETE WORKSPACE
  const deleteWorkspace = async () =>{
    try{
      const response = await axios.delete('/api/deleteWorkspace', {data: {id: workspace.id }} );

      if(response.status == 200){
        router.push('/protected');
      }
    }
    catch (error){
      console.error("Couldn't delete workspace", error);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>

      <div className="flex justify-between w-full items-center">
        <div>
        <h1 className="text-3xl font-bold text-foreground">
          {workspace.w_name}
        </h1>
        <p className="text-md  text-muted-foreground">
          {workspace.workspace_desc}
        </p>
        </div>
        <button onClick={deleteWorkspace}>DELETE WORKSPACE</button>
      </div>
      <div className="flex gap-8">


        {/* left layout */}
        <div className="">
          <h2 className="text-lg my-4 ">Current Testimonials</h2>
          {fetchedCurrentTestimonials.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 h-screen overflow-y-scroll custom-scroll px-2">
              {fetchedCurrentTestimonials.map((testimonial) => (
                <div
                  key={testimonial.testimonials.testimonial_id}
                  className="bg-card h-fit w-full border border-border p-4 rounded-lg shadow-lg"
                >
                  <p className="font-semibold text-lg text-foreground">
                    {testimonial.testimonials.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.testimonials.email}
                  {testimonial.rating}
                  </p>
                  <div className="flex gap-1">
                    {
                      Array(testimonial.rating).fill(0).map((e,i)=>{
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
            <p>No current testimonials found for this workspace.</p>
          )}
        </div>
        {/* right layout */}
        
        <div>

          <h2 className="text-lg my-4">My Testimonials</h2>
          <div className="flex justify-between mb-4">
            <button
              className="bg-primary text-primary-foreground px-4 py-2 rounded"
              onClick={toggleCheckboxVisibility}
            >
              {showCheckboxes ? "Cancel" : "Add Current Testimonials"}
            </button>
            {showCheckboxes && (
              <button
                className="bg-primary text-primary-foreground px-4 py-2 rounded"
                onClick={confirmCurrentTestimonials}
              >
                Add
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <div
                  key={testimonial.testimonial_id}
                  className="bg-card flex flex-col gap-1  h-fit border border-border p-4 rounded-lg shadow-lg transition-transform hover:shadow-xl relative"
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
                  <div className="flex gap-1">
                    {
                      Array(testimonial.rating).fill(0).map((e,i)=>{
                          return <div key={uuidv4()}>⭐</div>
                      })
                    }
                  </div>
                  <p className="mt-2 text-base text-foreground">
                    {testimonial.content}
                  </p>
                </div>

))
            ) : (
              <p>No testimonials found for this workspace.</p>
            )}
          </div>
        </div>

        

      </div>
    </div>

  );
}