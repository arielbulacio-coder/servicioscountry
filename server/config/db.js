import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelize;

if (process.env.INSTANCE_CONNECTION_NAME) {
    // Cloud Run Connection (via Unix Socket)
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            dialect: 'postgres',
            host: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
            dialectOptions: {
                socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`
            },
            logging: false,
        }
    );
} else {
    // Local Connection
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST || 'localhost',
            dialect: 'postgres',
            logging: false,
        }
    );
}

export default sequelize;
