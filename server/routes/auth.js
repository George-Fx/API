import express from 'express';
import {signIn, signUp} from '../controllers/user.js';
import {validateUser, validate} from '../middleware/validation.js';

const router = express.Router(); // Create a router object

// Использовать authRoutes
router.post('/signup', validateUser(), validate, signUp); // Зарегистрироваться
router.post('/signin', validateUser(), validate, signIn); // Войти в систему

export default router; // Export the router object
