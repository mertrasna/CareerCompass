import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Builder from "./Builder";
import Home from "./Home";
import Login from "./Login";
import Quiz from "./Quiz";
import Signup from "./Signup";
import Completion from "./Completion";
import Profile from "./Profile";
import EditProfile from "./editProfile";
import Payment from "./Payment";
import Post from "./Post";
import JobAds from "./JobAds"; 
import Admin from "./Admin";
import Matchmaking from "./Matchmaking";
import Matched from "./Matched";
import Settings from "./Settings";
import Subscription from "./Subscription";
import SearchAndExplore from "./SearchAndExplore";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/completion" element={<Completion />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/post" element={<Post />} />
          <Route path="/viewjob" element={<JobAds />} /> 
          <Route path="/admin" element={<Admin />} />
          <Route path="/matchmaking" element={<Matchmaking />} />
          <Route path="/matchedcandidates" element={<Matched />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/search" element={<SearchAndExplore />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
