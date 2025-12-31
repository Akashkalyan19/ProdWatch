const orgRepo = require("../repositories/org.repo");

const changeCode = async (newCode, user) => {
  if (!newCode) {
    throw new Error("Invalid new code");
  }
  return await orgRepo.changeCode(newCode, user.organization_id);
};
const getAllMembers = async (user) => {
  return await orgRepo.getAllMembers(user.organization_id);
};
module.exports = {
  changeCode,
  getAllMembers,
};
