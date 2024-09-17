"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
export default function WorkspacePage() {
  const { name } = useParams<{ name: string }>();
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [currentTestimonials, setCurrentTestimonials] = useState<any[]>([]);
  const [deleteTestimonials, setDeleteTestimonials] = useState<any[]>([]);
  const [fetchedCurrentTestimonials, setFetchedCurrentTestimonials] = useState<
    any[]
  >([]);
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

  useEffect(() => {
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

  const handleDeleteCheckboxChange = (testimonialId: string) => {
    console.log(deleteTestimonials);
    setDeleteTestimonials(
      (prevSelected) =>
        prevSelected.includes(testimonialId)
          ? prevSelected.filter((id) => id !== testimonialId) // Uncheck
          : [...prevSelected, testimonialId] // Check
    );
  };
  const toggleCheckboxVisibility = () => {
    setShowCheckboxes(!showCheckboxes);
  };

  const confirmCurrentTestimonials = async (action: string) => {
    console.log(action, "--action", deleteTestimonials);
    try {
      currentTestimonials.map((testimonial_id: string) =>
        console.log("w_id:", workspace.id, "t_id:", testimonial_id, "IDIUHWDIH")
      );
      const response = await axios.post("/api/setCurrentTestimonials", {
        w_id: workspace.id,
        testimonial_ids:
          action == "REMOVE"
            ? deleteTestimonials
            : action == "ADD" && currentTestimonials,
        action,
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
  const deleteWorkspace = async () => {
    try {
      const response = await axios.delete("/api/deleteWorkspace", {
        data: { id: workspace.id },
      });

      if (response.status == 200) {
        router.push("/protected");
      }
    } catch (error) {
      console.error("Couldn't delete workspace", error);
    }
  };

  const deleteTests = async () => {
    try {

      const response = await axios.delete("/api/deleteTestimonial", {
        data: { 
          w_id: workspace.id,
          testimonial_ids: currentTestimonials,
         },
      });

      if (response.status === 200) {
        console.log("Testimonials deleted successfully");
          setCurrentTestimonials([]);
  
        // Refetch the testimonials after deletion
        await fetchTestimonials(); 
      }
    } catch (error) {
      console.error("Couldn't delete testimonial", error);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const copyCodeToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  };

  const codeSnippet = `
    <div>
      <iframe className="w-screen" src="http://localhost:3000/testimonials/${workspace.id}" ></iframe>
    </div>
  `;

  return (
    <div>
      <div className="flex justify-between w-full items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {workspace.workspace_title}
          </h1>
          <p className="text-md  text-muted-foreground">
            {workspace.workspace_desc} -- <br></br>
            {workspace.id}
          </p>
        </div>
        <button className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded" onClick={deleteWorkspace}>DELETE WORKSPACE</button>
      </div>
      <div>
        <a
          href={`http://localhost:3000/${workspace.w_name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary/80 transition-colors"
        >
          Sharable Link
        </a>
      </div>
      <div className="flex gap-8">
        {/* left layout */}
        <div className="">
          <div className="w-full flex justify-between items-center gap-4">
            <h2 className="text-lg my-4 ">Current Testimonials</h2>
            <button
              className="text-destructive-foreground bg-destructive rounded text-sm h-fit px-2 py-1"
              onClick={() => confirmCurrentTestimonials("REMOVE")}
            >
              Remove
            </button>
          </div>
          {fetchedCurrentTestimonials.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 h-fit overflow-y-scroll custom-scroll">
              {fetchedCurrentTestimonials.map((testimonial) => (
                <div
                  key={testimonial.testimonials.testimonial_id + "current"}
                  className="bg-card h-fit w-full border border-border p-4 rounded-lg shadow-lg relative flex flex-col gap-1"
                >
                  <input
                    type="checkbox"
                    className="absolute top-2 right-2"
                    defaultChecked={deleteTestimonials.includes(
                      testimonial.testimonials.testimonial_id
                    )}
                    onChange={(e) => {
                      handleDeleteCheckboxChange(
                        testimonial.testimonials.testimonial_id
                      );
                    }}
                  />
                  <p className="font-semibold text-lg text-foreground">
                    {testimonial.testimonials.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.testimonials.email}
                  </p>

                  <div className="flex gap-1">
                    {Array(testimonial.testimonials.rating)
                      .fill(0)
                      .map((e, i) => {
                        return <div key={uuidv4()}>⭐</div>;
                      })}
                  </div>
                  <p className="mt-2 text-base text-foreground">
                    {testimonial.testimonials.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No current testimonials found for this workspace.
            </p>
          )}
        </div>
        {/* right layout */}

        <div>
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-lg my-4">My Testimonials</h2>

            <button
              className="text-background bg-foreground rounded text-sm h-fit px-2 py-1"
              onClick={() => confirmCurrentTestimonials("ADD")}
            >
              Add
            </button>
            <button
              className="text-background bg-foreground rounded text-sm h-fit px-2 py-1"
              onClick={deleteTests}
            >
              Delete testimonials
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial) => {
                return (
                  !fetchedCurrentTestimonials
                    .map(
                      (testimonial) => testimonial.testimonials.testimonial_id
                    )
                    .includes(testimonial.testimonial_id) && (
                    <div
                      key={testimonial.testimonial_id}
                      className="bg-card flex flex-col gap-1  h-fit border border-border p-4 rounded-lg shadow-lg transition-transform hover:shadow-xl relative"
                    >
                      <input
                        type="checkbox"
                        className="absolute top-2 right-2"
                        defaultChecked={currentTestimonials.includes(
                          testimonial.testimonial_id
                        )}
                        onChange={(e) => {
                          handleCheckboxChange(testimonial.testimonial_id);
                        }}
                      />
                      <p className="font-semibold text-lg text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.email}
                      </p>
                      <div className="flex gap-1">
                        {Array(testimonial.rating)
                          .fill(0)
                          .map((e, i) => {
                            return <div key={uuidv4()}>⭐</div>;
                          })}
                      </div>
                      <p className="mt-2 text-base text-foreground">
                        {testimonial.content}
                      </p>
                    </div>
                  )
                );
              })
            ) : (
              <p className="text-muted-foreground">
                No testimonials found for this workspace.
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-foreground">Code Snippet</h2>
          <button
            className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded"
            onClick={() => copyCodeToClipboard(codeSnippet)}
          >
            Copy Code
          </button>
        </div>
        <pre className="bg-muted text-muted-foreground rounded-lg p-4 mt-4 overflow-x-auto">
          <code>{codeSnippet}</code>
        </pre>
      </div>
    </div>
  );
}
