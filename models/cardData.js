const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Cards = sequelize.define('cards', {
	userId: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: false,
	},
	cardId: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	cardName: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	cardSet: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	cardRarity: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	cardImage: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	cardPrice: {
		type: Sequelize.INTEGER,
		allowNull: false,
	}
});

module.exports = Cards;