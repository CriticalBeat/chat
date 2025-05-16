'use client';
import { useEffect, useRef, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';

export default function Home() {
  const messagesEndRef = useRef(null);
  const [name, setName] = useState('');
  const [tempName, setTempName] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    await addDoc(collection(db, 'messages'), {
      name,
      text: input.trim(),
      timestamp: serverTimestamp(),
    });

    setInput('');
  };

  const handleJoin = () => {
    if (tempName.trim()) setName(tempName.trim());
  };

  return (
    <div className="text-black flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6">
        {!name ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Enter your name to join</h2>
            <input
              className="w-full border p-2 rounded"
              placeholder="Your full name"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
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
              <div ref={messagesEndRef} />
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