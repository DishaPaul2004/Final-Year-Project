import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MyRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);

  // Correct parsing method referencing Auth.tsx keys safely
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const userEmail = currentUser?.email || "";

  const fetchRequests = () => {
    if (!userEmail) return;

    fetch(`http://localhost:8080/api/group-chat/requests/pending?email=${userEmail}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        if (Array.isArray(data)) {
          setRequests(data);
        } else {
          setRequests([]);
        }
      })
      .catch(() => {
        toast.error("Could not fetch incoming connections");
        setRequests([]);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, [userEmail]);

  const handleAction = async (id: number, type: "accept" | "reject") => {
    try {
      const response = await fetch(`http://localhost:8080/api/group-chat/requests/${id}/${type}`, {
        method: "PUT"
      });
      if (response.ok) {
        toast.success(`Request successfully ${type}ed!`);
        fetchRequests();
      }
    } catch {
      toast.error("Action transmission failure");
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl min-h-screen">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      <h2 className="text-3xl font-bold mb-2">My Requests</h2>
      <p className="text-muted-foreground mb-6">Manage project groups requesting your technical mentorship guidance</p>

      {requests.length === 0 ? (
        <div className="text-center py-12 border rounded-lg text-muted-foreground bg-card">
          No pending mentorship requests at this time.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-primary">{req.group?.groupName}</h3>
                  <p className="text-sm font-medium">Tech Stack: <span className="text-muted-foreground">{req.group?.techStack}</span></p>
                  <p className="text-sm font-medium">
                    Team Members:{" "}
                    <span className="text-muted-foreground">
                      {req.group?.members?.map((m: any) => m.name).join(", ") || "None"}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto justify-end">
                  <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => handleAction(req.id, "reject")}>
                    <X className="mr-2 h-4 w-4" /> Reject
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAction(req.id, "accept")}>
                    <Check className="mr-2 h-4 w-4" /> Accept
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};