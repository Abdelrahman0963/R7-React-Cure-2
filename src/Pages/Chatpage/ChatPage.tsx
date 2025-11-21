import React, { useState, useEffect } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { getAllDoctors, getChats } from "../../api/Chat/chatService";

const ChatPage: React.FC = () => {
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [favouriteChats, setFavouriteChats] = useState<any[]>([]);
    const [allDoctors, setAllDoctors] = useState<any[]>([]);
    const [chats, setChats] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const doctors = await getAllDoctors();
            setAllDoctors(doctors);

            const chatsData = await getChats();
            setChats(chatsData);
        };

        fetchData();
    }, []);

    const handleToggleFavourite = (chat: any) => {
        chat.isFavourite = !chat.isFavourite;

        if (chat.isFavourite) {
            setFavouriteChats((prev) => {
                if (!prev.find((c) => c.id === chat.id)) return [...prev, chat];
                return prev;
            });
        } else {
            setFavouriteChats((prev) => prev.filter((c) => c.id !== chat.id));
        }
    };

    return (
        <div className="flex h-screen max-w-[1300px] mx-auto">
            <ChatSidebar onSelectChat={(chat) => setSelectedChat(chat)} favouriteChats={favouriteChats} allDoctors={allDoctors} chats={chats} />
            <ChatWindow selectedUser={selectedChat} onToggleFavourite={handleToggleFavourite} />
        </div>
    );
};

export default ChatPage;
// زززززززززززززز