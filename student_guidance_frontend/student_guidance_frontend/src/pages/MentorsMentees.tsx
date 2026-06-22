// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { ArrowLeft } from "lucide-react";

// // Mock data
// const mentorsData = [
//   {
//     id: "1",
//     mentorName: "Dr. Sarah Johnson",
//     otherMentees: ["Alice Chen", "Bob Smith"],
//     projectName: "ML Pipeline System",
//     startDate: "2024-01-15",
//     endDate: "2024-03-20",
//     paymentStatus: "pending" as const,
//   },
//   {
//     id: "2",
//     mentorName: "Prof. Michael Brown",
//     otherMentees: ["Charlie Davis"],
//     projectName: "Cloud Infrastructure",
//     startDate: "2023-11-01",
//     endDate: "2024-01-15",
//     paymentStatus: "completed" as const,
//   },
// ];

// const menteesData = [
//   {
//     id: "1",
//     menteeName: "Emma Wilson",
//     projectName: "React Dashboard",
//     startDate: "2024-02-01",
//     endDate: "2024-04-15",
//     paymentStatus: "pending" as const,
//   },
//   {
//     id: "2",
//     menteeName: "James Taylor",
//     projectName: "API Gateway",
//     startDate: "2024-01-10",
//     endDate: "2024-03-10",
//     paymentStatus: "completed" as const,
//   },
// ];

// const MentorsMentees = () => {
//   const navigate = useNavigate();

//   const handlePayNow = (id: string) => {
//     // TODO: Integrate payment system
//     console.log("Processing payment for:", id);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
//       <div className="container mx-auto px-6 py-8">
//         <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back
//         </Button>

//         <div className="space-y-8">
//           {/* Mentors Section */}
//           <div>
//             <Card className="shadow-elevated">
//               <div className="p-6 border-b">
//                 <h2 className="text-2xl font-bold">
//                   Mentors I Have Sought Help From
//                 </h2>
//                 <p className="text-muted-foreground mt-1">
//                   Track your mentorship relationships and payments
//                 </p>
//               </div>
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Mentor Name</TableHead>
//                       <TableHead>Other Mentees</TableHead>
//                       <TableHead>Project Name</TableHead>
//                       <TableHead>Start Date</TableHead>
//                       <TableHead>End Date</TableHead>
//                       <TableHead>Action</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {mentorsData.map((mentor) => (
//                       <TableRow key={mentor.id}>
//                         <TableCell className="font-medium">
//                           {mentor.mentorName}
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex flex-wrap gap-1">
//                             {mentor.otherMentees.map((mentee, idx) => (
//                               <Badge key={idx} variant="outline" className="text-xs">
//                                 {mentee}
//                               </Badge>
//                             ))}
//                           </div>
//                         </TableCell>
//                         <TableCell>{mentor.projectName}</TableCell>
//                         <TableCell>
//                           {new Date(mentor.startDate).toLocaleDateString()}
//                         </TableCell>
//                         <TableCell>
//                           {new Date(mentor.endDate).toLocaleDateString()}
//                         </TableCell>
//                         <TableCell>
//                           <Button
//                             size="sm"
//                             disabled={mentor.paymentStatus === "completed"}
//                             onClick={() => handlePayNow(mentor.id)}
//                           >
//                             {mentor.paymentStatus === "completed"
//                               ? "Paid"
//                               : "Pay Now"}
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             </Card>
//           </div>

//           {/* Mentees Section */}
//           <div>
//             <Card className="shadow-elevated">
//               <div className="p-6 border-b">
//                 <h2 className="text-2xl font-bold">Mentees I Have Guided</h2>
//                 <p className="text-muted-foreground mt-1">
//                   View your mentees and payment status
//                 </p>
//               </div>
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Mentee</TableHead>
//                       <TableHead>Project Name</TableHead>
//                       <TableHead>Start Date</TableHead>
//                       <TableHead>End Date</TableHead>
//                       <TableHead>Payment Status</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {menteesData.map((mentee) => (
//                       <TableRow key={mentee.id}>
//                         <TableCell className="font-medium">
//                           {mentee.menteeName}
//                         </TableCell>
//                         <TableCell>{mentee.projectName}</TableCell>
//                         <TableCell>
//                           {new Date(mentee.startDate).toLocaleDateString()}
//                         </TableCell>
//                         <TableCell>
//                           {new Date(mentee.endDate).toLocaleDateString()}
//                         </TableCell>
//                         <TableCell>
//                           <Badge
//                             variant={
//                               mentee.paymentStatus === "completed"
//                                 ? "default"
//                                 : "secondary"
//                             }
//                           >
//                             {mentee.paymentStatus === "completed"
//                               ? "Paid"
//                               : "Pending"}
//                           </Badge>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MentorsMentees;


// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { ArrowLeft, Loader2 } from "lucide-react";

// interface MentorItem {
//   id: string;
//   mentorName: string;
//   otherMentees: string[];
//   projectName: string;
//   startDate: string;
//   endDate: string;
//   paymentStatus: "pending" | "completed";
// }

// interface MenteeItem {
//   id: string;
//   menteeName: string;
//   projectName: string;
//   startDate: string;
//   endDate: string;
//   paymentStatus: "pending" | "completed";
// }

// const MentorsMentees = () => {
//   const navigate = useNavigate();
//   const [mentors, setMentors] = useState<MentorItem[]>([]);
//   const [mentees, setMentees] = useState<MenteeItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Extract real user context from local storage
//   const storedUser = localStorage.getItem("user");
//   const currentUser = storedUser ? JSON.parse(storedUser) : null;
//   const userEmail = currentUser?.email || localStorage.getItem("userEmail") || "";

//   useEffect(() => {
//     const fetchMentorshipData = async () => {
//       if (!userEmail) {
//         setLoading(false);
//         return;
//       }
//       try {
//         const response = await fetch(
//           `http://localhost:8080/api/projects/mentorship-summary?email=${encodeURIComponent(userEmail.trim())}`
//         );
//         if (response.ok) {
//           const data = await response.json();
//           setMentors(data.mentors || []);
//           setMentees(data.mentees || []);
//         } else {
//           console.error("Server responded with an error code:", response.status);
//         }
//       } catch (error) {
//         console.error("Network connectivity failure:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMentorshipData();
//   }, [userEmail]);

//   const handlePayNow = (id: string) => {
//     console.log("Processing payment transaction token for connection id:", id);
//     // TODO: Integrate payment system payment gateways
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/10">
//         <div className="flex flex-col items-center gap-2 text-muted-foreground">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           <p className="text-sm font-medium">Loading relationships data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
//       <div className="container mx-auto px-6 py-8">
//         <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back
//         </Button>

//         <div className="space-y-8">
//           {/* Mentors Section */}
//           <div>
//             <Card className="shadow-elevated overflow-hidden">
//               <div className="p-6 border-b bg-card">
//                 <h2 className="text-2xl font-bold">Mentors I Have Sought Help From</h2>
//                 <p className="text-muted-foreground mt-1">
//                   Track your mentorship relationships and payments
//                 </p>
//               </div>
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Mentor Name</TableHead>
//                       <TableHead>Other Mentees</TableHead>
//                       <TableHead>Project Name</TableHead>
//                       <TableHead>Start Date</TableHead>
//                       <TableHead>End Date</TableHead>
//                       <TableHead>Action</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {mentors.map((mentor) => (
//                       <TableRow key={mentor.id}>
//                         <TableCell className="font-medium text-foreground">{mentor.mentorName}</TableCell>
//                         <TableCell>
//                           <div className="flex flex-wrap gap-1">
//                             {mentor.otherMentees.length === 0 ? (
//                               <span className="text-xs text-muted-foreground italic">None</span>
//                             ) : (
//                               mentor.otherMentees.map((mentee, idx) => (
//                                 <Badge key={idx} variant="outline" className="text-xs font-normal">
//                                   {mentee}
//                                 </Badge>
//                               ))
//                             )}
//                           </div>
//                         </TableCell>
//                         <TableCell className="text-muted-foreground font-medium">{mentor.projectName}</TableCell>
//                         <TableCell>{new Date(mentor.startDate).toLocaleDateString()}</TableCell>
//                         <TableCell>{new Date(mentor.endDate).toLocaleDateString()}</TableCell>
//                         <TableCell>
//                           <Button
//                             size="sm"
//                             variant={mentor.paymentStatus === "completed" ? "secondary" : "default"}
//                             disabled={mentor.paymentStatus === "completed"}
//                             onClick={() => handlePayNow(mentor.id)}
//                           >
//                             {mentor.paymentStatus === "completed" ? "Paid" : "Pay Now"}
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                     {mentors.length === 0 && (
//                       <TableRow>
//                         <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
//                           No advisor connections mapped to your current profile.
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </Card>
//           </div>

//           {/* Mentees Section */}
//           <div>
//             <Card className="shadow-elevated overflow-hidden">
//               <div className="p-6 border-b bg-card">
//                 <h2 className="text-2xl font-bold">Mentees I Have Guided</h2>
//                 <p className="text-muted-foreground mt-1">
//                   View your mentees and payment status
//                 </p>
//               </div>
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Mentee</TableHead>
//                       <TableHead>Project Name</TableHead>
//                       <TableHead>Start Date</TableHead>
//                       <TableHead>End Date</TableHead>
//                       <TableHead>Payment Status</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {mentees.map((mentee) => (
//                       <TableRow key={mentee.id}>
//                         <TableCell className="font-medium text-foreground">{mentee.menteeName}</TableCell>
//                         <TableCell className="text-muted-foreground font-medium">{mentee.projectName}</TableCell>
//                         <TableCell>{new Date(mentee.startDate).toLocaleDateString()}</TableCell>
//                         <TableCell>{new Date(mentee.endDate).toLocaleDateString()}</TableCell>
//                         <TableCell>
//                           <Badge variant={mentee.paymentStatus === "completed" ? "default" : "secondary"}>
//                             {mentee.paymentStatus === "completed" ? "Paid" : "Pending"}
//                           </Badge>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                     {mentees.length === 0 && (
//                       <TableRow>
//                         <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
//                           You are not acting as an active mentor for any team memberships yet.
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MentorsMentees;

// import { useState, useEffect, Fragment } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { ArrowLeft, Loader2 } from "lucide-react";

// interface MentorItem {
//   id: string;
//   mentorName: string;
//   otherMentees: string[];
//   projectName: string;
//   startDate: string;
//   endDate: string;
//   paymentStatus: "pending" | "completed";
// }

// interface MenteeItem {
//   id: string;
//   menteeName: string;
//   projectName: string;
//   startDate: string;
//   endDate: string;
//   paymentStatus: "pending" | "completed";
// }

// const MentorsMentees = () => {
//   const navigate = useNavigate();
//   const [mentors, setMentors] = useState<MentorItem[]>([]);
//   const [mentees, setMentees] = useState<MenteeItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Extract real user context from local storage
//   const storedUser = localStorage.getItem("user");
//   const currentUser = storedUser ? JSON.parse(storedUser) : null;
//   const userEmail = currentUser?.email || localStorage.getItem("userEmail") || "";

//   useEffect(() => {
//     const fetchMentorshipData = async () => {
//       if (!userEmail) {
//         setLoading(false);
//         return;
//       }
//       try {
//         const response = await fetch(
//           `http://localhost:8080/api/projects/mentorship-summary?email=${encodeURIComponent(userEmail.trim())}`
//         );
//         if (response.ok) {
//           const data = await response.json();
//           setMentors(data.mentors || []);
//           setMentees(data.mentees || []);
//         } else {
//           console.error("Server responded with an error code:", response.status);
//         }
//       } catch (error) {
//         console.error("Network connectivity failure:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMentorshipData();
//   }, [userEmail]);

//   const handlePayNow = (id: string) => {
//     console.log("Processing payment transaction token for connection id:", id);
//     // TODO: Integrate payment system payment gateways
//   };

//   // Group mentees by project name dynamically
//   const groupedMentees = mentees.reduce((acc, mentee) => {
//     if (!acc[mentee.projectName]) {
//       acc[mentee.projectName] = [];
//     }
//     acc[mentee.projectName].push(mentee);
//     return acc;
//   }, {} as Record<string, MenteeItem[]>);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/10">
//         <div className="flex flex-col items-center gap-2 text-muted-foreground">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           <p className="text-sm font-medium">Loading relationships data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
//       <div className="container mx-auto px-6 py-8">
//         <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back
//         </Button>

//         <div className="space-y-8">
//           {/* Mentors Section */}
//           <div>
//             <Card className="shadow-elevated overflow-hidden">
//               <div className="p-6 border-b bg-card">
//                 <h2 className="text-2xl font-bold">Mentors I Have Sought Help From</h2>
//                 <p className="text-muted-foreground mt-1">
//                   Track your mentorship relationships and payments
//                 </p>
//               </div>
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Mentor Name</TableHead>
//                       <TableHead>Other Mentees</TableHead>
//                       <TableHead>Project Name</TableHead>
//                       <TableHead>Start Date</TableHead>
//                       <TableHead>End Date</TableHead>
//                       <TableHead>Action</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {mentors.map((mentor) => (
//                       <TableRow key={mentor.id}>
//                         <TableCell className="font-medium text-foreground">{mentor.mentorName}</TableCell>
//                         <TableCell>
//                           <div className="flex flex-wrap gap-1">
//                             {mentor.otherMentees.length === 0 ? (
//                               <span className="text-xs text-muted-foreground italic">None</span>
//                             ) : (
//                               mentor.otherMentees.map((mentee, idx) => (
//                                 <Badge key={idx} variant="outline" className="text-xs font-normal">
//                                   {mentee}
//                                 </Badge>
//                               ))
//                             )}
//                           </div>
//                         </TableCell>
//                         <TableCell className="text-muted-foreground font-medium">{mentor.projectName}</TableCell>
//                         <TableCell>{new Date(mentor.startDate).toLocaleDateString()}</TableCell>
//                         <TableCell>{new Date(mentor.endDate).toLocaleDateString()}</TableCell>
//                         <TableCell>
//                           <Button
//                             size="sm"
//                             variant={mentor.paymentStatus === "completed" ? "secondary" : "default"}
//                             disabled={mentor.paymentStatus === "completed"}
//                             onClick={() => handlePayNow(mentor.id)}
//                           >
//                             {mentor.paymentStatus === "completed" ? "Paid" : "Pay Now"}
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                     {mentors.length === 0 && (
//                       <TableRow>
//                         <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
//                           No advisor connections mapped to your current profile.
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </Card>
//           </div>

//           {/* Mentees Section */}
//           <div>
//             <Card className="shadow-elevated overflow-hidden">
//               <div className="p-6 border-b bg-card">
//                 <h2 className="text-2xl font-bold">Mentees I Have Guided</h2>
//                 <p className="text-muted-foreground mt-1">
//                   View your mentees and payment status
//                 </p>
//               </div>
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead className="pl-6">Mentee</TableHead>
//                       <TableHead>Start Date</TableHead>
//                       <TableHead>End Date</TableHead>
//                       <TableHead>Payment Status</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {mentees.length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
//                           You are not acting as an active mentor for any team memberships yet.
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       Object.entries(groupedMentees).map(([projectName, projectMentees]) => (
//                         <Fragment key={projectName}>
//                           {/* Project Demarcation Row */}
//                           <TableRow className="bg-muted/40 hover:bg-muted/40 border-b font-medium select-none">
//                             <TableCell colSpan={4} className="py-3 px-4 font-bold text-sm text-foreground tracking-wide">
//                               📁 {projectName}
//                             </TableCell>
//                           </TableRow>
                          
//                           {/* Team Members Associated with the Project */}
//                           {projectMentees.map((mentee) => (
//                             <TableRow key={mentee.id} className="hover:bg-accent/5">
//                               <TableCell className="font-medium text-foreground pl-10">
//                                 {mentee.menteeName}
//                               </TableCell>
//                               <TableCell>{new Date(mentee.startDate).toLocaleDateString()}</TableCell>
//                               <TableCell>{new Date(mentee.endDate).toLocaleDateString()}</TableCell>
//                               <TableCell>
//                                 <Badge variant={mentee.paymentStatus === "completed" ? "default" : "secondary"}>
//                                   {mentee.paymentStatus === "completed" ? "Paid" : "Pending"}
//                                 </Badge>
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                         </Fragment>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MentorsMentees;

import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2 } from "lucide-react";

interface MentorItem {
  id: string;
  mentorName: string;
  otherMentees: string[];
  projectName: string;
  startDate: string;
  endDate: string;
  paymentStatus: "pending" | "completed";
}

interface MenteeItem {
  id: string;
  menteeName: string;
  projectName: string;
  startDate: string;
  endDate: string;
  paymentStatus: "pending" | "completed";
}

const MentorsMentees = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<MentorItem[]>([]);
  const [mentees, setMentees] = useState<MenteeItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Extract real user context from local storage
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const userEmail = currentUser?.email || localStorage.getItem("userEmail") || "";

  useEffect(() => {
    const fetchMentorshipData = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:8080/api/projects/mentorship-summary?email=${encodeURIComponent(userEmail.trim())}`
        );
        if (response.ok) {
          const data = await response.json();
          setMentors(data.mentors || []);
          setMentees(data.mentees || []);
        } else {
          console.error("Server responded with an error code:", response.status);
        }
      } catch (error) {
        console.error("Network connectivity failure:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorshipData();
  }, [userEmail]);

  const handlePayNow = (id: string) => {
    console.log("Processing payment transaction token for connection id:", id);
    // TODO: Integrate payment system payment gateways
  };

  // Group mentors by project name dynamically
  const groupedMentors = mentors.reduce((acc, mentor) => {
    if (!acc[mentor.projectName]) {
      acc[mentor.projectName] = [];
    }
    acc[mentor.projectName].push(mentor);
    return acc;
  }, {} as Record<string, MentorItem[]>);

  // Group mentees by project name dynamically
  const groupedMentees = mentees.reduce((acc, mentee) => {
    if (!acc[mentee.projectName]) {
      acc[mentee.projectName] = [];
    }
    acc[mentee.projectName].push(mentee);
    return acc;
  }, {} as Record<string, MenteeItem[]>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/10">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading relationships data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <div className="container mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="space-y-8">
          {/* Mentors Section */}
          <div>
            <Card className="shadow-elevated overflow-hidden">
              <div className="p-6 border-b bg-card">
                <h2 className="text-2xl font-bold">Mentors I Have Sought Help From</h2>
                <p className="text-muted-foreground mt-1">
                  Track your mentorship relationships and payments
                </p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Mentor Name</TableHead>
                      <TableHead>Other Mentees</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mentors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No advisor connections mapped to your current profile.
                        </TableCell>
                      </TableRow>
                    ) : (
                      Object.entries(groupedMentors).map(([projectName, projectMentors]) => (
                        <Fragment key={projectName}>
                          {/* Project Demarcation Row */}
                          <TableRow className="bg-muted/40 hover:bg-muted/40 border-b font-medium select-none">
                            <TableCell colSpan={5} className="py-3 px-4 font-bold text-sm text-foreground tracking-wide">
                              📁 {projectName}
                            </TableCell>
                          </TableRow>

                          {/* Mentors Associated with the Project */}
                          {projectMentors.map((mentor) => (
                            <TableRow key={mentor.id} className="hover:bg-accent/5">
                              <TableCell className="font-medium text-foreground pl-10">
                                {mentor.mentorName}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {mentor.otherMentees.length === 0 ? (
                                    <span className="text-xs text-muted-foreground italic">None</span>
                                  ) : (
                                    mentor.otherMentees.map((mentee, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs font-normal">
                                        {mentee}
                                      </Badge>
                                    ))
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{new Date(mentor.startDate).toLocaleDateString()}</TableCell>
                              <TableCell>{new Date(mentor.endDate).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant={mentor.paymentStatus === "completed" ? "secondary" : "default"}
                                  disabled={mentor.paymentStatus === "completed"}
                                  onClick={() => handlePayNow(mentor.id)}
                                >
                                  {mentor.paymentStatus === "completed" ? "Paid" : "Pay Now"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </Fragment>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          {/* Mentees Section */}
          <div>
            <Card className="shadow-elevated overflow-hidden">
              <div className="p-6 border-b bg-card">
                <h2 className="text-2xl font-bold">Mentees I Have Guided</h2>
                <p className="text-muted-foreground mt-1">
                  View your mentees and payment status
                </p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Mentee</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Payment Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mentees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          You are not acting as an active mentor for any team memberships yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      Object.entries(groupedMentees).map(([projectName, projectMentees]) => (
                        <Fragment key={projectName}>
                          {/* Project Demarcation Row */}
                          <TableRow className="bg-muted/40 hover:bg-muted/40 border-b font-medium select-none">
                            <TableCell colSpan={4} className="py-3 px-4 font-bold text-sm text-foreground tracking-wide">
                              📁 {projectName}
                            </TableCell>
                          </TableRow>
                          
                          {/* Team Members Associated with the Project */}
                          {projectMentees.map((mentee) => (
                            <TableRow key={mentee.id} className="hover:bg-accent/5">
                              <TableCell className="font-medium text-foreground pl-10">
                                {mentee.menteeName}
                              </TableCell>
                              <TableCell>{new Date(mentee.startDate).toLocaleDateString()}</TableCell>
                              <TableCell>{new Date(mentee.endDate).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Badge variant={mentee.paymentStatus === "completed" ? "default" : "secondary"}>
                                  {mentee.paymentStatus === "completed" ? "Paid" : "Pending"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </Fragment>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorsMentees;