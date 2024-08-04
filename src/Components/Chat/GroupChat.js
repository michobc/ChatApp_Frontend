import React, { useEffect, useState, useRef } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import './Chat.css';
import { useParams, useNavigate } from 'react-router-dom';
import { formatTimestamp } from '../../Algorithms/calculatTime';

const GroupChat = () => {
    const { senderId, groupName } = useParams();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const connectionRef = useRef(null);
    const navigate = useNavigate();
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        // Scroll to the bottom of the messages when they change
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        const connect = async () => {
            const conn = new HubConnectionBuilder()
                .withUrl('http://localhost:5008/chathub')
                .configureLogging(LogLevel.Information)
                .build();
    
            connectionRef.current = conn;
    
            conn.onclose((error) => {
                console.log('Connection closed:', error);
            });
    
            conn.on('ReceiveMessage', (newMessage) => {
                console.log('Received Message:', newMessage);
                setMessages(prevMessages => [...prevMessages, newMessage].sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp)));
            });
    
            try {
                await conn.start();
                console.log('SignalR connection started');
                await conn.invoke('JoinGroup', groupName);
            } catch (err) {
                console.error('Error starting SignalR connection:', err);
            }
        };
        
        connect();
    
        return () => {
            if (connectionRef.current) {
                connectionRef.current.invoke('LeaveGroup', groupName).catch(err => console.error('Error leaving group:', err));
                connectionRef.current.stop().catch(err => console.error('Error stopping SignalR connection:', err));
            }
        };
    }, [groupName]);       

    const handleSendMessage = async () => {
        const conn = connectionRef.current;
        if (conn) {
            try {
                await conn.invoke('SendMessageToGroup',groupName, senderId, message);
                setMessage('');
            } catch (err) {
                console.error('Error sending message:', err);
            }
        }
    };

    const handleBackClick = () => {
        navigate(`/${senderId}`); // Navigate to the home page
    };

    return (
        <div className="chat-container">
            <div className="receiver-info">
            <button className="back-button" onClick={handleBackClick}>Back</button>
                {groupName}
            </div>
            <div className="chat-history">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.senderId === senderId ? 'sender' : 'receiver'}`}
                    >
                        <div className="message-username">{msg.senderId}</div>
                        <div className="message-text">{msg.text}</div>
                        <div className="message-timestamp">{formatTimestamp(msg.timestamp)}</div>
                    </div>
                ))}
                <div ref={endOfMessagesRef} />
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default GroupChat;
