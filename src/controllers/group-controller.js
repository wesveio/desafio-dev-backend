'use strict';

const Validator = require('../validators/validator');
const groupRepository = require('../repositories/group-repository');
const userRepository = require('../repositories/user-repository');

exports.get = async (req, res, next) => {
  try {
    let data = await groupRepository.get();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: 'Request failed: ' + e,
    });
  }
}

exports.getBySlug = async (req, res, next) => {
  try {
    let data = await groupRepository.getBySlug(req.params.slug);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: 'Request failed: ' + e
    });
  }
}

exports.getById = async (req, res, next) => {
  try {
    let data = await groupRepository.getById(req.params.id);

    if (data !== null) {
      res.status(200).send(data);
    } else {
      let noRes = {
        status: "Nothing found",
        data: data
      }
      res.status(200).send(noRes);
    }
  } catch (e) {
    res.status(500).send({
      message: 'Request failed: ' + e
    });
  }
}

exports.post = async (req, res, next) => {
  let validate = new Validator();
  validate.hasMinLen(req.body.group, 3, 'group must contain at least 3 characters');
  validate.hasMinLen(req.body.slug, 3, 'slug must contain at least 3 characters');
  validate.hasMinLen(req.body.users, 2, 'users must contain at least 2 users');

  // Se os dados forem inválidos
  if (!validate.isValid()) {
    res.status(400).send(validate.errors()).end();
    return;
  }

  try {

    let data = await groupRepository.create({
      group: req.body.group,
      slug: req.body.slug,
      users: req.body.users
    })
      .then(data => {
        userRepository.addGroupToUser(data.users, {
          groups: [data._id]
        });
      });

    res.status(201).send({
      data,
      message: 'Group successfully created!'
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: 'Request failed: ' + e
    });
  }
};

exports.put = async (req, res, next) => {
  try {
    await groupRepository.update(req.params.id, req.body);
    res.status(200).send({
      message: 'Group successfully updated'
    });
  } catch (e) {
    res.status(500).send({
      message: 'Request failed: ' + e
    });
  }
};

exports.delete = async (req, res, next) => {
  try {
    await groupRepository.delete(req.body.id)
      .then(data => {
        userRepository.removeGroupFromUser(data.users, {
          groups: [data._id]
        });
      });
    res.status(200).send({
      message: 'Group successfully removed!'
    });
  } catch (e) {
    res.status(500).send({
      message: 'Request failed: ' + e
    });
  }
};

exports.removeUserFromGroup = async (req, res, next) => {
  let groupId = (req.group_id ? req.group_id : req.body.group_id);
  let usersIds = (req.users_id ? req.users_id : req.body.users_id);
  try {
    await groupRepository.removeUserFromGroup(groupId, {
      users_id: usersIds
    })
      .then(data => {
        userRepository.removeGroupFromUser(usersIds, {
          groups: groupId
        })
          .then(data => {
            groupRepository.getById(groupId.toString())
              .then(data => {
                if (data && data.users.length < 1) {
                  groupRepository.delete(data._id);
                }
              })
          });
      });

    res.status(200).send({
      message: 'User(s) were successfully removed from group'
    });
  } catch (e) {
    res.status(500).send({
      message: 'Request failed: ' + e
    });
  }
};