import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove
} from "firebase/database";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyD4wp3ctTGWmWS64ZQ8OJazHiooWbnOR28",
  authDomain: "queue-app-df1a5.firebaseapp.com",
  databaseURL: "https://queue-app-df1a5-default-rtdb.firebaseio.com",
  projectId: "queue-app-df1a5",
  storageBucket: "queue-app-df1a5.firebasestorage.app",
  messagingSenderId: "27625390589",
  appId: "1:27625390589:web:783c741cd8d6652f999994"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function QueueApp() {
  const [queue, setQueue] = useState([]);
  const [name, setName] = useState("");
  const [myId, setMyId] = useState(null);

  // 대기열 실시간 동기화
  useEffect(() => {
    const queueRef = ref(database, "queue");
    onValue(queueRef, (snapshot) => {
      const data = snapshot.val() || {};
      const queueList = Object.entries(data).map(([id, name]) => ({ id, name }));
      setQueue(queueList);
    });
  }, []);

  const handleJoinQueue = () => {
    if (name.trim()) {
      const queueRef = ref(database, "queue");
      const newRef = push(queueRef, name.trim());
      setMyId(newRef.key);
      setName("");
    }
  };

  const handleNext = () => {
    if (queue.length > 0) {
      const firstId = queue[0].id;
      const firstRef = ref(database, `queue/${firstId}`);
      remove(firstRef);
      if (myId === firstId) setMyId(null);
    }
  };

  const myIndex = myId ? queue.findIndex(q => q.id === myId) + 1 : null;

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="border p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">대기열 등록</h2>
        <input
          className="border px-2 py-1 w-full mb-2"
          placeholder="이름 입력"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={handleJoinQueue}>
          대기열 등록
        </button>
      </div>

      {myIndex !== null && (
        <div className="border p-4 rounded shadow">
          <p>현재 내 순서: <strong>{myIndex}</strong> 번째</p>
        </div>
      )}

      <div className="border p-4 rounded shadow">
        <h3 className="font-semibold mb-2">전체 대기열</h3>
        <ol className="list-decimal pl-5">
          {queue.map((q, i) => (
            <li key={q.id}>{q.name}</li>
          ))}
        </ol>
      </div>

      <button
        className="bg-red-500 text-white px-4 py-1 rounded"
        onClick={handleNext}
      >
        다음 손님 입장
      </button>
    </div>
  );
}
