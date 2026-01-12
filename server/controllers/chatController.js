import { Message, User } from '../models/associations.js';
import { Op } from 'sequelize';

export const sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user.id;

        const message = await Message.create({
            senderId,
            receiverId,
            content
        });

        res.status(201).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar mensaje' });
    }
};

export const getConversation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { contactId } = req.params;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId, receiverId: contactId },
                    { senderId: contactId, receiverId: userId }
                ]
            },
            order: [['createdAt', 'ASC']]
        });

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener conversación' });
    }
};

export const getContacts = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find distinct users interacted with
        // Note: This is a simplified approach. For better performance on large datasets, raw queries might be better.
        const sentMessages = await Message.findAll({
            where: { senderId: userId },
            attributes: ['receiverId']
        });
        const receivedMessages = await Message.findAll({
            where: { receiverId: userId },
            attributes: ['senderId']
        });

        const contactIds = new Set([
            ...sentMessages.map(m => m.receiverId),
            ...receivedMessages.map(m => m.senderId)
        ]);

        const contacts = await User.findAll({
            where: {
                id: Array.from(contactIds)
            },
            attributes: ['id', 'name', 'role', 'serviceType']
        });

        res.json(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener contactos' });
    }
}
