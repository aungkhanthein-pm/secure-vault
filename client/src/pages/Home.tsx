import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { DASHBOARD_PATH, LOGIN_PATH } from "@/const";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to SecureVault</h1>
          <p className="text-muted-foreground mb-8">Your secure document storage</p>
          <Button onClick={() => navigate(DASHBOARD_PATH)} size="lg">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">SecureVault</h1>
        <p className="text-muted-foreground mb-8">Encrypted Document Storage</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate(LOGIN_PATH)} variant="default" size="lg">
            Sign In
          </Button>
          <Button onClick={() => navigate("/register")} variant="outline" size="lg">
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
