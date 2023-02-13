import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Этот метод будет вызываться перед сохранением пользователя в базу данных
userSchema.pre('save', function (next) {
  const user = this; // Сохранить контекст в переменную user
  if (!user.isModified('password')) return next(); // Если пароль не был изменен, то вызвать следующую функцию
  bcrypt.genSalt(10, (err, salt) => {
    // Создать соль
    if (err) return next(err); // Если есть ошибка, то вызвать следующую функцию
    bcrypt.hash(user.password, salt, (err, hash) => {
      // Хешировать пароль
      if (err) return next(err); // Если есть ошибка, то вызвать следующую функцию
      user.password = hash; // Изменить пароль на хеш
      next(); // Вызвать следующую функцию
    }); // Хешировать пароль
  }); // Создать соль
});

// Создать метод comparePassword
userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this; // Сохранить контекст в переменную user
  return new Promise((resolve, reject) => {
    // Создать промис
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      // Сравнить пароль
      if (err) return reject(err); // Если есть ошибка, то вызвать reject
      if (!isMatch) return reject(false); // Если пароли не совпадают, то вызвать reject
      resolve(true); // Вызвать resolve
    }); // Сравнить пароль
  }); // Создать промис
}; // Создать метод comparePassword

export default mongoose.model('User', userSchema);
