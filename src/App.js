import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import Context from "./pages/Context";
import Market from "./pages/Market";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";


const Layout = ({ children }) => {
  const location = useLocation();
  const showHeaderAndSidebar =
   true

  return (
    <div className="flex flex-col h-screen">
      {showHeaderAndSidebar && <Header />}
      {showHeaderAndSidebar && <Sidebar />}
        <main className="flex-grow p-6 bg-gray-100 overflow-auto">
          {children}
        </main>
      
      
    </div>
  );
};

function App() {
  return (
    <Context>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
                <Layout>
                  <Dashboard />
                </Layout>
            }
          />
          <Route
            path="/users"
            element={
                <Layout>
                  <UserManagement />
                </Layout>
            }
          />
          <Route
            path="/market"
            element={
                <Layout>
                  <Market />
                </Layout>
            }
          />

         

          {/* Catch all route - redirect to dashboard if authenticated, login if not */}
         
        </Routes>
      </Router>
    </Context>
  );
}

export default App;
