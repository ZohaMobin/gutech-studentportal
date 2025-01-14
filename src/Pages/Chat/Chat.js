import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
// Importing icons from react-icons
import { FaEllipsisV, FaSearch, FaEnvelope } from "react-icons/fa";

const Chat = () => {
    // Separate lists for teachers and students with email addresses
    const initialTeachers = [
        {
            id: "teacher1",
            name: "DR JG",
            avatar: "/images.jpg",
            lastSeen: "Today, 9:52pm",
            email: "dr.jg@example.com",
        },
        {
            id: "teacher2",
            name: "Maam Zoha",
            avatar: "/images.jpg",
            lastSeen: "Yesterday, 12:31pm",
            email: "zoha.maam@example.com",
        },
        {
            id: "teacher3",
            name: "Sir Twaha Minai",
            avatar: "/images.jpg",
            lastSeen: "Wednesday, 9:12pm",
            email: "twaha.minai@example.com",
        },
        {
            id: "teacher4",
            name: "Sir Zeeshan",
            avatar: "/images.jpg",
            lastSeen: "Tuesday, 10:23pm",
            email: "zeeshan.sir@example.com",
        },
    ];

    const initialStudents = [
        {
            id: "student1",
            name: "Mudassir Muneer",
            avatar: "/images.jpg",
            lastSeen: "Today, 9:52pm",
            email: "mudassir.muneer@example.com",
        },
        {
            id: "student2",
            name: "Huzaifa Soomar",
            avatar: "/images.jpg",
            lastSeen: "Today, 12:11pm",
            email: "huzaifa.soomar@example.com",
        },
        {
            id: "student3",
            name: "Syed Owais Bin Najam",
            avatar: "/images.jpg",
            lastSeen: "Yesterday, 10:23pm",
            email: "syed.owais@example.com",
        },
    ];

    // Initial messages for each contact
    const initialMessages = {
        teacher1: [
            { sender: "them", text: "Hey There!", time: "Today, 8:30pm" },
            { sender: "them", text: "How are you?", time: "Today, 8:31pm" },
            { sender: "you", text: "Hello!", time: "Today, 8:33pm" },
            { sender: "you", text: "I'm good, how are you?", time: "Today, 8:34pm" },
            { sender: "them", text: "I am doing well, Can we meet?", time: "Today, 8:36pm" },
            { sender: "you", text: "Yes, sure!", time: "Today, 8:58pm" },
        ],
        // Add initial messages for other contacts if needed
    };

    const [teachers, setTeachers] = useState(initialTeachers);
    const [students, setStudents] = useState(initialStudents);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState("");
    const [showEmail, setShowEmail] = useState(false); // State to toggle email display

    const messagesEndRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, selectedContact]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter contacts based on search query
    const filterContacts = (contactsList) => {
        return contactsList.filter((contact) =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const filteredTeachers = filterContacts(teachers);
    const filteredStudents = filterContacts(students);

    // Handle contact selection
    const handleContactClick = (contact) => {
        setSelectedContact(contact);
        setShowEmail(false); // Reset email display when selecting a new contact
    };

    // Handle sending a new message
    const handleSendMessage = () => {
        if (newMessage.trim() === "" || !selectedContact) return;

        const timestamp = new Date().toLocaleString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        const newMsg = {
            sender: "you",
            text: newMessage.trim(),
            time: timestamp,
        };

        setMessages((prevMessages) => {
            const contactId = selectedContact.id;
            const contactMessages = prevMessages[contactId] || [];
            return {
                ...prevMessages,
                [contactId]: [...contactMessages, newMsg],
            };
        });

        setNewMessage("");
    };

    // Handle pressing Enter to send message
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    // Handle Mail Icon Click
    const handleMailClick = () => {
        if (selectedContact) {
            setShowEmail((prev) => !prev); // Toggle email display
        }
    };

    return (
        <div className="chat-container">
            <div className="sidebar">
                <h1 className="sidebar-title">Discussions - Chat</h1>
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* Teachers Section */}
                <div className="section">
                    <h2 className="section-title">Teachers</h2>
                    <ul className="list">
                        {filteredTeachers.map((teacher) => (
                            <li
                                key={teacher.id}
                                onClick={() => handleContactClick(teacher)}
                                className={selectedContact && selectedContact.id === teacher.id ? "active" : ""}
                            >
                                <img src={teacher.avatar} alt={teacher.name} className="list-item-avatar" />
                                <div className="list-item-info">
                                    <div className="list-item-name">{teacher.name}</div>
                                    <div className="list-item-time">{teacher.lastSeen}</div>
                                </div>
                            </li>
                        ))}
                        {filteredTeachers.length === 0 && (
                            <li className="no-results">No teachers found.</li>
                        )}
                    </ul>
                </div>

                {/* Students Section */}
                <div className="section">
                    <h2 className="section-title">Students</h2>
                    <ul className="list">
                        {filteredStudents.map((student) => (
                            <li
                                key={student.id}
                                onClick={() => handleContactClick(student)}
                                className={selectedContact && selectedContact.id === student.id ? "active" : ""}
                            >
                                <img src={student.avatar} alt={student.name} className="list-item-avatar" />
                                <div className="list-item-info">
                                    <div className="list-item-name">{student.name}</div>
                                    <div className="list-item-time">{student.lastSeen}</div>
                                </div>
                            </li>
                        ))}
                        {filteredStudents.length === 0 && (
                            <li className="no-results">No students found.</li>
                        )}
                    </ul>
                </div>
            </div>
            <div className="chat-area">
                {selectedContact ? (
                    <>
                        <div className="chat-header">
                            <div className="user-info">
                                <img
                                    src={selectedContact.avatar}
                                    alt={selectedContact.name}
                                    className="user-avatar"
                                />
                                <div>
                                    <h3 className="user-name">{selectedContact.name}</h3>
                                    <p className="user-status">
                                        {selectedContact.email}
                                    </p>
                                </div>
                            </div>
                            {/* New Icons Section */}
                            <div className="chat-header-icons">
                                <div className="icon-container">
                                    <FaEnvelope
                                        className="header-icon"
                                        onClick={handleMailClick}
                                        title="View Email"
                                        aria-label="View Email"
                                    />
                                    {showEmail && (
                                        <div className="email-display">
                                            {selectedContact.email}
                                        </div>
                                    )}
                                </div>
                                <FaEllipsisV className="header-icon" />
                            </div>
                        </div>
                        <div className="chat-messages">
                        {selectedContact && (
                            <img
                               src="/gutechlogo.png"
                               alt="GUtech Logo"
                               className="chat-background-logo"
        />
                        )}
                            {messages[selectedContact.id] && messages[selectedContact.id].length > 0 ? (
                                messages[selectedContact.id].map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`message ${msg.sender === "you" ? "right" : "left"}`}
                                    >
                                        <div className={`bubble-${msg.sender === "you" ? "right" : "left"}`}>
                                            <p>{msg.text}</p>
                                        </div>
                                        <span className="message-time">{msg.time}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="no-messages">No messages yet. Start the conversation!</p>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="chat-input-box">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button className="send-btn" onClick={handleSendMessage}>
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="no-contact-selected">
                        <p>Select a contact to start chatting.</p>
                        <img src="/gutechlogo.png" alt="Gutech Logo" style={{ backgroundColor: "#323232", width: "200px", height: "70px" }} />
                    </div>
                )}
            </div>
        </div>
    );

};

export default Chat;
