import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupCreated: () => void;
  creatorEmail: string;
}

export const CreateGroupDialog = ({ open, onOpenChange, onGroupCreated, creatorEmail }: CreateGroupDialogProps) => {
  const [groupName, setGroupName] = useState("");
  const [techStack, setTechStack] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      // Assuming a generic endpoint exists to fetch users or use your Profile mapping
      fetch(`http://localhost:8080/api/my-profile/all`) 
        .then((res) => res.json())
        .then((data) => setUsers(data.filter((u: any) => u.email !== creatorEmail)))
        .catch(() => toast.error("Failed to load users"));
    }
  }, [open, creatorEmail]);

  const handleCreate = async () => {
    if (!groupName.trim() || !techStack.trim() || selectedUsers.length === 0) {
      toast.error("Please fill all fields and select members");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/group-chat/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupName,
          techStack,
          memberIds: selectedUsers,
          creatorEmail
        }),
      });

      if (response.ok) {
        toast.success("Group created successfully!");
        onGroupCreated();
        onOpenChange(false);
        setGroupName("");
        setTechStack("");
        setSelectedUsers([]);
      } else {
        toast.error("Failed to create group. Ensure name is unique.");
      }
    } catch {
      toast.error("Network error creating group");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md flex flex-col max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Create Project Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 my-2 flex-1 flex flex-col min-h-0">
          <Input placeholder="Unique Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
          <Input placeholder="Tech Stack (e.g., React, Spring Boot)" value={techStack} onChange={(e) => setTechStack(e.target.value)} />
          
          <label className="text-sm font-semibold mt-2 block">Select Team Members:</label>
          <ScrollArea className="flex-1 border rounded-md p-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center space-x-3 p-2 hover:bg-accent rounded-sm">
                <Checkbox
                  id={`user-${user.id}`}
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={(checked) => {
                    setSelectedUsers(prev => checked ? [...prev, user.id] : prev.filter(id => id !== user.id));
                  }}
                />
                <label htmlFor={`user-${user.id}`} className="text-sm font-medium cursor-pointer">
                  {user.name} ({user.email})
                </label>
              </div>
            ))}
          </ScrollArea>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate}>Create Group</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};