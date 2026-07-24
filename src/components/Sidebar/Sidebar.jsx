import { useContext, useState, useEffect } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Sidebar = () => {

  const [extended, setExtended] = useState(false);
  const { onSent, prevPrompts, setRecentPrompt, newChat, sidebarOpen, setSidebarOpen } = useContext(Context)

  // Mobile drawer khulte hi labels bhi dikha do (poori width available hai)
  useEffect(() => {
    if (sidebarOpen) setExtended(true)
  }, [sidebarOpen])

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt)
    setSidebarOpen(false) // mobile par prompt select karte hi drawer band ho jaaye
    await onSent(prompt)
  }

  const handleNewChat = () => {
    newChat()
    setSidebarOpen(false)
  }

  return (
    <>
      {/* Mobile par drawer khula ho to background par dark overlay, tap karke band ho jaaye */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <div className={`sidebar ${sidebarOpen ? "mobile-open" : ""}`}>
        <div className="top">
          <img onClick={() => setExtended(prev => !prev)} className="menu" src={assets.menu_icon} alt="" />
          <div onClick={handleNewChat} className="new-chat">
            <img src={assets.plus_icon} alt="" />
            {extended ? <p>New Chat</p> : null}
          </div>
          {extended ?
            <div className="recent">
              <p className="recent-title">Recent</p>
              {prevPrompts.map((item, index) => {
                return (
                  <div key={index} onClick={() => loadPrompt(item)} className="recent-entry">
                    <img src={assets.message_icon} alt="" />
                    <p>{item.slice(0, 18)} ...</p>
                  </div>
                )
              })}

            </div>
            : null}
        </div>
        <div className="bottom">
          <div className="bottom-item recent-entry">
            <img src={assets.question_icon} alt="" />
            {extended ? <p>Help</p> : null}
          </div>
          <div className="bottom-item recent-entry">
            <img src={assets.history_icon} alt="" />
            {extended ? <p>Activity</p> : null}
          </div>
          <div className="bottom-item recent-entry">
            <img src={assets.setting_icon} alt="" />
            {extended ? <p>Settings</p> : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
