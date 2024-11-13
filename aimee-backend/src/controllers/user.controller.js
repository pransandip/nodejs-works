const userService = require('../services/user.service');

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function signup(req, res, next) {
	req.body.emailVerified=  'No';
    userService.create(req.body)
        .then(() => res.json({ message: 'User created' }))
        .catch((error) => res.json({ message: error}));
}

function signin(req, res, next) {
	userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch((error) => res.json({ message: error}));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'User updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted' }))
        .catch(next);
}



module.exports  = {
    signup,
    signin,
    getAll,
    getById,
  };
