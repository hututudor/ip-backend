import express from 'express';
import { _res } from './utils/Response';
import { _req } from './utils/Request';
import { login, register, getProfile, auth } from './controllers/userController';

const app = express();

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use(express.json());

app.post('/login', login);
app.post('/register', register);
app.get('/profile/:userId', auth, getProfile);


const _request = new _req();
const _response = new _res();

const handleRequest = (request: _req, response: _res) => {
  const _request = new _req();
  console.log(_request);
  // createUser(_request)(response);
};

/*const createUser = (request: _req) => {
  return _response.success({});
};*/

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
