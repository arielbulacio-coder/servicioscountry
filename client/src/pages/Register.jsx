import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const [role, setRole] = useState('vecino'); // vecino | proveedor
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '', // Lot/Unit number for Vecino
        serviceType: '' // Only for Proveedor
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const payload = { ...formData, role };
            await api.post('/api/auth/register', payload);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrarse');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-x-1/2 -translate-y-1/2"></div>

            <div className="relative z-10 w-full max-w-lg bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Crear Cuenta
                    </h2>
                    <p className="text-slate-400 mt-2">Únete a tu comunidad hoy mismo</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Role Selector */}
                <div className="flex bg-slate-900/50 p-1 rounded-xl mb-8 border border-slate-700/50">
                    <button
                        type="button"
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${role === 'vecino'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white'
                            }`}
                        onClick={() => setRole('vecino')}
                    >
                        Soy Vecino
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${role === 'proveedor'
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white'
                            }`}
                        onClick={() => setRole('proveedor')}
                    >
                        Soy Proveedor
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Teléfono</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all"
                            />
                        </div>
                    </div>

                    {role === 'vecino' ? (
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Lote / Unidad Funcional</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all"
                                placeholder="Ej: Lote 45, Edificio A 2B"
                                required
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Rubro / Servicio</label>
                            <select
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white transition-all"
                                required
                            >
                                <option value="">Selecciona una categoría...</option>
                                <option value="plomeria">Plomería</option>
                                <option value="electricidad">Electricidad</option>
                                <option value="jardineria">Jardinería</option>
                                <option value="limpieza">Limpieza</option>
                                <option value="construccion">Construcción</option>
                                <option value="otros">Otros</option>
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Confirmar</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className={`w-full py-3 px-4 bg-gradient-to-r text-white font-bold rounded-lg shadow-lg transform transition-all active:scale-[0.98] ${role === 'vecino'
                                    ? 'from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-500/25'
                                    : 'from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-500/25'
                                }`}
                        >
                            Registrarse como {role === 'vecino' ? 'Vecino' : 'Proveedor'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-slate-400 text-sm">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                        Inicia Sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
