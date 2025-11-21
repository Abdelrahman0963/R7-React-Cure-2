import React, { useState, useEffect, type ChangeEvent } from "react";
import { FiSearch } from "react-icons/fi";

interface ChatSidebarProps {
    onSelectChat: (chat: any) => void;
    favouriteChats: any[];
    allDoctors: any[];
    chats: any[];
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelectChat, favouriteChats, allDoctors, chats }) => {
    const [searchValue, setSearchValue] = useState("");
    const [selectedTab, setSelectedTab] = useState<"All" | "Unread" | "Favourite">("All");
    const [displayedChats, setDisplayedChats] = useState<any[]>([]);

    useEffect(() => {
        let list: any[] = [];

        if (selectedTab === "All") {
            // دمج كل الدكاترة مع المحادثات
            list = allDoctors
                .map((doc) => {
                    const chat = chats.find((c) => c.doctorId === doc.id);
                    return {
                        id: doc.id,
                        doctorId: doc.id,
                        doctorName: doc.fullName,
                        img: doc.imgUrl,
                        lastMessageContent: chat?.lastMessageContent || "", // مش هنعرض نص افتراضي
                        isLastMessageSentByPatient: chat?.isLastMessageSentByPatient ?? true,
                        unReadMessages: chat?.unReadMessages ?? 0,
                        isFavourite: doc.isFavourite,
                    };
                })
                .filter((d) => d.doctorName.toLowerCase().includes(searchValue.toLowerCase()));
        } else if (selectedTab === "Favourite") {
            list = favouriteChats.filter((c) => c.doctorName.toLowerCase().includes(searchValue.toLowerCase()));
        } else if (selectedTab === "Unread") {
            list = chats.filter((c) => c.unReadMessages > 0).filter((c) => c.doctorName.toLowerCase().includes(searchValue.toLowerCase()));
        }

        setDisplayedChats(list);
    }, [searchValue, selectedTab, allDoctors, chats, favouriteChats]);

    const tabs = ["All", "Unread", "Favourite"];

    return (
        <div className="w-1/3 min-w-[280px] h-full bg-white border-r flex flex-col p-4">
            {/* Search */}
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
                <FiSearch className="text-gray-500 mr-2" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                    className="bg-transparent outline-none w-full text-sm"
                />
            </div>

            {/* Tabs */}
            <div className="flex gap-3 mb-4 justify-around">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab as any)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                            selectedTab === tab ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {displayedChats.length > 0 ? (
                    displayedChats.map((chat) => (
                        <div key={chat.id} onClick={() => onSelectChat(chat)} className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center text-white font-bold">
                                    {!chat.img && chat.doctorName[0]}
                                    {chat.img && <img src={chat.img} alt={chat.doctorName} className="w-full h-full object-cover" />}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">{chat.doctorName}</h4>
                                    <p className="text-xs text-gray-500 truncate w-[130px]">{chat.lastMessageContent}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                {chat.unReadMessages > 0 && <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full">{chat.unReadMessages}</span>}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm text-center mt-10">No conversations found</p>
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;
// وووووووووووووو