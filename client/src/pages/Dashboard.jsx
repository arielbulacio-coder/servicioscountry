import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!token || !storedUser) {
            navigate('/login');
            return;
        }

        setUser(JSON.parse(storedUser));
        setLoading(false);
    }, [navigate]);

    useEffect(() => {
        if (user && user.role === 'vecino') {
            const fetchProviders = async () => {
                try {
                    const response = await api.get('/api/users/providers');
                    setProviders(response.data);
                } catch (error) {
                    console.error('Error fetching providers:', error);
                }
            };
            fetchProviders();
        }
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Navbar */}
            <nav className="bg-slate-800 border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                                Servicios Country
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-medium">{user.name}</span>
                                <span className="text-xs text-slate-400 capitalize">{user.role}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg bg-slate-700 hover:bg-red-600/80 transition-colors text-sm"
                            >
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {user.role === 'vecino' ? (
                    <div>
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Proveedores Disponibles</h1>
                            <p className="text-slate-400">Encuentra y contacta profesionales en tu comunidad.</p>
                        </header>

                        {providers.length === 0 ? (
                            <div className="text-center py-12 bg-slate-800/50 rounded-lg">
                                <p className="text-slate-400">No hay proveedores disponibles en este momento.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {providers.map((provider) => (
                                    <div key={provider.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{provider.name}</h3>
                                                <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-900/50 text-blue-300 border border-blue-700">
                                                    {provider.serviceType.charAt(0).toUpperCase() + provider.serviceType.slice(1)}
                                                </span>
                                            </div>
                                            {provider.isVerified && (
                                                <span title="Verificado" className="text-green-400 text-xl">✓</span>
                                            )}
                                        </div>

                                        <p className="text-slate-400 text-sm mb-6 line-clamp-3">
                                            {provider.description || "Sin descripción disponible."}
                                        </p>

                                        <div className="flex items-center gap-2 mb-4 text-sm text-slate-300">
                                            <span>📞 {provider.phone || 'No especificado'}</span>
                                        </div>

                                        <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors">
                                            Contactar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-white mb-2">Panel de Proveedor</h1>
                                <p className="text-slate-400">Gestiona tu perfil y visualiza solicitudes.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                                    <h3 className="text-lg font-semibold mb-2 text-purple-400">Tu Perfil</h3>
                                    <div className="space-y-2 text-sm text-slate-300">
                                        <p><span className="text-slate-500">Servicio:</span> {user.serviceType || 'General'}</p>
                                        <p><span className="text-slate-500">Estado:</span> <span className="text-green-400">Activo</span></p>
                                        <p><span className="text-slate-500">Reputación:</span> ⭐ 5.0 (NuevO)</p>
                                    </div>
                                    <button className="mt-4 text-sm text-blue-400 hover:text-blue-300 font-medium">Editar Perfil →</button>
                                </div>

                                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                                    <h3 className="text-lg font-semibold mb-2 text-blue-400">Solicitudes Recientes</h3>
                                    <div className="flex items-center justify-center h-32 text-slate-500 text-sm italic">
                                        No hay solicitudes pendientes.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
