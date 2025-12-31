const authService = require("../services/auth.service");
const registerOrg = async (req, res, next) => {
  try {
    const owner = await authService.registerOrg(req.body);
    res.status(201).json(owner);
  } catch (err) {
    next(err);
  }
};
const registerUser = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
module.exports = {
  registerOrg,
  registerUser,
  login,
};
