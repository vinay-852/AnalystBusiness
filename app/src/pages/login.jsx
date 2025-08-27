import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import facebookInit from "../components/initialise";
import { useAuth } from "../components/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  useEffect(() => {
    facebookInit();
  }, []);

  const handleFacebookLogin = () => {
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          const token = response.authResponse.accessToken;
          setAccessToken(token);
          navigate("/");
        } else {
          console.warn("User cancelled login or did not fully authorize.");
          alert("Login failed. Please try again.");
        }
      },
      {
        scope: "public_profile,email,pages_show_list,instagram_basic,instagram_manage_insights,instagram_manage_comments",
      }
    );
  };

  return (
    <div style={{ fontFamily: "Lora, serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%' }}>
      <div style={{ textAlign: 'center', marginTop: '20%', border: '1px solid #ccc', padding: '30px', borderRadius: '8px' ,maxWidth: '350px'}}>
        <h2 className="">Artist Campanion</h2>
        <p>Login to manage your art and connect with other artists.</p>
        <button
          onClick={handleFacebookLogin}
          style={{ padding: '10px', border: 'none', borderRadius: '4px', backgroundColor: '#4267B2', color: 'white', cursor: 'pointer' }}
        >
        Login with Facebook
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
