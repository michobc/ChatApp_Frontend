import React, { useEffect, useState, useRef } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import './Chat.css';
import { useParams } from 'react-router-dom';
import { formatTimestamp } from '../../Algorithms/calculatTime';

const Chat = () => {
    const { senderId, receiverId } = useParams();
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);
    const connectionRef = useRef(null);

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
                await conn.invoke('Connect', senderId); // Connect the user to the SignalR hub
                console.log('Sender connected to hub');
            } catch (err) {
                console.error('Error starting SignalR connection:', err);
            }
        };
    
        connect();
    
        return () => {
            if (connectionRef.current) {
                connectionRef.current.invoke('Disconnect', senderId).catch(err => console.error('Error disconnecting SignalR connection:', err));
                connectionRef.current.stop().catch(err => console.error('Error stopping SignalR connection:', err));
            }
        };
    }, [senderId, receiverId]);    

    const handleSendMessage = async () => {
        const conn = connectionRef.current;
        if (conn) {
            try {
                await conn.invoke('SendMessage', senderId, receiverId, text);
                setMessages(prevMessages => [...prevMessages, { senderId, receiverId, text, timestamp: new Date().toISOString() }].sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp)));

                setText('');
            } catch (err) {
                console.error('Error sending message:', err);
            }
        }
    };

    return (
        <div className="chat-container">
            <div className="receiver-info">
                {receiverId}
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
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
