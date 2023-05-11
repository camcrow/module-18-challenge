const { Users, Thoughts } = require('../models');

module.exports = {

    getAllThoughts(req, res) {
        Thoughts.find()
            .sort({ createdAt: -1 })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    getSingleThought(req, res) {
        Thoughts.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((dbThoughtData) =>
                !dbThoughtData
                    ? res.status(404).json({ message: 'There is no thought with this ID.' })
                    : res.json(dbThoughtData)
            )
            .catch((err) => res.status(500).json(err));
    },

    createThought(req, res) {
        Thoughts.create(req.body)
          .then(({ _id }) => {
            return Users.findOneAndUpdate(
              { _id: req.body.userId },
              { $push: { thoughts: _id } },
              { new: true }
            );
          })
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: "There is no user with this ID." })
              : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
      },
   
    deleteThought(req, res) {
        Thoughts.findOneAndDelete({ _id: req.params.thoughtId })
            .then((dbThoughtData) =>
                !dbThoughtData
                    ? res.status(404).json({ message: 'There is no thought with this ID.' })
                    : Thoughts.deleteOne
            )
            .then(() => res.json({ message: 'Thought was deleted!' }))
            .catch((err) => res.status(500).json(err));

    },
   
    updateThought(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((dbThoughtData) =>
                !dbThoughtData
                    ? res.status(404).json({ message: 'There is no thought with this ID.' })
                    : res.json(dbThoughtData)
            )
            .catch((err) => res.status(500).json(err));
    },
   
    addReaction(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: "There is no thought with this ID." });
                }
                res.json(dbThoughtData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    removeReaction(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: "There is no thought with this ID." });
                }
                res.json(dbThoughtData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
};
