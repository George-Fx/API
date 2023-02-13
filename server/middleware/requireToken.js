import jwt from 'jsonwebtoken'; // Import the jsonwebtoken module
import {jwtKey} from '../config/keys.js'; // Import the jwtKey from the config/keys.js file
import User from '../models/User.js'; // Import the User model

const requireToken = (req, res, next) => {
  // console.log(req.headers.authorization);
  const {authorization} = req.headers; // Деструктуризация объекта req.headers
  if (!authorization) res.status(401).send({error: 'You must be logged in'}); // Отправить 401 статус код и сообщение об ошибке
  const token = authorization.replace('Bearer ', ''); // Удалить Bearer из токена
  jwt.verify(token, jwtKey, async (err, payload) => {
    // Verify the token
    if (err) {
      // If there is an error
      return res.status(401).send({error: 'You must be logged in'}); // Send a 401 status code and an error message
    }
    const {userId} = payload; // Destructure the userId from the payload
    const user = await User.findById(userId); // Find the user by the userId
    req.user = user; // Add the user to the request object
    next(); // Call the next function
  }); // Verify the token
};

export default requireToken; // Export the router object
