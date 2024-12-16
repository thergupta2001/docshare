import { Routes, Route } from "react-router-dom";
import TextEditor from "./components/TextEditor";
import Home from "./components/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:roomId" element={<TextEditor />} />
    </Routes>
  );
}

export default App;
