const { Pizza } = require('../models');

const pizzaController = {
    // GET /api/pizzas
    getAllPizza(req, res){
        Pizza.find({})
            .populate({
                path: 'comments',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            })
    },
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id})// this code is destructuring params out of entire req
            .populate({
                path: 'comments',
                select: '-__v'
            })
            .select('-__v')    
            .then(dbPizzaData => {
                // if no Pizza is found, send 404
                if (!dbPizzaData){
                    res.status(404).json({ message: 'No pizza found with this id!'})
                    return;
                }
                res.json(dbPizzaData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },
    // POST /api/pizzas
    createPizza({ body }, res) {// desctructure body out of the req object
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.status(400).json(err))
    },
    //PUT /api/pizzas/:id
    updatePizza({ params, body }, res){
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true }) // new: true parameter returns the new document
            .then(dbPizzaData => {
                if (!dbPizzaData){
                    res.status(404).json({ message: 'No Pizza found with this id!'})
                    return
                }
                res.json(dbPizzaData)
            })
            .catch(err => res.status(400).json(err))
    },
    // DELETE /api/pizzas/:id
    deletePizza({ params}, res) {
        Pizza.findOneAndDelete({ _id: params.id})
            .then(dbPizzaData => {
                if (!dbPizzaData){
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData)
            })
            .catch(err => res.status(400).json(err))
    }
}

module.exports = pizzaController;