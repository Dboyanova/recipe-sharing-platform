export const validateEmail = (req, res, next) => {
  const { email } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  next();
};

export const validatePassword = (req, res, next) => {
  const { password, passwordConfirm } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  next();
};
