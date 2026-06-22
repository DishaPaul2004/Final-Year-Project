import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Calendar, FolderHeart, Plus } from "lucide-react";
import PostProjectDialog from "@/components/PostProjectDialog";

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
}

const MyProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Retrieve the email of the logged in user
   const storedUser = localStorage.getItem("user");
   const currentUser = storedUser ? JSON.parse(storedUser) : null;
   const userEmail = currentUser?.email || "";

  const fetchMyGroupProjects = async () => {
    if (!userEmail) {
      console.log("No user email");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/projects/my-projects?email=${encodeURIComponent(userEmail.trim())}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.error("Failed to fetch custom user projects. Status:", response.status);
      }
    } catch (error) {
      console.error("Error retrieving group projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGroupProjects();
  }, [userEmail]);

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      fetchMyGroupProjects();
    }
  };

  return (
    // Fixed combined CSS layout bug: py-8 px-6relative -> py-8 px-6 relative
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 py-8 px-6 relative">
      <div className="container mx-auto max-w-6xl">
        <Button variant="ghost" className="mb-6 flex items-center gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">My Group Projects</h2>
            <p className="text-muted-foreground">Projects tied to groups where you are a member or mentor</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading your team projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center bg-card rounded-xl p-12 border shadow-sm">
            <p className="text-muted-foreground mb-4">You are not associated with any active group projects.</p>
            <Button onClick={() => navigate("/dashboard")}>Explore All Projects</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300">
                <div className="aspect-video overflow-hidden bg-muted">
                  {project.imageData ? (
                    <img src={project.imageData} alt={project.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image available</div>
                  )}
                </div>
                <CardContent className="p-6">
                  <span className="text-xs font-semibold tracking-wide text-primary uppercase">{project.groupName}</span>
                  <h3 className="text-xl font-bold mt-1 mb-2">{project.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{project.abstractText}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies?.map((tech) => (
                      <span key={tech} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-3">
                    <Calendar className="h-4 w-4" />
                    <span>{project.startDate} to {project.endDate}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex gap-2">
                  <Button onClick={() => navigate(`/project/${project.id}`)} className="flex-1" variant="outline">
                    Explore
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Button 
        onClick={() => setIsDialogOpen(true)} 
        size="icon" 
        className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-lg z-50 hover:scale-105 transition-transform"
        title="Post New Project"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <PostProjectDialog 
        open={isDialogOpen} 
        onOpenChange={handleDialogChange} 
        creatorEmail={userEmail} 
      />
    </div>
  );
};

export default MyProjects;