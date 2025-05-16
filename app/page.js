"use client";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export default function Page() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!name || !message) return;

    await addDoc(collection(db, "messages"), {
      name,
      message,
      timestamp: serverTimestamp(),
    });

    setMessage("");
  };

  return (
    <main className="text-black p-4 max-w-xl mx-auto">
      <h1 className="text-black text-2xl font-bold mb-4">Public Chat</h1>

      <form onSubmit={sendMessage} className="text-black mb-4 space-y-2">
        <input
          className="text-black w-full p-2 border rounded"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="text-black w-full p-2 border rounded"
          type="text"
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send
        </button>
      </form>

      <div className="text-black space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className="text-black bg-gray-100 p-2 rounded border border-gray-300"
          >
            <strong>{msg.name}</strong>: {msg.message}
          </div>
        ))}
      </div>
    </main>
  );
}
