'use client';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export default function Home() {
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null); // 👈 reference to the last message
  const [name, setName] = useState('');
  const [tempName, setTempName] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socketRef.current = io({
      path: '/api/socket_io',
    });

    socketRef.current.on('chat-history', (msgs) => {
      setMessages(msgs);
    });

    socketRef.current.on('chat-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = () => {
    if (input && name) {
      socketRef.current.emit('chat-message', { name, text: input });
      setInput('');
    }
  };

  const handleJoin = () => {
    if (tempName.trim()) {
      setName(tempName.trim());
    }
  };

  return (
    <div className="text-black flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6">
        {!name ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Enter your name to join</h2>
            <input
              className="w-full border p-2 rounded"
              placeholder="Your full name"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleJoin();
              }}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleJoin}
            >
              Join Chat
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Public Chat</h2>
            <div className="border rounded p-3 h-64 overflow-y-scroll mb-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <div key={idx} className="mb-2">
                  <span className="font-semibold">{msg.name}</span>: {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* 👈 scroll target */}
            </div>
            <input
              className="w-full border p-2 rounded"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message"
            />
          </>
        )}
      </div>
    </div>
  );
}
