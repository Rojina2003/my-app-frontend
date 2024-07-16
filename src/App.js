import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/login";
import Register from "./components/register";
import { AuthProvider } from "./context/AuthContext";
import PostList from "./components/PostList";
import PrivateRoute from "./utiils/PrivateRoute";
import Navbar from "./components/navbar.component";
import AddPost from "./components/AddPost";
import PublicRoute from "./utiils/PublicRoute";
import EditUserProfile from "./components/editUserProfile";
import { PostView } from "./components/postView";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/" exact element={<PostList />} />
              <Route path="/add" element={<AddPost />} />
              <Route path="/edit/:id" element={<EditUserProfile />} />
              <Route path="/posts/:id" element={<PostView />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
