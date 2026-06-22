import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, UserPlus, Plus, ShieldCheck, Users, Code } from "lucide-react";
import { CreateGroupDialog } from "@/components/CreateGroupDialog";
import { ConnectMentorDialog } from "@/components/ConnectMentorDialog";
import { toast } from "sonner";

const Chat = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const userEmail = currentUser?.email || "";

  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [mentorName, setMentorName] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isMentorOpen, setIsMentorOpen] = useState(false);

  const loadGroups = () => {
    if (!userEmail) return;
    
    fetch(`http://localhost:8080/api/group-chat/my-groups?email=${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setGroups(data);
          if (data.length > 0) {
            // Retain selected group references smoothly on refetches
            const currentSelected = data.find(g => g.id === selectedGroup?.id);
            setSelectedGroup(currentSelected || data[0]);
          }
        } else {
          setGroups([]);
        }
      })
      .catch(() => setGroups([]));
  };

  const loadMessages = (groupId: number) => {
    fetch(`http://localhost:8080/api/group-chat/messages/${groupId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMessages(data);
        }
      })
      .catch(() => console.error("Error loading chat context logs"));
  };

  useEffect(() => {
    loadGroups();
  }, [userEmail]);

  useEffect(() => {
    if (selectedGroup) {
      loadMessages(selectedGroup.id);
      const interval = setInterval(() => loadMessages(selectedGroup.id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedGroup?.id]);

  useEffect(() => {
    if (selectedGroup?.mentorId) {
      fetch(`http://localhost:8080/api/users/${selectedGroup.mentorId}`)
        .then((res) => res.json())
        .then((data) => {
          // Fallback to email or a default string if name field is empty
          setMentorName(data.name || data.email || "Assigned Mentor");
        })
        .catch(() => {
          setMentorName("Assigned Mentor");
        });
    } else {
      setMentorName(""); // Reset if no mentor is assigned
    }
  }, [selectedGroup?.mentorId]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedGroup || !userEmail) return;

    try {
      const response = await fetch("http://localhost:8080/api/group-chat/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: selectedGroup.id,
          senderEmail: userEmail,
          content: messageInput,
        }),
      });
      if (response.ok) {
        setMessageInput("");
        loadMessages(selectedGroup.id);
      }
    } catch {
      toast.error("Message delivery failed");
    }
  };

  const formatMessageTime = (timeString: string) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <Card className="shadow-elevated overflow-hidden">
          <div className="flex h-[calc(100vh-200px)]">
            {/* Sidebar Channels List */}
            <div className="w-80 border-r flex flex-col bg-card/50">
              <div className="p-4 border-b">
                <Button onClick={() => setIsCreateOpen(true)} className="w-full" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Create Group
                </Button>
              </div>
              <ScrollArea className="flex-1 p-2">
                {groups.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGroup(g)}
                    className={`w-full p-4 rounded-lg text-left hover:bg-accent/50 transition-colors mb-2 ${selectedGroup?.id === g.id ? "bg-accent shadow-sm border" : ""}`}
                  >
                    <div className="font-semibold text-foreground flex items-center justify-between">
                      <span className="truncate pr-2">{g.groupName}</span>
                      {g.mentorName && <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" />}
                    </div>
                    <div className="text-xs text-muted-foreground truncate mt-0.5">{g.techStack}</div>
                  </button>
                ))}
              </ScrollArea>
            </div>

            {/* Conversation Execution Window Area */}
            <div className="flex-1 flex flex-col bg-card">
              {selectedGroup ? (
                <>
                  {/* Stylized Chat Header View */}
                  <div className="p-5 border-b flex justify-between items-start bg-card shadow-sm z-10 gap-4">
                    <div className="space-y-2 max-w-[70%]">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-bold text-xl tracking-tight text-foreground">{selectedGroup.groupName}</h2>
                        {selectedGroup.mentor && selectedGroup.mentor.name ? (
                          <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600 text-white flex items-center gap-1 text-xs px-2.5 py-0.5">
                            <ShieldCheck className="h-3 w-3" /> Mentor: {selectedGroup.mentor.name || "Loading..."}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground border-dashed text-xs px-2.5 py-0.5">
                            No Assigned Mentor
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <div className="flex items-center gap-1.5 bg-muted/60 px-2.5 py-1 rounded-md text-muted-foreground border">
                          <Code className="h-3 w-3 text-primary/70" />
                          <span className="font-medium text-foreground">{selectedGroup.techStack || "Unassigned Stack"}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 bg-muted/60 px-2.5 py-1 rounded-md text-muted-foreground border">
                          <Users className="h-3 w-3 text-primary/70" />
                          <span className="truncate max-w-sm">
                            <strong className="text-foreground/80 font-semibold">Members: </strong>
                            {selectedGroup.members?.map((m: any) => m.name).join(", ") || "No active context profiles"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      variant={selectedGroup.mentorName ? "secondary" : "default"} 
                      size="sm" 
                      onClick={() => setIsMentorOpen(true)}
                      disabled={!!selectedGroup.mentor}
                      className="shadow-sm font-medium transition-all duration-200"
                    >
                      <UserPlus className="mr-2 h-4 w-4" /> 
                      {selectedGroup.mentorName ? "Mentor Assigned" : "Connect Mentor"}
                    </Button>
                  </div>

                  {/* Messages Delivery Stream */}
                  <ScrollArea className="flex-1 p-4 bg-accent/5">
                    <div className="space-y-4">
                      {messages.map((msg) => {
                        const isMe = msg.sender?.email === userEmail;
                        return (
                          <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[70%] rounded-lg p-3 shadow-sm relative ${isMe ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                              {!isMe && (
                                <p className="text-xs font-bold text-secondary-foreground mb-1">
                                  {msg.sender?.name || "Anonymous"}
                                </p>
                              )}
                              <p className="text-sm pr-10 break-words">{msg.content}</p>
                              <span className={`text-[10px] absolute bottom-1 right-2 flex items-center gap-0.5 ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                {formatMessageTime(msg.timestamp || msg.createdAt)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>

                  {/* Input Transmission Area */}
                  <div className="p-4 border-t bg-card">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a group channel transmission..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage} size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  Select a group conversation channel to begin.
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <CreateGroupDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onGroupCreated={loadGroups} creatorEmail={userEmail} />
      {selectedGroup && <ConnectMentorDialog open={isMentorOpen} onOpenChange={setIsMentorOpen} groupId={selectedGroup.id} onMentorConnected={loadGroups} />}
    </div>
  );
};

export default Chat;