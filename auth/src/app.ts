import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@rallycoding/common';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();
// tell express to trust traffic as secure coming from our ingress-nginx proxy
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    // dont encrypt the cookie, we will store A JWT which is already encrypted and tamper proof
    signed: false,
    // wether the browser should also send cookies to an unsecure http connection or not
    secure: process.env.NODE_ENV !== 'test'
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// express-async-errors allows us to throw and error inside of an async function directly rather than wrapping it:
// next(new NotFoundError())
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
