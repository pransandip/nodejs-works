const { DataTypes } = require('sequelize');

module.exports = userModel;

function userModel(sequelize) {
    const attributes = {
        email: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        firstName: { type: DataTypes.STRING, allowNull: true },
        lastName: { type: DataTypes.STRING, allowNull: true },
        address: { type: DataTypes.STRING, allowNull: true },
        city: { type: DataTypes.STRING, allowNull: true },
        postCode: { type: DataTypes.STRING, allowNull: true },
        phone: { type: DataTypes.STRING, allowNull: true },
        photo: { type: DataTypes.STRING, allowNull: true },
        emailVerified: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false },
        jobTitle:{ type: DataTypes.STRING, allowNull: true },  
        totalHolidays:{ type: DataTypes.STRING, allowNull: true },
        remainingHolidays:{ type: DataTypes.STRING, allowNull: true },
        holidayDate:{ type: DataTypes.STRING, allowNull: true },
        holidayReason:{ type: DataTypes.STRING, allowNull: true },
        joinedDate:{ type: DataTypes.STRING, allowNull: true },
        performance:{ type: DataTypes.STRING, allowNull: true },
        workingHours:{ type: DataTypes.STRING, allowNull: true },
        status:{ type: DataTypes.STRING, allowNull: true },
        linkedinUrl:{ type: DataTypes.STRING, allowNull: true }
    };

    const options = {
        defaultScope: {
            // exclude password hash by default
            attributes: { exclude: ['passwordHash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    
    const users = sequelize.define('users', attributes, options);
    return users;
}