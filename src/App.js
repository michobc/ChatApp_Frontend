import { Routes, Route } from 'react-router-dom';
import Chat from './Components/Chat/Chat';
import GroupChat from './Components/Chat/GroupChat';
import Home from './Components/Home/Home';

function App() {
  return (
    <>
    <Routes>
    <Route path="/:senderId" element={<Home />} />
      <Route path="/chat/:senderId/:receiverId" element={<Chat/>} />
      <Route path="/groupchat/:senderId/:groupName" element={<GroupChat/>} />
    </Routes>
    </>
);
}

export default App;
