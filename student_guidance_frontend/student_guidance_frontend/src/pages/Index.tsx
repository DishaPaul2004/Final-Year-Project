import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, MessageCircle, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-8 shadow-elevated">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Student Guidance System
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Connect with experienced mentors, collaborate on projects, and build
            your future. Join a community of learners and experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg px-8"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-xl bg-card shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Find Mentors</h3>
            <p className="text-muted-foreground">
              Connect with experienced seniors who can guide you through your
              projects and career path.
            </p>
          </div>

          <div className="text-center p-8 rounded-xl bg-card shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-6">
              <MessageCircle className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Collaborate</h3>
            <p className="text-muted-foreground">
              Work together with team members and mentors through integrated
              chat and project management tools.
            </p>
          </div>

          <div className="text-center p-8 rounded-xl bg-card shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Grow Together</h3>
            <p className="text-muted-foreground">
              Build your portfolio, gain experience, and earn by helping others
              succeed in their journey.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-12 shadow-elevated">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students and mentors already learning and growing
            together.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg px-12"
          >
            Join Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
