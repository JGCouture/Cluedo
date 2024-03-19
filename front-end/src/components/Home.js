import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
    const navigate = useNavigate();

    function GameJoin() {
        navigate('/join');
    }
    
    return (
        <div className="container-fluid bg-image1 text-center">
            <div className="fixed-bottom mb-5 pb-5">
                <button className="start-button" onClick={GameJoin} key="startButton">
                    <span className="start-text">Let's Start</span>
                </button>
            </div>
            <div className="fixed-bottom">
                <footer className="text-body-secondary text-center text-small mt-md-5">
                    <span className="foot-info mb-1">© 2023–2024 GameJHU</span>
                </footer>
            </div>
        </div>
    );
}
