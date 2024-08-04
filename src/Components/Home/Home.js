import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const { senderId } = useParams();
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the list of users
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5008/api/users'); // Adjust the URL as needed
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleUserClick = (receiverId) => {
        navigate(`/chat/${senderId}/${receiverId}`);
    };

    return (
        <div className="user-list">
            <h2>Select a User to Chat With</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <button onClick={() => handleUserClick(user.username)}>
                            {user.username}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
