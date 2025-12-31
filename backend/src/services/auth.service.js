const jwt = require("../utils/jwt");
const { hashPassword, comparePassword } = require("../utils/password");

const userRepo = require("../repositories/user.repo");
const organizationRepo = require("../repositories/org.repo");

const registerOrg = async ({ org_name, user_name, email, password }) => {
  const normalizedOrgName = org_name.trim().toLowerCase();

  const existingOrg = await organizationRepo.getOrgByName(normalizedOrgName);
  if (existingOrg) {
    throw new Error("Organization already exists");
  }

  const existingUser = await userRepo.getUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const organization = await organizationRepo.createOrg(normalizedOrgName);

  const passwordHash = await hashPassword(password);

  const owner = await userRepo.createUser({
    name: user_name,
    email,
    password_hash: passwordHash,
    role: "owner",
    organization_id: organization.id,
  });

  return {
    id: owner.id,
    name: owner.name,
    email: owner.email,
    role: owner.role,
    organization_id: organization.id,
  };
};

const registerUser = async ({
  org_name,
  join_code,
  user_name,
  email,
  password,
}) => {
  const normalizedOrgName = org_name.trim().toLowerCase();

  const organization = await organizationRepo.getOrgByNameAndJoinCode(
    normalizedOrgName,
    join_code
  );

  if (!organization) {
    throw new Error("Invalid organization or join code");
  }

  const existingUser = await userRepo.getUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const passwordHash = await hashPassword(password);

  const user = await userRepo.createUser({
    name: user_name,
    email,
    password_hash: passwordHash,
    role: "engineer",
    organization_id: organization.id,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    organization_id: organization.id,
  };
};

const login = async ({ email, password }) => {
  const user = await userRepo.getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValidPassword = await comparePassword(password, user.password_hash);

  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.signToken({
    id: user.id,
    role: user.role,
    organization_id: user.organization_id,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization_id: user.organization_id,
    },
  };
};

module.exports = {
  registerOrg,
  registerUser,
  login,
};
