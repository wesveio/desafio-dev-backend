'use strict';
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.get = async () => {
  const res = await User
    .find({}, 'name email');
  return res;
}

exports.create = async (data) => {
  var user = new User(data);
  await user.save();
}

exports.update = async (id, data) => {
  await User
    .findByIdAndUpdate({ _id: id }, {
      $set: data
    });
}

exports.addGroupToUser = async (id, data) => {
  await User
    .updateMany(
      { _id: id },
      {
        $push: {
          groups: data.groups
        }
      }
    );
}

exports.removeGroupFromUser = async (id, data) => {
  let res = await User
    .updateMany(
      { _id: id },
      {
        $pull: {
          groups: { $in: data.groups }
        }
      },
      { 'new': true }
    );
  return res;
}

exports.delete = async (id) => {
  await User.findOneAndRemove({ _id: id });
}

exports.getById = async (id) => {
  const res = await User
    .findById({ _id: id }, 'name email groups')
    .populate('groups', 'group slug');
  return res;
}

exports.authenticate = async (data) => {
  const res = await User.findOne({
    email: data.email,
    password: data.password
  });
  return res;
}