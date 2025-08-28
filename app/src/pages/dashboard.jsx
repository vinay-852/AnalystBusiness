import { useEffect, useState } from "react";
import facebookInit from "../components/initialise";
import { useNavigate } from "react-router-dom";
import {useSelectedPage} from "../components/SelectedPageContext"
const Dashboard = () => {
  const [pages, setPages] = useState([]);
  const { setSelectedPage } = useSelectedPage();
  const navigate = useNavigate();

  useEffect(() => {
    facebookInit();
  }, []);

  const getDetails = () => {
    window.FB.api(
      '/me/accounts',
      'GET',
      {
        fields:
          "fan_count,access_token,can_post,followers_count,name,engagement,rating_count,location,instagram_business_account,new_like_count,posts,general_info"
      },
      function (response) {
        if (response && response.data) {
          setPages(response.data);
        } else {
          setPages([]);
        }
      }
    );
  };

  useEffect(() => {
    getDetails();
  }, []);

  const handleChoose = (page) => {
    setSelectedPage(page);
    navigate("/main");
  };

  return (
    <div
      style={{
        fontFamily: "Lora, serif",
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f3f4f6',
        padding: '24px'
      }}
    >
      {pages.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            border: '1px solid #ccc',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '350px',
            background: 'white',
            boxShadow: '0 4px 16px rgba(0,0,0,0.07)'
          }}
        >
          No Facebook Page Data Available
        </div>
      ) : (
        pages.map((page, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              padding: '30px',
              borderRadius: '8px',
              maxWidth: '350px',
              background: 'white',
              boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
              textAlign: 'left',
              marginRight: '10px',
              marginLeft: '10px'
            }}
          >
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px' }}>
              {page.name || "N/A"}
            </h2>
            <p><strong>Fans:</strong> {page.fan_count ?? "N/A"}</p>
            <p><strong>Followers:</strong> {page.followers_count ?? "N/A"}</p>
            <p><strong>Can Post:</strong> {page.can_post ? "Yes" : "No"}</p>
            <p><strong>Engagement:</strong> {page.engagement?.count ?? "N/A"}</p>
            <p><strong>Rating Count:</strong> {page.rating_count ?? "N/A"}</p>
            <p><strong>Location:</strong> {page.location?.city ?? "N/A"}</p>
            <p><strong>Instagram Business Account:</strong> {page.instagram_business_account ? "Yes" : "No"}</p>
            <p><strong>New Likes:</strong> {page.new_like_count ?? "N/A"}</p>
            <p><strong>Total Posts:</strong> {page.posts?.data?.length ?? "N/A"}</p>
            <p><strong>General Info:</strong> {page.general_info ?? "N/A"}</p>
            <button
              onClick={() => handleChoose(page)}
              style={{ padding: '10px', border: 'none', borderRadius: '4px', backgroundColor: '#4267B2', color: 'white', cursor: 'pointer' }}
            >
              Choose
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
