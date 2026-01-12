import express from 'express';
import { sendMessage, getConversation, getContacts } from '../controllers/chatController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, sendMessage);
router.get('/contacts', verifyToken, getContacts);
router.get('/:contactId', verifyToken, getConversation);

export default router;
