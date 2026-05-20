import { Router } from 'express';

const router = Router();

// GET /api/contact
router.get('/', (req, res) => {
  res.json({
    whatsapp:  process.env.WHATSAPP_NUMBER || '',
    instagram: process.env.INSTAGRAM_URL  || '',
    facebook:  process.env.FACEBOOK_URL   || '',
    email:     process.env.CONTACT_EMAIL  || ''
  });
});

export default router;
