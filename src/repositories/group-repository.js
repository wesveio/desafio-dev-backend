'use strict';
const mongoose = require('mongoose');
const Group = mongoose.model('Group');

exports.get = async () => {
  const res = await Group.find({}, 'group slug');
  return res;
}

exports.getBySlug = async (slug) => {
  const res = await Group
    .findOne({
      slug: slug
    }, 'group slug');
  return res;
}

exports.getById = async (id) => {
  const res = await Group
    .findById({ _id: id }, 'group users')
    .populate('users', 'name email');
  return res;
}

exports.create = async (data) => {
  let group = new Group(data);
  const res = await group.save();
  return res;
}

exports.update = async (id, data) => {
  await Group
    .findByIdAndUpdate(id, {
      $set: data
    });
}

exports.delete = async (id) => {
  const res = await Group
    .findOneAndRemove({ _id: id });
  return res;
}

exports.removeUserFromGroup = async (id, data) => {
  let res = await Group
    .updateMany(
      { _id: id },
      {
        $pull: {
          users: { $in: data.users_id }
        }
      },
      { 'new': true }
    );
  return res;
}