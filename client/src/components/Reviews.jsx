import { useState, useEffect } from 'react';
import api from '../api/axios';

const Reviews = ({ providerId }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/api/reviews/${providerId}`);
            setReviews(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (providerId) fetchReviews();
    }, [providerId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/reviews', { ...newReview, providerId });
            setNewReview({ rating: 5, comment: '' });
            fetchReviews();
        } catch (error) {
            console.error('Error posting review:', error);
            alert('Error al publicar reseña. No puedes reseñarte a ti mismo.');
        }
    };

    return (
        <div className="mt-6 bg-slate-900/50 p-6 rounded-xl border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Reseñas</h3>

            <form onSubmit={handleSubmit} className="mb-6 bg-slate-800 p-4 rounded-lg">
                <div className="flex items-center gap-4 mb-3">
                    <label className="text-slate-300 text-sm">Calificación:</label>
                    <select
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                        className="bg-slate-700 text-white rounded px-2 py-1 border border-slate-600 outline-none"
                    >
                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                    </select>
                </div>
                <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Escribe tu opinión..."
                    className="w-full bg-slate-700 text-white rounded-lg p-3 border border-slate-600 outline-none focus:border-blue-500 mb-3"
                    rows="3"
                    required
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    Publicar Reseña
                </button>
            </form>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {reviews.length === 0 ? (
                    <p className="text-slate-500 text-center italic">Aún no hay reseñas.</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-blue-300">{review.reviewer?.name || 'Usuario'}</span>
                                <span className="text-yellow-400 text-sm">{'⭐'.repeat(review.rating)}</span>
                            </div>
                            <p className="text-slate-300 text-sm">{review.comment}</p>
                            <span className="text-slate-600 text-xs mt-2 block">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reviews;
