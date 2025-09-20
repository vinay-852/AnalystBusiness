import './App.css';
import LoginPage from './pages/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import PrivateRoute from './components/PrivateRoute';
import Main from './pages/main';

import PostGuidance from './pages/PostGuidance';

function App() {
  return (
   <BrowserRouter>
           <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/main" element={<PrivateRoute><Main /></PrivateRoute>} />
              <Route path="/post-guidance" element={<PrivateRoute><PostGuidance /></PrivateRoute>} />
           </Routes>
   </BrowserRouter>
  );
}

export default App;