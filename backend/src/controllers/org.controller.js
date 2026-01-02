const { all } = require("../routes/auth.routes");
const orgService = require("../services/org.service");

const getCode = async (req, res, next) => {
  try {
    const code = await orgService.getCode(req.user);
    console.log("requesting code");
    console.log(`response:${JSON.stringify(code)}`);
    res.status(200).send(code);
  } catch (err) {
    next(err);
  }
};
const changeCode = async (req, res, next) => {
  try {
    const { join_code } = req.body;
    console.log("change request came");
    const updatedCode = await orgService.changeCode(join_code, req.user);

    res.status(200).json({
      message: "Join code updated successfully",
      join_code: updatedCode,
    });
  } catch (err) {
    next(err);
  }
};
const getAllMembers = async (req, res, next) => {
  try {
    const members = await orgService.getAllMembers(req.user);
    res.status(200).send(members);
  } catch (err) {
    next(err);
  }
};
const updateMemberRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const updatedUser = await orgService.updateMemberRole(
      req.user,
      userId,
      role
    );

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  changeCode,
  updateMemberRole,
  getAllMembers,
  getCode,
};
