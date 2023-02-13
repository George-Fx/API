import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {jwtKey} from '../config/keys.js';

const signUp = async (req, res) => {
  const {username, email, password} = req.body;
  const userExists = await User.findOne({username});
  const emailExists = await User.findOne({email});

  // res - это ответ сервера на запрос пользователя (клиента) и содержит методы для отправки ответа
  // клиенту (пользователю) и для управления им.

  // res.send - отправить ответ клиенту (пользователю) в виде строки
  // res.status - установить статус код ответа сервера (клиенту)
  // res.json - отправить ответ клиенту (пользователю) в виде JSON объекта

  if (userExists) {
    return res.status(403).send({error: 'Username already exists'}); // Отправить 422 статус код и сообщение об ошибке
  }

  // Если пользователь существует, отправить 422 статус код и сообщение об ошибке
  if (emailExists) {
    return res.status(403).send({error: 'Email already exists'}); // Отправить 422 статус код и сообщение об ошибке
    // return res.status(201).send('sss'); // Отправить 201 статус код и пользователя
  }

  // Если пользователь не существует, создать нового пользователя
  try {
    const user = new User({username, email, password}); // Создать нового пользователя
    await user.save(); // Сохранить пользователя в базе данных
    res.status(201).send(user); // Отправить 201 статус код и пользователя
  } catch (err) {
    res.status(422).send(err.message); // Send a 422 status code and the error message
  }
};

const signIn = async (req, res) => {
  const {email, password} = req.body; // Деструктуризация объекта req.body

  if (!email || !password) {
    res.status(422).send({error: 'Must provide email and password'});
    return;
  }
  const user = await User.findOne({email}); // Найти пользователя в базе данных по email

  if (!user) {
    res.status(422).send({error: 'Invalid password or email'});
    return;
  }
  try {
    await user.comparePassword(password); // Сравнить пароли
    const token = jwt.sign({userId: user._id}, jwtKey); // Создать токен
    res.send({token, user}); // Отправить токен
  } catch (err) {
    res.status(422).send({error: 'Invalid password or email'}); // Отправить 422 статус код и сообщение об ошибке
  }
};

export {signUp, signIn};
