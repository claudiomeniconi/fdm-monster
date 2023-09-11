const User = require("../../../models/Auth/User");
const bcrypt = require("bcryptjs");
const { ROLES } = require("../../../constants/authorization.constants");
const { Role } = require("../../../models");
const { hashPassword } = require("../../../utils/crypto.utils");

function getUserData(username = "tester", password = "testpassword") {
  return {
    username,
    password,
  };
}

async function ensureTestUserCreated(usernameIn = "test", passwordIn = "test", needsPasswordChange = false, role = ROLES.ADMIN) {
  const roleId = (await Role.findOne({ name: role }))?._id;
  const roles = roleId ? [roleId.toString()] : [];

  const foundUser = await User.findOne({ username: usernameIn });
  const { username, password } = getUserData(usernameIn, passwordIn);
  const hash = await hashPassword(password);

  if (foundUser) {
    await User.updateOne({ _id: foundUser.id }, { passwordHash: hash, needsPasswordChange, roles });
    return {
      id: foundUser.id,
      username: foundUser.username,
      needsPasswordChange: foundUser.needsPasswordChange,
      roles: foundUser.roles,
    };
  }

  const user = await User.create({
    username,
    passwordHash: hash,
    roles,
    isRootUser: true,
    needsPasswordChange,
  });

  return {
    id: user.id,
    username: user.username,
    needsPasswordChange: user.needsPasswordChange,
    roles: user.roles,
  };
}

module.exports = {
  ensureTestUserCreated,
  getUserData,
};
