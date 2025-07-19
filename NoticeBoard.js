import React, { useState, useEffect } from "react";
import { db, auth } from "./firebaseConfig";
import { collection, addDoc, query, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login"); // Redirect to login page if not authenticated
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch notices from Firestore
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "notices"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setNotices(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Add a new notice
  const addNotice = async () => {
    if (newNotice.trim() === "") return;
    await addDoc(collection(db, "notices"), { text: newNotice, createdBy: user.email });
    setNewNotice("");
  };

  // Logout function
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div>
      <h2>Realtime SaaS Notice Board</h2>
      <p>Welcome, {user?.email}!</p>
      <button onClick={handleLogout}>Logout</button>

      <div>
        <input
          type="text"
          placeholder="Enter new notice"
          value={newNotice}
          onChange={(e) => setNewNotice(e.target.value)}
        />
        <button onClick={addNotice}>Add Notice</button>
      </div>

      <ul>
        {notices.map((notice) => (
          <li key={notice.id}>{notice.text} (by {notice.createdBy})</li>
        ))}
      </ul>
    </div>
  );
}

export default NoticeBoard;
