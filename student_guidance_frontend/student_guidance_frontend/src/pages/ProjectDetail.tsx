import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Github, Calendar, Users, ShieldAlert, UserCheck } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
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
  // Relational data properties from DB mapping
  mentorName?: string; 
  teamMembers?: TeamMember[];
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/projects/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
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
  }, [id]);

  // Helper function to validate GitHub URLs
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
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="overflow-hidden shadow-elevated">
          {/* Banner Image */}
          <div className="aspect-[21/9] overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 relative">
            {project.imageData ? (
              <img src={project.imageData} alt={project.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/40">
                <span className="text-2xl md:text-4xl font-bold text-muted-foreground/60">{project.name}</span>
              </div>
            )}
          </div>

          <div className="p-8 md:p-12">
            <span className="text-xs font-bold tracking-widest text-primary uppercase block mb-1">
              {project.groupName}
            </span>
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

            {/* GitHub Validation / Redirection Fallback */}
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
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetail;