import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  /*const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // TODO: Integrate with Spring Boot backend API
    toast.success(isLogin ? "Login successful!" : "Registration successful!");
    localStorage.setItem("isAuthenticated", "true");
    navigate("/dashboard");
  };*/

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isLogin && formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  const url = isLogin
    ? "http://localhost:8080/api/auth/login"
    : "http://localhost:8080/api/auth/register";

  const payload = isLogin
    ? {
        email: formData.email,
        password: formData.password,
      }
    : {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log(res);
    console.log("before await");
    const data = await res.json();
    console.log("after await");

    if (!res.ok) {
      toast.error(data.message || "Something went wrong");
      return;
    }

    // ✅ If login successful, store data
    if (isLogin) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("token", data.token || "");
      localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
      toast.success(data.message || "Login successful!");
      navigate("/dashboard");
    } else {
      toast.success(data.message || "Registration successful!");
      setIsLogin(true); // switch to login mode after registration
    }
  } catch (err) {
    console.log("Error:", err);
    toast.error("Server error. Please try again.");
  }
};


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20 p-4">
      <Card className="w-full max-w-md p-8 shadow-elevated">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Student Guidance
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {isLogin && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button type="submit" className="w-full">
            {isLogin ? "Login" : "Register"}
          </Button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Auth;
