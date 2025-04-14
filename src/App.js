import React, { useState } from 'react';

function App() {
  const [queue, setQueue] = useState([]);
  const [name, setName] = useState('');
  const [myIndex, setMyIndex] = useState(null);

  const handleJoinQueue = () => {
    if (name.trim() !== '') {
      const newQueue = [...queue, name.trim()];
      setQueue(newQueue);
      setMyIndex(newQueue.length);
      setName('');
    }
  };

  const handleNext = () => {
    const [, ...rest] = queue;
    setQueue(rest);
    if (myIndex !== null) setMyIndex(prev => (prev > 1 ? prev - 1 : null));
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>대기열 등록</h2>
      <input
        placeholder="이름 입력"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleJoinQueue} disabled={!name.trim()}>대기열 등록</button>

      {myIndex !== null && (
        <p>현재 내 순서: <strong>{myIndex}</strong> 번째</p>
      )}

      <h3>전체 대기열</h3>
      <ol>
        {queue.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ol>

      <button onClick={handleNext} style={{ backgroundColor: 'red', color: 'white' }}>
        다음 손님 입장
      </button>
    </div>
  );
}

export default App;