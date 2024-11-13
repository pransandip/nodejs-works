const { DataTypes } = require("sequelize");

module.exports = customerModel;

function customerModel(sequelize) {
    const attributes = {
        customerRef:{type: DataTypes.STRING, allowNull: false},
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: true },
        email: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.STRING, allowNull: false },
        country: { type: DataTypes.STRING, allowNull: true },
        city: { type: DataTypes.STRING, allowNull: true },
        postCode: { type: DataTypes.STRING, allowNull: true },
        phone: { type: DataTypes.STRING, allowNull: true },
        companyName: { type: DataTypes.STRING, allowNull: true },
        companyLogo: { type: DataTypes.STRING, allowNull: true },
        status: { type: DataTypes.STRING, allowNull: true },
        website: { type: DataTypes.STRING, allowNull: true },
        documents: { type: DataTypes.STRING, allowNull: true },
        createdAt:{type: DataTypes.DATE},
        updatedAt:{type: DataTypes.DATE}
    };

  const options = {
    defaultScope: {
      // exclude password hash by default
      attributes: { exclude: ["passwordHash"] },
    },
    scopes: {
      // include hash with this scope
      withHash: { attributes: {} },
    },
  };

  const customers = sequelize.define("customers", attributes, options);
  return customers;
}