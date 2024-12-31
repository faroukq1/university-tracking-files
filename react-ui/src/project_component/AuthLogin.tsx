import { useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { FaGithubAlt } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";

const AuthLogin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const handleSignUp = async () => {
    setLoading(true);
    setError(null);

    const URL = "http://localhost:3001/api/auth";
    try {
      const response = await axios.post(URL, {
        email,
        password,
      });
      const data = response.data;
      const role = data.user.roleDetails.role;
      setUser(data.user);
      if (role === "WORKER") navigate("/worker/dashboard");
      if (role === "STUDENT") navigate("/student/dashboard");
      setEmail("");
      setPassword("");
      toast.success("Login successfully");
    } catch (err) {
      console.error("Error:", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="p-8 flex items-center justify-center">
      <Card className="w-full max-w-md border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            University File Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-500 text-sm">
            We are helping you to make your file validation more easier.
          </p>

          <Input
            type="email"
            placeholder="name@example.com"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Eg : xZqF4iskDTUYzQz"
            className="w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button onClick={handleSignUp} className="w-full" variant="default">
            {loading ? "Loading..." : "Login"}
          </Button>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={() => {}}>
            <FaGithubAlt className="mr-2 h-4 w-4" />
            GitHub
          </Button>

          <p className="text-center text-sm text-gray-500">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline hover:text-gray-800">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-gray-800">
              Privacy Policy
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLogin;
