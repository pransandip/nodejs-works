const { getUser } = require('../services/users')

module.exports = () => {
	getUser: async (req, res) => {
		try {
			const id = req.params.id
			const user = await getUser(id)
			res.json(user)
		}
		catch (err) {
		res.status(500).send(err)
		}
	}
}