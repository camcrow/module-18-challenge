const { Users } = require('../models');

module.exports = {

  getAllUsers(req, res) {
    Users.find()
      .then(dbUserData => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));

  },

  getSingleUser(req, res) {
    Users.findOne({ _id: req.params.userId })
      .populate("thoughts")
      .populate("friends")
      .select("-__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "There is no user with this ID." })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },


  createUser(req, res) {
    Users.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err)
      });
  },


  deleteUser(req, res) {
    Users.findOneAndDelete({ _id: req.params.userId })
    .populate("thoughts")
    .populate("friends")
    .select("-__v")
      .then((dbUserData) =>
        !dbUserData
          ? res.status(404).json({ message: 'There is no user with this ID.' })
          : Users.deleteOne
      )
      .then(() => res.json({ message: 'User was deleted!' }))
      .catch((err) => res.status(500).json(err));

  },

  updateUser(req, res) {
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'There is no user with this ID.' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
 
  addFriend(req, res) {
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "There is no user with this ID." });
        }
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  removeFriend(req, res) {
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: "There is no user with this ID." });
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

};