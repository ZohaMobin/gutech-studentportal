import React from "react";
import "./Chat.css";
// Importing icons from react-icons
import { FaPhone, FaVideo, FaEllipsisV } from "react-icons/fa";

const Chat = () => {
    return (
        <div className="chat-container">
            <div className="sidebar">
                <h1 className="sidebar-title">Discussions - Chat</h1>
                <div className="search-bar">
                    <input type="text" placeholder="Search..." />
                </div>
                <div className="section">
                    <h2 className="section-title">Teachers</h2>
                    <ul className="list">
                        <li>
                            <img src="/images.jpg" alt="DR JG" className="list-item-avatar" />
                            <div className="list-item-info">
                                <div className="list-item-name">DR JG</div>
                                <div className="list-item-time">Today, 9:52pm</div>
                            </div>
                        </li>
                        <li>
                            <img src="/images.jpg" alt="Maam Zoha" className="list-item-avatar" />
                            <div className="list-item-info">
                                <div className="list-item-name">Maam Zoha</div>
                                <div className="list-item-time">Yesterday, 12:31pm</div>
                            </div>
                        </li>
                        <li>
                            <img src="/images.jpg" alt="Sir Twaha Minai" className="list-item-avatar" />
                            <div className="list-item-info">
                                <div className="list-item-name">Sir Twaha Minai</div>
                                <div className="list-item-time">Wednesday, 9:12pm</div>
                            </div>
                        </li>
                        <li>
                            <img src="/images.jpg" alt="Sir Zeeshan" className="list-item-avatar" />
                            <div className="list-item-info">
                                <div className="list-item-name">Sir Zeeshan</div>
                                <div className="list-item-time">Tuesday, 10:23pm</div>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="section">
                    <h2 className="section-title">Students</h2>
                    <ul className="list">
                        <li>
                            <img src="/images.jpg" alt="Mudassir Muneer" className="list-item-avatar" />
                            <div className="list-item-info">
                                <div className="list-item-name">Mudassir Muneer</div>
                                <div className="list-item-time">Today, 9:52pm</div>
                            </div>
                        </li>
                        <li>
                            <img src="/images.jpg" alt="Huzaifa Soomar" className="list-item-avatar" />
                            <div className="list-item-info">
                                <div className="list-item-name">Huzaifa Soomar</div>
                                <div className="list-item-time">Today, 12:11pm</div>
                            </div>
                        </li>
                        <li>
                            <img src="/images.jpg" alt="Syed Owais Bin Najam" className="list-item-avatar" />
                            <div className="list-item-info">
                                <div className="list-item-name">Syed Owais Bin Najam</div>
                                <div className="list-item-time">Yesterday, 10:23pm</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="chat-area">
                <div className="chat-header">
                    <div className="user-info">
                        <img
                            src="/images.jpg"
                            alt="Anil"
                            className="user-avatar"
                        />
                        <div>
                            <h3 className="user-name">Anil</h3>
                            <p className="user-status">Online - Last seen, 2:02pm</p>
                        </div>
                    </div>
                    {/* New Icons Section */}
                    <div className="chat-header-icons">
                        <FaPhone className="header-icon" />
                        <FaVideo className="header-icon" />
                        <FaEllipsisV className="header-icon" />
                    </div>
                </div>
                <div className="chat-messages">
                    <div className="message left">
                        <div className="bubble-left">
                            <p>Hey There!</p>
                        </div>
                        <span className="message-time">Today, 8:30pm</span>
                    </div>
                    <div className="message left">
                        <div className="bubble-left">
                            <p>How are you?</p>
                        </div>
                        <span className="message-time">Today, 8:31pm</span>
                    </div>
                    <div className="message right">
                        <div className="bubble-right">
                            <p>Hello!</p>
                        </div>
                        <span className="message-time">Today, 8:33pm</span>
                    </div>

                    <div className="message right">
                        <div className="bubble-right">
                            <p>I'm good, how are you?</p>
                        </div>
                        <span className="message-time">Today, 8:34pm</span>
                    </div>

                    <div className="message left">
                        <div className="bubble-left">
                            <p>I am doing well, Can we meet?</p>
                        </div>
                        <span className="message-time">Today, 8:36pm</span>
                    </div>

                    <div className="message right">
                        <div className="bubble-right">
                            <p>Yes, sure!</p>
                        </div>
                        <span className="message-time">Today, 8:58pm</span>
                    </div>
                </div>

                <div className="chat-input-box">
                    <input type="text" placeholder="Type your message..." />
                    <button className="send-btn">Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
