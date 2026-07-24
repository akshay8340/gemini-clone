import { useContext } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'

const suggestionCards = [
    {
        text: "Suggest beautiful places to see on an upcoming road trip",
        icon: "compass_icon",
    },
    {
        text: "Briefly summarize this concept: urban planning",
        icon: "bulb_icon",
    },
    {
        text: "Brainstorm team bonding activities for our work retreat",
        icon: "message_icon",
    },
    {
        text: "Tell me about React js and React native",
        icon: "code_icon",
    },
]

const Main = () => {

    const { onSent, recentPrompt, showResult, loading, resultData, error, setInput, input, setSidebarOpen } = useContext(Context)

    const handleSend = () => {
        if (loading) return
        onSent()
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !loading) {
            handleSend()
        }
    }

    const handleCardClick = (text) => {
        if (loading) return
        onSent(text)
    }

    return (
        <div className='main'>
            <div className="nav">
                <img
                    className="mobile-menu-icon"
                    onClick={() => setSidebarOpen(true)}
                    src={assets.menu_icon}
                    alt="Open menu"
                />
                <p>Gemini</p>
                <img src={assets.user_icon} alt="" />
            </div>
            <div className="main-container">

                {!showResult
                    ? <>
                        <div className="greet">
                            <p><span>Hello, Aksh.</span></p>
                            <p>How can I help you today?</p>
                        </div>
                        <div className="cards">
                            {suggestionCards.map((card, index) => (
                                <div
                                    key={index}
                                    className="card"
                                    onClick={() => handleCardClick(card.text)}
                                >
                                    <p>{card.text}</p>
                                    <img src={assets[card.icon]} alt="" />
                                </div>
                            ))}
                        </div>
                    </>
                    : <div className='result'>
                        <div className="result-title">
                            <img src={assets.user_icon} alt="" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="" />
                            {loading
                                ? <div className='loader'>
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                                : error
                                    ? <p className="error-text">⚠️ {error}</p>
                                    : <div className="markdown-body" dangerouslySetInnerHTML={{ __html: resultData }}></div>
                            }
                        </div>
                    </div>
                }

                <div className="main-bottom">
                    <div className="search-box">
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            value={input}
                            type="text"
                            placeholder='Enter a prompt here'
                            disabled={loading}
                        />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            {input.trim() ? <img onClick={handleSend} src={assets.send_icon} alt="" /> : null}
                        </div>
                    </div>
                    <p className="bottom-info">
                        Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Main
