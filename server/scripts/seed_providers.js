import sequelize from '../config/db.js';
import { User, Review } from '../models/associations.js';
import bcrypt from 'bcryptjs';

const seedProviders = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
        await sequelize.sync();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        // --- Providers ---
        const providersData = [
            {
                name: 'Juan Pérez',
                email: 'juan.electricista@example.com',
                password: hashedPassword,
                role: 'proveedor',
                phone: '123-456-7890',
                serviceType: 'electricista',
                description: 'Especialista en instalaciones eléctricas residenciales y comerciales. Más de 15 años de experiencia solucionando cortocircuitos, instalando iluminación LED y renovando cableado antiguo. Servicio rápido y garantizado.',
                isVerified: true,
                profileImage: '/providers/electrician.png'
            },
            {
                name: 'María González',
                email: 'maria.plomeria@example.com',
                password: hashedPassword,
                role: 'proveedor',
                phone: '098-765-4321',
                serviceType: 'plomeria',
                description: 'Soluciones integrales de plomería. Reparación de fugas, destape de cañerías, instalación de grifería y sanitarios. Atención de urgencias las 24 horas. Trabajo limpio y eficiente.',
                isVerified: true,
                profileImage: '/providers/plumber.png'
            },
            {
                name: 'Carlos Rodríguez',
                email: 'carlos.jardinero@example.com',
                password: hashedPassword,
                role: 'proveedor',
                phone: '111-222-3333',
                serviceType: 'jardineria',
                description: 'Diseño y mantenimiento de jardines. Corte de césped, podas, fertilización y control de plagas. Transformo tu espacio verde en un lugar de relax. Presupuestos sin cargo.',
                isVerified: true,
                profileImage: '/providers/gardener.png'
            },
            {
                name: 'Laura Fernández',
                email: 'laura.clases@example.com',
                password: hashedPassword,
                role: 'proveedor',
                phone: '444-555-6666',
                serviceType: 'clases particulares',
                description: 'Profesora de Matemática y Física con amplia experiencia docente. Clases de apoyo para nivel primario, secundario y universitario. Preparación para exámenes y seguimiento personalizado.',
                isVerified: true,
                profileImage: '/providers/teacher.png'
            }
        ];

        const createdProviders = [];
        for (const data of providersData) {
            const [provider, created] = await User.findOrCreate({
                where: { email: data.email },
                defaults: data
            });
            if (!created) {
                // Update if exists to ensure new fields like profileImage are set
                await provider.update(data);
                console.log(`Updated provider: ${provider.name}`);
            } else {
                console.log(`Created provider: ${provider.name}`);
            }
            createdProviders.push(provider);
        }

        // --- Reviewers (Vecinos) ---
        const neighborsData = [
            {
                name: 'Roberto Gómez',
                email: 'roberto.gomez@example.com',
                password: hashedPassword,
                role: 'vecino',
                address: 'Lote 45'
            },
            {
                name: 'Ana Martínez',
                email: 'ana.martinez@example.com',
                password: hashedPassword,
                role: 'vecino',
                address: 'Lote 12'
            },
            {
                name: 'Sofia Lopez',
                email: 'sofia.lopez@example.com',
                password: hashedPassword,
                role: 'vecino',
                address: 'Lote 88'
            }
        ];

        const createdNeighbors = [];
        for (const data of neighborsData) {
            const [neighbor, created] = await User.findOrCreate({
                where: { email: data.email },
                defaults: data
            });
            createdNeighbors.push(neighbor);
        }

        // --- Reviews ---
        const reviewsData = [
            // Reviews for Juan (Electrician)
            {
                reviewerId: createdNeighbors[0].id,
                providerId: createdProviders[0].id,
                rating: 5,
                comment: 'Excelente trabajo, muy prolijo y puntual. Resolvió el problema de la tensión enseguida.'
            },
            {
                reviewerId: createdNeighbors[1].id,
                providerId: createdProviders[0].id,
                rating: 4,
                comment: 'Buen servicio, aunque llegó unos minutos tarde. El trabajo quedó perfecto.'
            },
            // Reviews for Maria (Plumber)
            {
                reviewerId: createdNeighbors[2].id,
                providerId: createdProviders[1].id,
                rating: 5,
                comment: 'Me salvó de una inundación un domingo. ¡Súper recomendada!'
            },
            // Reviews for Carlos (Gardener)
            {
                reviewerId: createdNeighbors[0].id,
                providerId: createdProviders[2].id,
                rating: 5,
                comment: 'El jardín quedó hermoso, Carlos es muy detallista.'
            },
            // Reviews for Laura (Teacher)
            {
                reviewerId: createdNeighbors[1].id,
                providerId: createdProviders[3].id,
                rating: 5,
                comment: 'Mi hijo aprobó gracias o sus clases. Tiene mucha paciencia.'
            }
        ];

        // Clear existing reviews for these provider interactions to avoid duplicates (optional, strictly speaking we might just want to add more)
        // For simplicity, we just create. Since we don't have unique constraint on reviews per pair in model definition usually, it creates multiples.
        // Let's just create them.

        for (const review of reviewsData) {
            await Review.create(review);
        }

        console.log('Reviews added.');
        console.log('Seed completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedProviders();
