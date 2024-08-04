import React, { useEffect, useState, useRef } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import './Chat.css';
import { useParams, useNavigate } from 'react-router-dom';
import { formatTimestamp } from '../../Algorithms/calculatTime';
import grpcService from '../../gRPC/grpcService';

const Chat = () => {
    const { senderId, receiverId } = useParams();
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);
    const [fetchedMess, setFetchedMess] = useState([]);
    const connectionRef = useRef(null);
    const navigate = useNavigate();
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        // Fetch messages on component mount
        const fetchMessages = async () => {
            try {
                // Fetch chat history from both directions
                const senderMessages = await grpcService.getChatHistory(senderId, receiverId);
                const receiverMessages = await grpcService.getChatHistory(receiverId, senderId);

                // Combine and sort messages
                const allMessages = [...senderMessages, ...receiverMessages];
                const sortedMessages = allMessages.sort((a, b) => new Date(a.getTimestamp()) - new Date(b.getTimestamp()));

                setFetchedMess(sortedMessages);
            } catch (err) {
                console.error('Error fetching chat history: ', err);
            }
        };

        fetchMessages();
    }, [senderId, receiverId]);

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

    useEffect(() => {
        // Scroll to the bottom of the messages when they change
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, fetchedMess]);

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

    const handleBackClick = () => {
        navigate(`/${senderId}`); // Navigate to the home page
    };

    return (
        <div className="chat-container">
            <div className="receiver-info">
                <button className="back-button" onClick={handleBackClick}>Back</button>
                {receiverId}
            </div>
            <div className="chat-history">
                {fetchedMess.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.getSenderid() === senderId ? 'sender' : 'receiver'}`}
                    >
                        <div className="message-username">{msg.getSenderid()}</div>
                        <div className="message-text">{msg.getText()}</div>
                        <div className="message-timestamp">{formatTimestamp(msg.getTimestamp())}</div>
                    </div>
                ))}

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
