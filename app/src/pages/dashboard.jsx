import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import facebookInit from "../components/initialise";
import { useAuth } from "../components/AuthContext";


const Dashboard = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    facebookInit();

    if (!accessToken) {
      // No token in memory → force user back to login
      navigate("/login");
    }
  }, [accessToken, navigate]);

  const getDetails = () => {
    if (!accessToken) return;

    window.FB.api(
      "/me",
      "GET",
      { fields: "id,name", access_token: accessToken }, // pass token explicitly
      function (response) {
        console.log("User Details:", response);
        alert(`ID: ${response.id}, Name: ${response.name}`);
      }
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <button
        onClick={getDetails}
        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
      >
        Get User Details
      </button>
    </div>
  );
};

export default Dashboard;
