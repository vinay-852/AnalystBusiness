import React from "react";
import { useNavigate } from "react-router";

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  return (
    <header
      style={{
        padding: "12px 24px",
        background: "#4267B2",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      }}
    >
      <nav>
        <ul
          style={{
            listStyleType: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            gap: "12px",
          }}
        >
          <li
            style={{
              cursor: "pointer",
              padding: "8px 14px",
              background: "white",
              color: "black",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "all 0.2s",
            }}
          >
            <a onClick={() => navigate("/post")}> "Post Guidance" </a>
          </li>
          <li
            style={{
                cursor: "pointer",
                padding: "8px 14px",
                background: "white",
                color: "black",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "all 0.2s",
              }}
            >
              <a onClick={() => navigate("/")}>"Dashboard"</a>
            </li>
        </ul>
      </nav>
      <button
        onClick={onLogout}
        style={{
          background: "blue",
          color: "white",
          padding: "8px 16px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
        onMouseOver={e => (e.currentTarget.style.background = "#244e9d")}
        onMouseOut={e => (e.currentTarget.style.background = "blue")}
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
