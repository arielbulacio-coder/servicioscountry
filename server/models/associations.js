import User from './User.js';
import Review from './Review.js';
import Message from './Message.js';

// User - Review Associations
User.hasMany(Review, { foreignKey: 'reviewerId', as: 'givenReviews' });
User.hasMany(Review, { foreignKey: 'providerId', as: 'receivedReviews' });
Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });
Review.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

// User - Message Associations
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

export { User, Review, Message };
