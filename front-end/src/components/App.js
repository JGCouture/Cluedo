import { Routes, Route } from "react-router-dom";
import Home from './Home';
import Join from './Join';
import Character from './Character';
import Board from './Board';
import Win from './Win';

function App() {

  return (

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/join" element={<Join />} />
      <Route path="/character" element={<Character />} />
      <Route path="/board" element={<Board/>} />
      <Route path="/win" element={<Win/>} />
    </Routes>
    
  );
}

export default App;
