import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    reviewerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    providerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true,
});

export default Review;
