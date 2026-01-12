import { Review, User } from '../models/associations.js';

export const createReview = async (req, res) => {
    try {
        const { providerId, rating, comment } = req.body;
        const reviewerId = req.user.id;

        if (reviewerId == providerId) {
            return res.status(400).json({ message: 'No puedes reseñarte a ti mismo' });
        }

        const review = await Review.create({
            reviewerId,
            providerId,
            rating,
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la reseña' });
    }
};

export const getProviderReviews = async (req, res) => {
    try {
        const { providerId } = req.params;
        const reviews = await Review.findAll({
            where: { providerId },
            include: [
                { model: User, as: 'reviewer', attributes: ['id', 'name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener reseñas' });
    }
};
