import AuthHero from "../project_component/AuthHero";
import AuthLogin from "../project_component/AuthLogin";

const AuthPage = () => {
  return (
    <div className="min-h-screen grid grid-cols-2">
      <AuthHero />
      <AuthLogin />
    </div>
  );
};

export default AuthPage;
