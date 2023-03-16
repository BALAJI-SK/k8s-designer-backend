const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND));
  const hashedPassword = await bcrypt.hash(password, salt);
  return { hashpassword: hashedPassword, salt };
};

const comparePassword = async (password, hashPassword) => {
  return bcrypt.compare(password, hashPassword);
};

module.exports = { hashPassword, comparePassword };