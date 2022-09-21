const { Comment } = require('../models')
const { Pizza } = require('../models');

const commentController = {
    addComment({ params, body }, res) {
        console.log(body)
        Comment.create(body)
            .then(({_id }) => {
                console.log("this is the id", _id)
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
                console.log("I am adter the no data check")
                res.json(dbPizzaData)
            }) 
            .catch(err => {
                console.log('err', err)
                res.status(400).json(err)
            })
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
    },
    addReply({ params, body}, res){
        Comment.findOneAndUpdate(
            {_id: params.commentId}, 
            {$push: {replies: body}}, 
            {new:true, runValidators: true})
        .then(dbCommentData => {
            if (!dbCommentData){
                return res.status(404).json({ message: "Something went wrong "})
            }
            res.json(dbCommentData)
        })
        .catch(err => res.status(400).json(err))
    },
    removeReply({params}, res){
        Comment.findOneAndUpdate({_id: params.commentId}, {$pull: {replies: { replyId: params.replyId}}}, {new: true})
        .then(dbCommentData => {
            if(!dbCommentData){
                return res.status(404).json({ message: "Something went wrong "})
            }
            res.json(dbCommentData)
        })
        .catch(err => res.status(400).json(err))
    }
}
module.exports = commentController;