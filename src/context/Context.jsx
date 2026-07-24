import { createContext, useState } from "react";
import PropTypes from "prop-types";
import { marked } from "marked";
import DOMPurify from "dompurify";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [error, setError] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer ke liye

    // Puri chat state ko reset karta hai taaki "New Chat" sahi se kaam kare
    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setResultData("");
        setRecentPrompt("");
        setInput("");
        setError("");
    }

    const onSent = async (prompt) => {
        const finalPrompt = (prompt !== undefined ? prompt : input).trim();
        if (!finalPrompt) return; // sirf whitespace bhejne se roko

        setResultData("");
        setError("");
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(finalPrompt);

        if (prompt === undefined) {
            setPrevPrompts(prev => [...prev, finalPrompt]);
        }
        setInput("");

        try {
            const response = await runChat(finalPrompt);
            // Gemini ka markdown response (bold, lists, headings, code) ko
            // properly HTML mein render karo, sanitize karke (XSS se bachne ke liye)
            const rawHtml = marked.parse(response);
            const safeHtml = DOMPurify.sanitize(rawHtml);
            setResultData(safeHtml);
        } catch (err) {
            console.error("Gemini API error:", err);
            setError(err.message || "Kuch galat ho gaya. Dobara try karo.");
        } finally {
            setLoading(false);
        }
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        error,
        input,
        setInput,
        newChat,
        sidebarOpen,
        setSidebarOpen
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

ContextProvider.propTypes = {
    children: PropTypes.node
}

export default ContextProvider
