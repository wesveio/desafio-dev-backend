'use strict';

const Validator = require('../validators/validator');
const userRepository = require('../repositories/user-repository');
const md5 = require('md5');
const authService = require('../services/auth-service');

exports.get = async (req, res, next) => {
  try {
    var data = await userRepository.get();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: 'Request failed: ' + e
    });
  }
}

exports.post = async (req, res, next) => {
  let validate = new Validator();
  validate.hasMinLen(req.body.name, 3, 'Name must contain at least 3 characters');
  validate.isEmail(req.body.email, 'E-mail not valid');
  validate.hasMinLen(req.body.password, 6, 'Password must contain at least 6 characters');

  // if data is not valid
  if (!validate.isValid()) {
    res.status(400).send(validate.errors()).end();
    return;
  }

  try {
    await userRepository.create({
      name: req.body.name,
      email: req.body.email,
      password: md5(req.body.password + global.SALT_KEY)
    });

    res.status(201).send({
      message: 'User successfully registered'
    });
  } catch (e) {
    res.status(500).send({
      message: 'Request failed: ' + e
    });
  }
};

exports.put = async (req, res, next) => {
  let validate = new Validator();
  req.body.name ? validate.hasMinLen(req.body.name, 3, 'Name must contain at least 3 characters') : true;
  req.body.email ? validate.isEmail(req.body.email, 'E-mail not valid') : true;
  if (req.body.password) {
    validate.hasMinLen(req.body.password, 6, 'Password must contain at least 6 characters');
    req.body.password = md5(req.body.password + global.SALT_KEY);
  }

  // if data is not valid
  if (!validate.isValid()) {
    res.status(400).send(validate.errors()).end();
    return;
  }

  try {
    await userRepository.update(req.params.id, req.body);
    res.status(200).send({
      message: 'User successfully updated'
    });
  } catch (e) {
    res.status(500).send({
      message: 'Request failed: ' + e
    });
  }
};

exports.delete = async (req, res, next) => {
  try {
    await userRepository.delete(req.body.id)
    res.status(200).send({
      message: 'User successfully removed!'
    });
  } catch (e) {
    res.status(500).send({
      message: 'Request failed: ' + e
    });
  }
};

exports.getById = async (req, res, next) => {
  try {
    var data = await userRepository.getById(req.params.id);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: 'Request failed: ' + e
    });
  }
}

exports.addGroupToUser = async (req, res, next) => {
  try {
    await userRepository.addGroupToUser((req.users ? req.users : req.body.users), {
      groups: [(req._id ? req._id : req.body.id)]
    });

    res.status(200).send({
      message: 'User were successfully added to a group'
    });
  } catch (e) {
    res.status(500).send({
      message: 'Request failed'
    });
  }
};

exports.removeGroupFromUser = async (req, res, next) => {
  try {
    await userRepository.removeGroupFromUser((req.users ? req.users : req.body.users), {
      groups: [(req._id ? req._id.toString() : req.body.id)]
    });

    res.status(200).send({
      message: 'Group(s) were successfully removed from user(s)'
    });
  } catch (e) {
    res.status(500).send({
      message: 'Request failed'
    });
  }
};

exports.authenticate = async (req, res, next) => {
  try {
    const customer = await userRepository.authenticate({
      email: req.body.email,
      password: md5(req.body.password + global.SALT_KEY)
    });

    if (!customer) {
      res.status(404).send({
        message: 'user or password are not valid'
      });
      return;
    }

    const token = await authService.generateToken({
      id: customer._id,
      email: customer.email,
      name: customer.name
    });

    res.status(201).send({
      token: token,
      data: {
        email: customer.email,
        name: customer.name
      }
    });
  } catch (e) {
    res.status(500).send({
      message: 'Request failed'
    });
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    const data = await authService.decodeToken(token);

    const customer = await userRepository.getById(data.id);

    if (!customer) {
      res.status(404).send({
        message: 'User not found'
      });
      return;
    }

    const tokenData = await authService.generateToken({
      id: customer._id,
      email: customer.email,
      name: customer.name
    });

    res.status(201).send({
      token: token,
      data: {
        email: customer.email,
        name: customer.name
      }
    });
  } catch (e) {
    res.status(500).send({
      message: 'Request failed'
    });
  }
};