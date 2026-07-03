import { useState, useEffect, useRef } from "react"; // Added useRef
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Added Upload to the lucide-react imports
import { ArrowLeft, Github, Calendar, Users, ShieldAlert, UserCheck, Edit, Trash2, Save, X, Upload } from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
  email?: string;
  role?: string;
}

interface Project {
  id: number;
  name: string;
  groupName: string;
  abstractText: string;
  githubLink: string;
  startDate: string;
  endDate: string;
  technologies: string[];
  imageData?: string;
  mentorName?: string; 
  teamMembers?: TeamMember[];
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const userEmail = currentUser?.email || "";

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [isGroupMember, setIsGroupMember] = useState(false);
  
  // Edit Form Fields State
  const [editName, setEditName] = useState("");
  const [editAbstract, setEditAbstract] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editTech, setEditTech] = useState("");
  const [editImage, setEditImage] = useState("");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/projects/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
          setEditName(data.name || "");
          setEditAbstract(data.abstractText || "");
          setEditGithub(data.githubLink || "");
          setEditStartDate(data.startDate || "");
          setEditEndDate(data.endDate || "");
          setEditTech(data.technologies ? data.technologies.join(", ") : "");
          setEditImage(data.imageData || "");

          if (userEmail) {
            const isCreator = data.createdBy?.toLowerCase() === userEmail.toLowerCase();
            const isMember = data.teamMembers?.some(
              (m: TeamMember) => m.email?.toLowerCase() === userEmail.toLowerCase()
            );
            setIsGroupMember(isCreator || isMember);
          }
        } else {
          console.error("Failed to fetch project details from DB.");
        }
      } catch (error) {
        console.error("Error retrieving individual project details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectDetails();
    }
  }, [id, userEmail]);

  const handleUpdate = async () => {
    try {
      const techArray = editTech.split(",").map(t => t.trim()).filter(t => t !== "");
      const payload = {
        ...project,
        name: editName,
        abstractText: editAbstract,
        githubLink: editGithub,
        startDate: editStartDate,
        endDate: editEndDate,
        technologies: techArray,
        imageData: editImage
      };

      const response = await fetch(`http://localhost:8080/api/projects/${id}?email=${encodeURIComponent(userEmail)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updatedData = await response.json();
        toast.success("Project updated successfully");
        setProject(updatedData);
        setIsEditing(false);
      } else {
        alert("Failed to update project data workspace configurations.");
      }
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  const handleDelete = async() => {
    toast("Delete Project?", {
      description: "Are you sure? This action cannot be undone.",
      duration: Infinity, // Keeps toast open until user clicks an action
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const response = await fetch(`http://localhost:8080/api/projects/${id}?email=${encodeURIComponent(userEmail)}`, {
              method: "DELETE"
            });

            if (response.ok) {
              toast.success("Project successfully removed.");
              navigate("/dashboard"); 
            } else {
              toast.error("Failed to delete project.");
            }
          } catch (err) {
            console.error("Delete Error:", err);
            toast.error("An unexpected error occurred.");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => toast.dismiss(),
      },
    });
};

  //File upload
  const handleUploadClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImage(reader.result as string); // Fixed: changed from setProfileImage
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const isValidGithubLink = (url: string | undefined): boolean => {
    if (!url) return false;
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+/;
    return githubRegex.test(url.trim());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/10">
        <div className="text-center text-muted-foreground animate-pulse text-lg">
          Loading workspace configuration...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/10">
        <div className="text-center bg-card rounded-xl p-8 border shadow-sm max-w-md">
          <p className="text-destructive font-medium mb-4">Project Workspace data could not be found.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const technologiesList = project.technologies || [];
  const teamMembersList = project.teamMembers || [];
  const totalGroupCount = teamMembersList.length + (project.mentorName ? 1 : 0);
  const githubValid = isValidGithubLink(project.githubLink);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        
        {/* Top Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {isGroupMember && !isEditing && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          )}
        </div>

        <Card className="overflow-hidden shadow-elevated">
          {/* Hidden HTML Input Element */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          {/* Banner Image Wrapper */}
          <div 
            className="aspect-[21/9] overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 relative cursor-pointer group"
            onClick={handleUploadClick}
          >
            {isEditing ? (
              <>
                {editImage ? (
                  <img src={editImage} alt={editName} className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted/40 group-hover:bg-muted/60 transition-colors">
                    <span className="text-xl font-medium text-muted-foreground/60">{editName || "Project Preview"}</span>
                  </div>
                )}
                {/* Visual indicator overlay shown when hovering in edit mode */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-2 text-white font-medium">
                  <Upload className="h-5 w-5" />
                  <span>Upload Image</span>
                </div>
              </>
            ) : project.imageData ? (
              <img src={project.imageData} alt={project.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/40">
                <span className="text-2xl md:text-4xl font-bold text-muted-foreground/60">{project.name}</span>
              </div>
            )}
          </div> {/* Fixed: Added missing closing tag for the banner container */}

          <div className="p-8 md:p-12">
            <span className="text-xs font-bold tracking-widest text-primary uppercase block mb-1">
              {project.groupName}
            </span>

            {isEditing ? (
              /* --- EDIT STATE WORKSPACE --- */
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">Project Title</label>
                  <input className="w-full p-2 border rounded mt-1 bg-background" value={editName} onChange={(e) => setEditName(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground">Start Date</label>
                    <input type="date" className="w-full p-2 border rounded mt-1 bg-background" value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground">End Date</label>
                    <input type="date" className="w-full p-2 border rounded mt-1 bg-background" value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">Abstract Description</label>
                  <textarea rows={4} className="w-full p-2 border rounded mt-1 bg-background whitespace-pre-wrap" value={editAbstract} onChange={(e) => setEditAbstract(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">Technologies (comma separated)</label>
                  <input className="w-full p-2 border rounded mt-1 bg-background" value={editTech} onChange={(e) => setEditTech(e.target.value)} placeholder="React, Spring Boot, MySQL" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">GitHub Link</label>
                  <input className="w-full p-2 border rounded mt-1 bg-background" value={editGithub} onChange={(e) => setEditGithub(e.target.value)} />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleUpdate} className="bg-primary text-primary-foreground"><Save className="mr-2 h-4 w-4" /> Save Modifications</Button>
                  <Button variant="ghost" onClick={() => setIsEditing(false)}><X className="mr-2 h-4 w-4" /> Cancel</Button>
                </div>
              </div>
            ) : (
              /* --- VIEW STATE WORKSPACE --- */
              <>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {project.name}
                </h1>

                {/* Metadata Badges */}
                <div className="flex flex-wrap gap-4 mb-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : "TBD"} -{" "}
                      {project.endDate ? new Date(project.endDate).toLocaleDateString() : "TBD"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{totalGroupCount} Members</span>
                  </div>
                </div>

                {/* Abstract Section */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Abstract</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {project.abstractText || "No context summary description available for this workspace."}
                  </p>
                </section>

                {/* Technologies Section */}
                {technologiesList.length > 0 && (
                  <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Technologies Used</h2>
                    <div className="flex flex-wrap gap-2">
                      {technologiesList.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}

                {/* GitHub Link Validation */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Repository</h2>
                  {githubValid ? (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                    >
                      <Github className="h-5 w-5" />
                      View on GitHub
                    </a>
                  ) : (
                    <Card className="border-dashed border-destructive/40 bg-destructive/5">
                      <CardContent className="p-4 flex flex-col sm:flex-items-center sm:flex-row justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <ShieldAlert className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-destructive">Invalid or Missing Repository Link</p>
                            <p className="text-xs text-muted-foreground">This project hasn't provided a valid GitHub URL link configuration yet.</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </section>

                {/* Mentor & Team Members UI Display Section */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">Group Assignments</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Mentor Card */}
                    {project.mentorName ? (
                      <Card className="p-4 border-l-4 border-l-primary bg-primary/5 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                            <UserCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">{project.mentorName}</h3>
                            <p className="text-xs font-medium text-primary uppercase tracking-wider">Project Mentor</p>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <Card className="p-4 border-dashed flex items-center justify-center text-sm text-muted-foreground">
                        No Mentor Assigned
                      </Card>
                    )}

                    {/* Team Members List */}
                    {teamMembersList.map((member) => (
                      <Link key={member.id} to={`/profile/${member.id}`} className="group">
                        <Card className="p-4 hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold">
                              {member.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div>
                              <h3 className="font-semibold group-hover:text-primary transition-colors">
                                {member.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {member.role || "Team Member"}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetail;