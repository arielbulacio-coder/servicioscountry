import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Chat = () => {
    const { state } = useLocation(); // Can pass initial contact via navigation state
    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useState(state?.contact || null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) navigate('/login');
        setCurrentUser(user);

        fetchContacts();
    }, []);

    useEffect(() => {
        if (activeContact) {
            setupActiveChat(activeContact);
        }
    }, [activeContact]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchContacts = async () => {
        try {
            const response = await api.get('/api/chat/contacts');
            let fetchedContacts = response.data;

            // If started from profile with a contact not in history, add it
            if (state?.contact && !fetchedContacts.find(c => c.id === state.contact.id)) {
                fetchedContacts = [state.contact, ...fetchedContacts];
            }

            setContacts(fetchedContacts);

            if (!activeContact && fetchedContacts.length > 0) {
                setActiveContact(fetchedContacts[0]);
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const setupActiveChat = async (contact) => {
        try {
            const response = await api.get(`/api/chat/${contact.id}`);
            setMessages(response.data);

            // Poll for new messages every 3 seconds (simple implementation)
            const interval = setInterval(async () => {
                const res = await api.get(`/api/chat/${contact.id}`);
                setMessages(res.data);
            }, 3000);

            return () => clearInterval(interval);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeContact) return;

        try {
            const tempMessage = {
                id: Date.now(),
                content: newMessage,
                senderId: currentUser.id,
                receiverId: activeContact.id,
                createdAt: new Date().toISOString() // Optimistic UI
            };
            setMessages([...messages, tempMessage]);
            setNewMessage('');

            await api.post('/api/chat', {
                receiverId: activeContact.id,
                content: newMessage
            });

            // Refresh real state
            const res = await api.get(`/api/chat/${activeContact.id}`);
            setMessages(res.data);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="h-screen bg-slate-900 flex text-white overflow-hidden">
            {/* Sidebar / Contacts List */}
            <div className="w-1/4 min-w-[250px] bg-slate-800 border-r border-slate-700 flex flex-col">
                <div className="p-4 border-b border-slate-700">
                    <button onClick={() => navigate('/dashboard')} className="text-sm text-slate-400 hover:text-white mb-2">← Volver al Panel</button>
                    <h2 className="text-xl font-bold">Mensajes</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {contacts.map(contact => (
                        <div
                            key={contact.id}
                            onClick={() => setActiveContact(contact)}
                            className={`p-4 cursor-pointer hover:bg-slate-700 transition-colors border-b border-slate-700/50 ${activeContact?.id === contact.id ? 'bg-slate-700 border-l-4 border-blue-500' : ''}`}
                        >
                            <h3 className="font-semibold">{contact.name}</h3>
                            <span className="text-xs text-slate-400 capitalize">{contact.role} {contact.serviceType ? `- ${contact.serviceType}` : ''}</span>
                        </div>
                    ))}
                    {contacts.length === 0 && (
                        <p className="p-4 text-slate-500 text-sm italic">No tienes conversaciones recientes.</p>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-900">
                {activeContact ? (
                    <>
                        <div className="p-4 bg-slate-800 border-b border-slate-700 shadow-md flex justify-between items-center h-16">
                            <div>
                                <h3 className="font-bold text-lg">{activeContact.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    <span className="text-xs text-slate-400">En línea</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
                            {messages.map((msg) => {
                                const isMe = msg.senderId === currentUser.id;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] rounded-2xl p-3 px-4 shadow-md ${isMe
                                                ? 'bg-blue-600 text-white rounded-tr-none'
                                                : 'bg-slate-700 text-slate-200 rounded-tl-none'
                                            }`}>
                                            <p>{msg.content}</p>
                                            <span className={`text-[10px] block mt-1 opacity-70 ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 bg-slate-800 border-t border-slate-700 flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Escribe un mensaje..."
                                className="flex-1 bg-slate-700 text-white rounded-full px-4 py-2 border border-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-2xl h-10 w-10 flex items-center justify-center rounded-full transition-transform active:scale-95 shadow-lg"
                            >
                                ➤
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                        <div className="text-6xl mb-4">💬</div>
                        <p className="text-lg">Selecciona un contacto para comenzar a chatear.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
