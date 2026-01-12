import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('vecino', 'proveedor', 'admin'),
        defaultValue: 'vecino',
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // Fields for Vecino
    address: {
        type: DataTypes.STRING, // Lote / Unidad
        allowNull: true,
    },
    // Fields for Proveedor
    serviceType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
});

export default User;
