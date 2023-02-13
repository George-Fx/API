import {check, validationResult} from 'express-validator';

const validateUser = () => {
  return [
    check('username', 'Username does not exist')
      .optional() // Поле не обязательно
      .isLength({min: 3})
      .withMessage('Username must be at least 3 characters'),
    check('email', 'Email does not exist')
      .isEmail()
      .withMessage('Email address is invalid'),
    check('password', 'Password does not exist').isLength({min: 6}),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  next();
};

export {validateUser, validate}; // Импортировать объекты validateUser и validate
