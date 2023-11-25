import {Router} from 'express';
import { signInUser, loginUser, updateUser } from '../controllers/user.controller';
import validateToken from './validate-token';

const router = Router();

router.post('/signin', signInUser);
router.post('/login', loginUser);
router.post('/update', validateToken, updateUser);

export default router;