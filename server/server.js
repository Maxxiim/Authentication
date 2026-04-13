const http = require('http');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const crypto = require('crypto');

const JWT_SECRET = 'my_super_secret_key';
const PORT = 3000;

const users = [
  {
    id: 1,
    name: 'Alex',
    email: 'test@mail.ru',
    password: '123456',
  },
];

const resetStore = new Map();

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    console.log(body);
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-type': 'application/json' });
  return res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/restore') {
    const { email } = await parseBody(req);
    const user = users.find((u) => u.email === email);

    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = (Date = new Date(Date.now() + 3600000));
      resetStore.set(token, {
        email,
        expires,
      });
      const resetLink = 'http://localhost:3000/reset?token=' + token;
      console.log('Ссылка для сброса ', resetLink);
    } else {
      sendJSON(res, 401, {
        message: 'Пользователя с таким email не существует',
      });
    }
    return;
  }

  if (req.method === 'POST' && req.url === '/login') {
    const { name, password } = await parseBody(req);

    const user = users.find((u) => u.name === name);

    if (user && password === user.password) {
      const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, {
        expiresIn: '1h',
      });
      sendJSON(res, 200, { token });
    } else {
      sendJSON(res, 401, { message: 'Неверный email или пароль' });
    }
    return;
  }

  if (req.method === 'POST' && req.url === '/registration') {
    const { name, email, password } = await parseBody(req);

    if (!name || !email || !password) {
      return sendJSON(res, 400, { message: 'Необходимо заполнить все поля' });
    }

    const findName = users.find((u) => u.name === name);
    const findEmail = users.find((u) => u.email === email);

    if (findName && findEmail) {
      return sendJSON(res, 409, {
        message: 'Пользователь с таким именем и email уже существует',
        fields: ['name', 'email'],
      });
    }

    if (findName) {
      return sendJSON(res, 409, {
        message: 'Пользователь с таким именем уже существует',
        fields: ['name'],
      });
    }

    if (findEmail) {
      return sendJSON(res, 409, {
        message: 'Пользователь с таким email уже существует',
        fields: ['email'],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
    };

    const token = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      JWT_SECRET,
      { expiresIn: '1h' },
    );

    users.push(newUser);

    sendJSON(res, 201, {
      message: 'Регистрация прошла успешно',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/profile') {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return sendJSON(res, 401, { message: 'Токен не предоставлен' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      sendJSON(res, 200, { id: decoded.id, name: decoded.name });
      return;
    } catch (err) {
      sendJSON(res, 403, { message: 'Недействительный токен' });
    }
  }
  sendJSON(res, 404, { message: 'Маршрут не найден' });
});

server.listen(PORT, () => {
  console.log(`Сервер запущен http://localhost:${PORT}`);
});
