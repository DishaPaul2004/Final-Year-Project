import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, X, Upload } from "lucide-react";

interface PostProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creatorEmail: string;
}

// Retrieve the email of the logged in user
   const storedUser = localStorage.getItem("user");
   const currentUser = storedUser ? JSON.parse(storedUser) : null;
   const userEmail = currentUser?.email || "";

const PostProjectDialog = ({ open, onOpenChange, creatorEmail }: PostProjectDialogProps) => {
  const [projectData, setProjectData] = useState({
    name: "",
    groupName: "",
    abstract: "",
    githubLink: "",
    startDate: "",
    endDate: "",
  });
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [myGroups, setMyGroups] = useState<any[]>([]);

  useEffect(() => {
    const activeEmail = creatorEmail || userEmail;
    if (open && activeEmail) {
      fetch(`http://localhost:8080/api/group-chat/my-groups?email=${activeEmail}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setMyGroups(data);
          }
        })
        .catch((err) => {
          console.error("Error fetching group lists:", err);
          toast.error("Could not load your group lists.");
        });
    }
  }, [open, creatorEmail, userEmail]);

  const addTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput("");
    }
  };

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  // 🆕 Handle local image capture and convert to base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image file size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (
      !projectData.name || 
      !projectData.groupName || 
      !projectData.abstract || 
      !projectData.startDate || 
      !projectData.endDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectData.name,
          groupName: projectData.groupName,
          abstractText: projectData.abstract,
          githubLink: projectData.githubLink,
          startDate: projectData.startDate,
          endDate: projectData.endDate,
          technologies: technologies,
          createdBy: creatorEmail || userEmail,
          imageData: imagePreview, // 🆕 Appended field configuration
        }),
      });

      if (response.ok) {
        toast.success("Project posted successfully!");
        onOpenChange(false);
        
        setProjectData({
          name: "",
          groupName: "",
          abstract: "",
          githubLink: "",
          startDate: "",
          endDate: "",
        });
        setTechnologies([]);
        setImagePreview("");
      } else {
        toast.error("Failed to post project details onto the server.");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Network communication failure.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post New Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Image Handler */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 overflow-hidden border">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Upload className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange} 
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              {imagePreview ? "Change Project Image" : "Upload Project Image"}
            </Button>
          </div>

          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name *</Label>
            <Input
              id="projectName"
              placeholder="Enter project name"
              value={projectData.name}
              onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
            />
          </div>

          {/* Group Name Field */}
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name *</Label>
            <select
              id="groupName"
              value={projectData.groupName}
              onChange={(e) => setProjectData({ ...projectData, groupName: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
            >
              <option value="" disabled className="text-muted-foreground">
                {myGroups.length === 0 ? "Loading your groups..." : "Select project team/group"}
              </option>
              {myGroups.map((group) => (
                <option key={group.id} value={group.groupName} className="text-foreground">
                  {group.groupName}
                </option>
              ))}
            </select>
          </div>

          {/* Abstract */}
          <div className="space-y-2">
            <Label htmlFor="abstract">Abstract *</Label>
            <Textarea
              id="abstract"
              placeholder="Describe your project..."
              rows={4}
              value={projectData.abstract}
              onChange={(e) => setProjectData({ ...projectData, abstract: e.target.value })}
            />
          </div>

          {/* Technologies */}
          <div className="space-y-2">
            <Label>Technologies Used</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add technology (e.g., React, Spring Boot)"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
              />
              <Button type="button" onClick={addTechnology} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="pr-1">
                  {tech}
                  <button onClick={() => removeTechnology(tech)} className="ml-2 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* GitHub Link */}
          <div className="space-y-2">
            <Label htmlFor="github">GitHub Repository</Label>
            <Input
              id="github"
              type="url"
              placeholder="https://github.com/username/repo"
              value={projectData.githubLink}
              onChange={(e) => setProjectData({ ...projectData, githubLink: e.target.value })}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={projectData.startDate}
                onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={projectData.endDate}
                onChange={(e) => setProjectData({ ...projectData, endDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Post Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostProjectDialog;