import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Reviews from '../components/Reviews';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProvider, setSelectedProvider] = useState(null); // For modal
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

    const handleContact = (provider) => {
        navigate('/chat', { state: { contact: provider } });
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
                            <button onClick={() => navigate('/chat')} className="p-2 text-slate-400 hover:text-white relative cursor-pointer">
                                💬 <span className="hidden md:inline text-xs ml-1">Mensajes</span>
                            </button>
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-medium">{user.name}</span>
                                <span className="text-xs text-slate-400 capitalize">{user.role}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg bg-slate-700 hover:bg-red-600/80 transition-colors text-sm cursor-pointer"
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
                                    <div key={provider.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 flex flex-col">
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

                                        <div className="mt-auto space-y-3">
                                            <button
                                                onClick={() => setSelectedProvider(provider)}
                                                className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                                            >
                                                Ver Reseñas
                                            </button>
                                            <button
                                                onClick={() => handleContact(provider)}
                                                className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors cursor-pointer"
                                            >
                                                Contactar
                                            </button>
                                        </div>
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
                                    </div>
                                    <button className="mt-4 text-sm text-blue-400 hover:text-blue-300 font-medium cursor-pointer">Editar Perfil →</button>
                                </div>

                                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                                    <h3 className="text-lg font-semibold mb-2 text-blue-400">Mensajes</h3>
                                    <div className="text-center py-4">
                                        <button
                                            onClick={() => navigate('/chat')}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium cursor-pointer"
                                        >
                                            Ir al Chat
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <Reviews providerId={user.id} />
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Provider Details Modal */}
            {selectedProvider && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl relative custom-scrollbar">
                        <button
                            onClick={() => setSelectedProvider(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer z-10 p-2"
                        >
                            ✕
                        </button>

                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-start mb-6 pt-2">
                                <div>
                                    <h2 className="text-3xl font-bold text-white">{selectedProvider.name}</h2>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-900/50 text-blue-300 border border-blue-700">
                                            {selectedProvider.serviceType.charAt(0).toUpperCase() + selectedProvider.serviceType.slice(1)}
                                        </span>
                                        {selectedProvider.isVerified && <span className="text-green-400 text-sm">✓ Verificado</span>}
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        handleContact(selectedProvider);
                                        setSelectedProvider(null);
                                    }}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-lg shadow-blue-500/20 cursor-pointer"
                                >
                                    Enviar Mensaje
                                </button>
                            </div>

                            <div className="mb-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <h3 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">Descripción</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    {selectedProvider.description || "Este proveedor no ha añadido una descripción todavía."}
                                </p>
                            </div>

                            <div className="border-t border-slate-700 pt-6">
                                <Reviews providerId={selectedProvider.id} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
