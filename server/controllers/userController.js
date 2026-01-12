import User from '../models/User.js';

export const getProviders = async (req, res) => {
    try {
        const { category } = req.query;
        const whereClause = { role: 'proveedor' };

        if (category) {
            whereClause.serviceType = category;
        }

        const providers = await User.findAll({
            where: whereClause,
            attributes: ['id', 'name', 'email', 'phone', 'serviceType', 'description', 'isVerified']
        });

        res.json(providers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener proveedores' });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener perfil' });
    }
}
