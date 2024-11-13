const { DataTypes } = require('sequelize');
const quoteModel = require('./quote.model');

module.exports = quoteKeyValueModel;

function quoteKeyValueModel(sequelize) {
    const attributes = {
        quoteId: { type: DataTypes.INTEGER, allowNull: false },
        key: { type: DataTypes.STRING, allowNull: false },
        value: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false, default: 0 },
    };

    const quoteKeyValues = sequelize.define('quoteKeyValues', attributes);
    quoteKeyValues.associate =(models) => {
            quoteKeyValues.belongsTo(models.quote, {
                foreignKey:'quoteId',
            });
        };
    return quoteKeyValues;
}
// quoteModel.hasMany(quoteKeyValueModel);

