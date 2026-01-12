import fetch from 'node-fetch'; // Fallback if necessary, but Node 22 has fetch globally

const LOCAL_URL = 'http://localhost:3000';
const CLOUD_URL = 'https://servicios-country-server-33yhmhzlua-uc.a.run.app';

const users = [
    // Vecinos
    {
        name: 'Juan Perez',
        email: 'juan.perez@email.com',
        password: 'password123',
        phone: '1122334455',
        role: 'vecino',
        address: 'Lote 10, Manzana 3'
    },
    {
        name: 'Maria Gonzalez',
        email: 'maria.gonzalez@email.com',
        password: 'password123',
        phone: '1155667788',
        role: 'vecino',
        address: 'Departamento 2B, Torre Norte'
    },
    // Proveedores
    {
        name: 'Carlos Gomez',
        email: 'carlos.plomero@email.com',
        password: 'password123',
        phone: '1144332211',
        role: 'proveedor',
        serviceType: 'plomeria',
        description: 'Plomero matriculado con 10 años de experiencia. Urgencias 24hs.'
    },
    {
        name: 'Ana Rodriguez',
        email: 'ana.jardin@email.com',
        password: 'password123',
        phone: '1188990022',
        role: 'proveedor',
        serviceType: 'jardineria',
        description: 'Diseño y mantenimiento de jardines. Paisajismo.'
    },
    {
        name: 'Electricidad Segura S.A.',
        email: 'info@elecsegura.com',
        password: 'password123',
        phone: '1133221100',
        role: 'proveedor',
        serviceType: 'electricidad',
        description: 'Instalaciones eléctricas residenciales e industriales.'
    }
];

const registerUser = async (baseUrl, user) => {
    try {
        const response = await fetch(`${baseUrl}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`✅ [SUCCESS] ${user.name} (${user.role}) registered in ${baseUrl}`);
        } else {
            // Ignore if user already exists
            if (data.message === 'El usuario ya existe') {
                console.log(`⚠️ [EXISTS] ${user.name} already exists in ${baseUrl}`);
            } else {
                console.error(`❌ [ERROR] Failed to register ${user.name} in ${baseUrl}:`, data.message);
            }
        }
    } catch (error) {
        console.error(`❌ [fAILED] Request failed for ${user.name} in ${baseUrl}:`, error.message);
    }
};

const seed = async () => {
    console.log('🌱 Starting database seeding...');

    // Seed Local
    console.log('\n--- Seeding Local Environment ---');
    for (const user of users) {
        await registerUser(LOCAL_URL, user);
    }

    // Seed Cloud
    console.log('\n--- Seeding Cloud Environment ---');
    for (const user of users) {
        await registerUser(CLOUD_URL, user);
    }

    console.log('\n✨ Seeding completed!');
};

seed();
