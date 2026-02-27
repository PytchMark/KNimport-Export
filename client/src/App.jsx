import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './routes/Home';
import Reserve from './routes/Reserve';
import Restock from './routes/Restock';
import Availability from './routes/Availability';
import Quality from './routes/Quality';
import Contact from './routes/Contact';
import Thanks from './routes/Thanks';
import { AdminDashboard, AdminLogin } from './routes/Admin';

const Protected = ({ children }) => (localStorage.getItem('admin_token') ? children : <Navigate to="/admin" replace />);

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/restock" element={<Restock />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/quality" element={<Quality />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/thanks/:referenceId" element={<Thanks />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Protected><AdminDashboard /></Protected>} />
      </Routes>
    </BrowserRouter>
  );
}
