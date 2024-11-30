import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Cookies from "js-cookie"; // To check if the user is logged in

// Import Pages
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
import Calendar from "./Calendar";
import Notifications from "./Notifications";

// Protected Route Component
const ProtectedRoute = ({ element, ...rest }) => {
  const isAuthenticated = !!Cookies.get("username"); // Check if a cookie named "username" exists

  if (isAuthenticated) {
    return element;
  } else {
    return <Navigate to="/login" replace />; // Redirect to login page if not authenticated
  }
};

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={<ProtectedRoute element={<Home />} />}
          />
          <Route
            path="/quiz"
            element={<ProtectedRoute element={<Quiz />} />}
          />
          <Route
            path="/builder"
            element={<ProtectedRoute element={<Builder />} />}
          />
          <Route
            path="/completion"
            element={<ProtectedRoute element={<Completion />} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<Profile />} />}
          />
          <Route
            path="/editprofile"
            element={<ProtectedRoute element={<EditProfile />} />}
          />
          <Route
            path="/payment"
            element={<ProtectedRoute element={<Payment />} />}
          />
          <Route
            path="/post"
            element={<ProtectedRoute element={<Post />} />}
          />
          <Route
            path="/viewjob"
            element={<ProtectedRoute element={<JobAds />} />}
          />
          <Route
            path="/admin"
            element={<ProtectedRoute element={<Admin />} />}
          />
          <Route
            path="/matchmaking"
            element={<ProtectedRoute element={<Matchmaking />} />}
          />
          <Route
            path="/matchedcandidates"
            element={<ProtectedRoute element={<Matched />} />}
          />
          <Route
            path="/settings"
            element={<ProtectedRoute element={<Settings />} />}
          />
          <Route
            path="/subscription"
            element={<ProtectedRoute element={<Subscription />} />}
          />
          <Route
            path="/search"
            element={<ProtectedRoute element={<SearchAndExplore />} />}
          />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/notifications" element={<Notifications />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
