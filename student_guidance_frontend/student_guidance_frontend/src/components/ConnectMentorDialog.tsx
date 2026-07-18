import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, Code } from "lucide-react";
import { toast } from "sonner";

interface ConnectMentorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string | number;
  onMentorConnected?: () => void;
}

export const ConnectMentorDialog = ({ open, onOpenChange, groupId, onMentorConnected }: ConnectMentorDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mentors, setMentors] = useState<any[]>([]);
  const [selectedMentors, setSelectedMentors] = useState<string[]>([]);

  // Fetch from backend matching by both name and skills text query
  useEffect(() => {
    if (open && groupId) {
      const delayDebounceFn = setTimeout(() => {
        fetch(`http://localhost:8080/api/group-chat/potential-mentors/${groupId}?search=${encodeURIComponent(searchQuery.trim())}`)
          .then((res) => res.json())
          .then((data) => setMentors(Array.isArray(data) ? data : []))
          .catch(() => toast.error("Error loading eligible mentors"));
      }, 250); // Debounce to prevent server hammering

      return () => clearTimeout(delayDebounceFn);
    }
  }, [open, groupId, searchQuery]);

  const handleSendRequest = async () => {
    if (selectedMentors.length === 0) {
      toast.error("Please select at least one mentor");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/group-chat/request-mentors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId, mentorIds: selectedMentors }),
      });

      if (response.ok) {
        toast.success(`Request successfully routed to selected targets!`);
        setSelectedMentors([]);
        if (onMentorConnected) onMentorConnected();
        onOpenChange(false);
      }
    } catch {
      toast.error("Failed transmission request");
    }
  };

  // Safe utility to handle database plain-text tags or JSON skill arrays stringified
  const parseSkills = (skillsString: string): string[] => {
    if (!skillsString) return [];
    try {
      if (skillsString.trim().startsWith("[")) {
        return JSON.parse(skillsString);
      }
      return skillsString.split(",").map((s) => s.trim()).filter(Boolean);
    } catch {
      return [];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[550px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Invite Project Mentors</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search available candidates by name or technical skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <ScrollArea className="flex-1 border rounded-lg p-2">
            <div className="space-y-2">
              {mentors.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No match profiles located for current filtering settings.
                </div>
              ) : (
                mentors.map((mentor) => (
                  <Card key={mentor.id} className="p-4 flex items-start justify-between gap-4 hover:bg-accent/5 transition-colors">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Checkbox
                        checked={selectedMentors.includes(mentor.id)}
                        className="mt-1"
                        onCheckedChange={(checked) => {
                          setSelectedMentors(prev => checked ? [...prev, mentor.id] : prev.filter(id => id !== mentor.id));
                        }}
                      />
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback>{mentor.name.substring(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div>
                          <h4 className="font-semibold text-sm text-foreground truncate">{mentor.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">{mentor.email}</p>
                        </div>
                        
                        {/* Display list of technical skills dynamically */}
                        {mentor.skills && (
                          <div className="flex flex-wrap items-center gap-1 pt-1">
                            <Code className="h-3 w-3 text-muted-foreground mr-0.5 flex-shrink-0" />
                            {parseSkills(mentor.skills).slice(0, 5).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                                {skill}
                              </Badge>
                            ))}
                            {parseSkills(mentor.skills).length > 5 && (
                              <span className="text-[10px] text-muted-foreground pl-0.5">
                                +{parseSkills(mentor.skills).length - 5} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-xs text-muted-foreground font-medium">{selectedMentors.length} candidates selected</span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleSendRequest}><Send className="mr-2 h-4 w-4" /> Fire Request</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};