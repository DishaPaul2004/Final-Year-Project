import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Star, Plus, X, Upload, ArrowLeft, Pencil } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const MyProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); 
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [experiences, setExperiences] = useState<any[]>([]);
  const [currentExp, setCurrentExp] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    batch: "",
    githubLink: "",
    linkedinLink: "",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //Decode JWT and fetch existing profile
  useEffect(() => {
    const data = localStorage.getItem("token");
    if (data) {
      try {
        const decoded: any = jwtDecode(data);
        const userEmail = decoded.sub;
        const userName = decoded.name || "";
        setProfileData((prev) => ({
          ...prev,
          name: userName,
          email: userEmail,
        }));

        fetchProfile(userEmail);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const fetchProfile = async (email: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/my-profile/${email}`);
      if (res.ok) {
        const data = await res.json();
        setProfileData((prev) => ({
          ...prev,
          phone: data.phone || "",
          batch: data.batch || "",
          githubLink: data.githubLink || "",
          linkedinLink: data.linkedinLink || "",
        }));

        setSkills(data.skills ? JSON.parse(data.skills) : []);
        setExperiences(data.experiences ? JSON.parse(data.experiences) : []);
        setProfileImage(data.profileImageUrl || null);
      } else {
        console.log("No profile found for this user.");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  //Skills handlers
  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) =>
    setSkills(skills.filter((s) => s !== skill));

  //Experience handlers
  const addExperience = () => {
    if (currentExp.title && currentExp.startDate) {
      setExperiences([...experiences, currentExp]);
      setCurrentExp({ title: "", description: "", startDate: "", endDate: "" });
    }
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
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
        setProfileImage(reader.result as string); 
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  //Save Profile
  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");
    const decoded: any = jwtDecode(token || "");
    const email = decoded.sub;

    const profileDataToSend = {
      phone: profileData.phone,
      batch: profileData.batch,
      githubLink: profileData.githubLink,
      linkedinLink: profileData.linkedinLink,
      skills: JSON.stringify(skills),
      experiences: JSON.stringify(experiences),
      profileImageUrl: profileImage || "",
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/my-profile/save?email=${email}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profileDataToSend),
        }
      );
      if (res.ok) {
        toast.success("Profile saved successfully!");
        setIsEditing(false);
        fetchProfile(email);
      } else {
        toast.error("Failed to save profile");
      }
    } catch (err) {
      console.log("Error : " + err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-6">
      <div className="max-w-4xl mx-auto relative">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="p-8 shadow-elevated relative">
          {/* Edit / Save button */}
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => {
              if (isEditing) handleSaveProfile();
              else setIsEditing(true);
            }}
            className="absolute top-6 right-6 flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            {isEditing ? "Save" : "Edit"}
          </Button>

          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground mb-8">
            {isEditing
              ? "You can edit your profile details below."
              : "View your saved profile details."}
          </p>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-8">
            {/* Left - Info */}
            <div className="flex flex-col w-full md:w-1/2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={profileData.name}
                  readOnly
                  className="bg-muted cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email ID</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  readOnly
                  className="bg-muted cursor-not-allowed"
                />
              </div>
            </div>

            {/* Right - Image */}
            <div
              className="flex flex-col items-center w-full md:w-1/2 cursor-pointer"
              onClick={handleUploadClick}
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 overflow-hidden border border-gray-300 relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              {isEditing && (
                <Button variant="outline" size="sm">
                  Upload Profile Picture
                </Button>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* Profile Content */}
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  readOnly={!isEditing}
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label>Batch</Label>
                <Input
                  type="text"
                  readOnly={!isEditing}
                  value={profileData.batch}
                  onChange={(e) =>
                    setProfileData({ ...profileData, batch: e.target.value })
                  }
                  className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <Label>Skills</Label>
              {isEditing ? (
                <>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill (e.g., React, Java)"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addSkill())
                      }
                    />
                    <Button type="button" onClick={addSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="pr-1">
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="bg-primary/10 text-primary font-medium px-3 py-1"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No skills added yet.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <Label>Experience</Label>
              {isEditing ? (
                <>
                  <Card className="p-4 bg-muted/30">
                    <div className="space-y-4">
                      <Input
                        placeholder="Title (e.g., Full Stack Developer)"
                        value={currentExp.title}
                        onChange={(e) =>
                          setCurrentExp({ ...currentExp, title: e.target.value })
                        }
                      />
                      <Textarea
                        placeholder="Description"
                        value={currentExp.description}
                        onChange={(e) =>
                          setCurrentExp({
                            ...currentExp,
                            description: e.target.value,
                          })
                        }
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="date"
                            value={currentExp.startDate}
                            onChange={(e) =>
                              setCurrentExp({
                                ...currentExp,
                                startDate: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="date"
                            value={currentExp.endDate}
                            onChange={(e) =>
                              setCurrentExp({
                                ...currentExp,
                                endDate: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={addExperience}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Experience
                      </Button>
                    </div>
                  </Card>

                  <div className="space-y-3">
                    {experiences.map((exp, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold">{exp.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {exp.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {exp.startDate} - {exp.endDate || "Present"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExperience(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  {experiences.length > 0 ? (
                    experiences.map((exp, index) => (
                      <Card
                        key={index}
                        className="p-4 bg-muted/20 border border-primary/20"
                      >
                        <h4 className="font-semibold text-primary">
                          {exp.title}
                        </h4>
                        <p className="text-sm mt-1">{exp.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {exp.startDate} - {exp.endDate || "Present"}
                        </p>
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No experiences added yet.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>GitHub</Label>
                <Input
                  readOnly={!isEditing}
                  value={profileData.githubLink}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      githubLink: e.target.value,
                    })
                  }
                  className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input
                  readOnly={!isEditing}
                  value={profileData.linkedinLink}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      linkedinLink: e.target.value,
                    })
                  }
                  className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                />
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-6 w-6 text-muted-foreground" />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  (0.0 - No reviews yet)
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MyProfile;
