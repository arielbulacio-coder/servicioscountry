import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Servicios Country
        </h1>
        <p className="text-xl text-slate-300 mb-8 leading-relaxed">
          Conectando vecinos y proveedores en tu comunidad privada. <br />
          Gestión segura, rápida y confiable.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-lg shadow-blue-500/30">
            Soy Vecino
          </Link>
          <Link to="/register" className="px-8 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold border border-slate-700 transition">
            Soy Proveedor
          </Link>
        </div>
        <div className="mt-8">
          <Link to="/login" className="text-slate-400 hover:text-white transition underline">
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  )
}

export default App;
