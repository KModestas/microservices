import express from 'express';
import { currentUser } from '@rallycoding/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  // send back currentUser which was set by the CurrentUser middleware
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
