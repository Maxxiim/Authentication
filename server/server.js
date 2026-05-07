const http = require("http");

const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const JWT_SECRET = "my_secret_key";
const PORT = 3000;

const { parseBody } = require("./utils/parsedBody.ts");
const { sendJSON } = require("./utils/sendJSON.ts");

const users = [
  {
    id: 1,
    name: "Alex",
    email: "test@mail.ru",
    password: bcrypt.hashSync("123456", 10),
  },
];

const resetStore = new Map();

const server = http.createServer(async (req, res) => {
  // res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  res.setHeader("Access-Control-Allow-Methods", "POST,GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/reset") {
    const { password, token } = await parseBody(req);

    const record = resetStore.get(token);

    if (!record) {
      return sendJSON(res, 404, {
        message: "Неверная ссылка для восстановления",
      });
    }

    if (record.expires < Date.now()) {
      return sendJSON(res, 400, { message: "Срок действия ссылки истек" });
    }

    const user = users.find((u) => u.email === record.email);

    if (!user) {
      return sendJSON(res, 404, { message: "Польователь не найден" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user.password = hashPassword;

    resetStore.delete(token);
    sendJSON(res, 200, { message: "Пароль успешно обновлен" });
    return;
  }

  if (req.method === "POST" && req.url === "/restore") {
    const { email } = await parseBody(req);
    const user = users.find((u) => u.email === email);

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 300000);
      resetStore.set(token, {
        email,
        expires,
      });
      const resetLink = "http://localhost:5173/reset?token=" + token;
      console.log("Ссылка для сброса ", resetLink);
      sendJSON(res, 200, { message: "Письмо отправлено на почту" });
    } else {
      sendJSON(res, 200, {
        message: "Если такой email существует, письмо будет отправлено.",
      });
    }
    return;
  }

  if (req.method === "POST" && req.url === "/login") {
    const { name, password } = await parseBody(req);
    const user = users.find((u) => u.name === name);

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, {
        expiresIn: "1h",
      });

      const cookie = `token=${token}; httpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/`;
      res.setHeader("Set-Cookie", cookie);
      sendJSON(res, 200, { cookie });
    } else {
      sendJSON(res, 401, { message: "Неверное имя пользователя или пароль" });
    }
    return;
  }

  if (req.method === "POST" && req.url === "/registration") {
    const { name, email, password } = await parseBody(req);

    if (!name || !email || !password) {
      return sendJSON(res, 400, { message: "Необходимо заполнить все поля." });
    }

    const findName = users.find((u) => u.name === name);
    const findEmail = users.find((u) => u.email === email);

    if (findName && findEmail) {
      return sendJSON(res, 409, {
        message: "Пользователь с таким именем и email уже существует.",
        fields: ["name", "email"],
      });
    }

    if (findName) {
      return sendJSON(res, 409, {
        message: "Пользователь с таким именем уже существует.",
        fields: ["name"],
      });
    }

    if (findEmail) {
      return sendJSON(res, 409, {
        message: "Пользователь с таким email уже существует",
        fields: ["email"],
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
      { expiresIn: "1h" },
    );

    users.push(newUser);

    sendJSON(res, 201, {
      message: "Регистрация прошла успешно",
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
    return;
  }

  sendJSON(res, 404, { message: "Маршрут не найден" });
});

server.listen(PORT, () => {
  console.log(`Сервер запущен http://localhost:${PORT}`);
});
