import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import './Home.css';

const Home = () => {
    const { senderId } = useParams();
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [notifications, setNotifications] = useState({});
    const connectionRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the list of users
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5008/api/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        // Fetch the list of groups
        const fetchGroups = async () => {
            try {
                const response = await fetch('http://localhost:5008/api/groups');
                const data = await response.json();
                setGroups(data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        fetchUsers();
        fetchGroups();
    }, []);

    // // Connect to SignalR hub
    // useEffect(() => {
    //     const connect = async () => {
    //         const conn = new HubConnectionBuilder()
    //             .withUrl('http://localhost:5008/chathub')
    //             .configureLogging(LogLevel.Information)
    //             .build();

    //         connectionRef.current = conn;

    //         conn.on('ReceiveNotification', (unreadCount) => {
    //             // Update notifications state
    //             setNotifications(prev => ({ ...prev, [senderId]: unreadCount }));
    //             console.log(notifications);
    //         });

    //         try {
    //             await conn.start();
    //             await conn.invoke('Connect', senderId);
    //             console.log('SignalR connection started');
    //         } catch (err) {
    //             console.error('Error starting SignalR connection:', err);
    //         }
    //     };

    //     connect();

    //     return () => {
    //         if (connectionRef.current) {
    //             connectionRef.current.stop().catch(err => console.error('Error stopping SignalR connection:', err));
    //         }
    //     };
    // }, [senderId]);


    const handleUserClick = (receiverId) => {
        navigate(`/chat/${senderId}/${receiverId}`);
    };

    const handleGroupClick = (grpname) => {
        navigate(`/groupchat/${senderId}/${grpname}`);
    };

    return (
        <div className="user-list">
            <h2>{senderId}</h2>
            <h2>Users to Chat With</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <button onClick={() => handleUserClick(user.username)}>
                            {user.username}
                            {notifications[user.id] > 0 && (
                                <span className="notification-badge">
                                    {notifications[user.id]}
                                </span>
                            )}
                        </button>
                    </li>
                ))}
            </ul>
            <h2>Groups to Chat With</h2>
            <ul>
                {groups.map(grp => (
                    <li key={grp.id}>
                        <button onClick={() => handleGroupClick(grp.name)}>
                            {grp.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
