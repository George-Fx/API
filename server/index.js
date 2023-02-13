import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import {mongoURI} from './config/keys.js';
import auth from './routes/auth.js';
import requireToken from './middleware/requireToken.js';

const app = express(); // Create an express application
const PORT = process.env.PORT || 3000; // Set the port

mongoose.set('strictQuery', false); // Allow the use of the $or operator in the query

// Соединиться с базой данных MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Использовать body-parser
app.use(bodyParser.json());

// Использовать authRoutes
app.use(auth);

// Использовать requireToken для проверки токена пользователя при запросе на сервер
app.get('/', requireToken, (req, res) => {
  // res.send({email: req.user.email});
  res.send({userInfo: req.user});
});

app.listen(PORT, () => console.log(`This is port ${3000}`));

// test
