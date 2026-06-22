import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, User, MessageCircle, Calendar } from "lucide-react";

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

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/projects/all");
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    navigate("/auth");
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10 shadow-soft">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Student Guidance
            </h1>

            <div className="flex items-center gap-4">
              <div className="relative w-96 hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/my-profile")}>My Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/my-requests")}>My Requests</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/my-projects")}>My Projects</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/mentors-mentees")}>My Mentors & Mentees</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">Log Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Current Projects</h2>
          <p className="text-muted-foreground">Explore ongoing projects and collaborations</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading database projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No projects found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                  {project.imageData ? (
                    <img src={project.imageData} alt={project.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                  )}
                </div>
                <CardContent className="p-6">
                  <span className="text-xs font-semibold tracking-wide text-primary uppercase">{project.groupName}</span>
                  <h3 className="text-xl font-bold mt-1 mb-2">{project.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.abstractText}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{project.startDate} to {project.endDate}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button onClick={() => navigate(`/project/${project.id}`)} className="w-full" variant="outline">
                    Explore
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Button onClick={() => navigate("/chat")} size="icon" className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-elevated">
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Dashboard;