
import { useSelectedPage } from "../components/SelectedPageContext";
import { useState } from "react";
import { useUserChoices } from "../components/UserChoicesContext";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import FloatingChatBox from "../components/FloatingChatBox";
import GeminiModal from "../components/GeminiModal";

const Main = () => {

  const { selectedPage } = useSelectedPage();
  const { userChoices, setUserChoices } = useUserChoices();
  const [chatOpen, setChatOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = () => window.location.reload();
  const handleAddChoice = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleOpenChat = () => setChatOpen(true);
  const handleCloseChat = () => setChatOpen(false);

  // Prepare artistContext for GeminiModal
  const artistContext = selectedPage
    ? {
        pageName: selectedPage.name || "Unknown Artist",
        followers: selectedPage.followers_count || 0,
        likes: selectedPage.fan_count || 0,
        recentPosts: selectedPage.recentPosts || ["No recent posts"]
      }
    : null;

  // Handle finish from GeminiModal
  const handleGeminiFinish = (summary) => {
    setUserChoices((prev) => [...prev, summary]);
  };



  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Lora, serif",
      }}
    >
      <Header onLogout={handleLogout} />
      <section style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar
          selectedPage={selectedPage}
          onAddChoice={handleAddChoice}
        />
        <div style={{ display: "flex", flex: 1, transition: "all 0.3s ease-in-out" }}>
          <MainContent
            selectedPage={selectedPage}
            chatOpen={chatOpen}
            onOpenChat={handleOpenChat}
          />
          {chatOpen && <FloatingChatBox onClose={handleCloseChat} />}
        </div>
      </section>
      <GeminiModal
        open={modalOpen}
        onClose={handleCloseModal}
        artistContext={artistContext}
        onFinish={handleGeminiFinish}
      />
    </div>
  );
};

export default Main;
