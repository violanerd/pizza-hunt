const { Comment } = require('../models')
const { Pizza } = require('../models');

const commentController = {
    addComment({ params, body }, res) {
        console.log(body)
        Comment.create(body)
            .then(({_id }) => {
                console.log(_id)
                return Pizza.findOneAndUpdate(
                    {_id: params.pizzaId},
                    { $push: { comments: _id }},
                    { new: true }
                )
            })
            .then(dbPizzaData => {
                if (!dbPizzaData){
                    res.status(404).json({ message: "No Pizza found"})
                    return
                }
                res.json(dbPizzaData)
            }) 
            .catch(err => res.status(400).json(err))
    },
    removeComment({ params }, res){
        Comment.findOneAndDelete({ _id: params.commentId})
            .then(deletedComment => {
                if (!deletedComment){
                    return res.status(404).json({ message: "No comment found"})
                }
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $pull: {comments: params.commentId}},
                    {new: true}
                )
            })
            .then(dbPizzaData => {
                if (!dbPizzaData){
                    res.status(404).json({message: "No pizza"})
                    return
                }
                res.json(dbPizzaData)
            })
            .catch(err => res.status(400).json(err))
    }
}
module.exports = commentController;