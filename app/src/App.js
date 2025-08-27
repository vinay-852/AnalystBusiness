import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/login';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
   <BrowserRouter>
           <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
           </Routes>
   </BrowserRouter>
  );
}

export default App;