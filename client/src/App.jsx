import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Builder from "./Builder";
import Home from "./Home";
import Login from "./Login";
import Quiz from "./Quiz";
import Signup from "./Signup";
import Completion from "./Completion"

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/quiz" element={<Quiz />}></Route>
          <Route path="/builder" element={<Builder />}></Route>
          <Route path="/completion" element={<Completion />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;