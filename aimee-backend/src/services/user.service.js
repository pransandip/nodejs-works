const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/config");
const { secret } = require("../../config.json");
const { tokenVerification } = require("./../validations/auth.validation");
const semdMail = require("./../templates/signupTemplate");

module.exports = {
  getAll,
  getById,
  create,
  update,
  authenticate,
  delete: _delete,
};

async function getAll() {
    return await db.User.findAll();
}

async function getById(id) {
  return await getUser(id);
}

async function create(params) {
  // validate
  if (await db.User.findOne({ where: { email: params.email } })) {
    throw 'Email "' + params.email + '" is already registered';
  }

  const user = new db.User(params);

  // hash password
  user.password = await bcrypt.hash(params.password, 10);

  // save user
  await user.save();
  let data = {
    name: params.firstName + " " + params.lastName,
    email: params.email,
  };
  await semdMail(data);
}

async function update(id, params) {
  const user = await getUser(id);

  // validate
  const usernameChanged = params.username && user.username !== params.username;
  if (
    usernameChanged &&
    (await db.User.findOne({ where: { username: params.username } }))
  ) {
    throw 'Username "' + params.username + '" is already taken';
  }

  // hash password if it was entered
  if (params.password) {
    params.passwordHash = await bcrypt.hash(params.password, 10);
  }

  // copy params to user and save
  Object.assign(user, params);
  await user.save();
}

async function _delete(id) {
  const user = await getUser(id);
  await user.destroy();
}

// helper functions

async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw "User not found";
  return user;
}

async function authenticate({ email, password }) {
  const user = await db.User.scope("withHash").findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password)))
    throw "email or password is incorrect";
  const token = jwt.sign({ sub: user.id }, secret, { expiresIn: "7d" });
  return { ...omitHash(user.get()), token };
}

function omitHash(user) {
  const { hash, ...userWithoutHash } = user;
  return userWithoutHash;
}
