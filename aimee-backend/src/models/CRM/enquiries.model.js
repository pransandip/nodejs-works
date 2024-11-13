const { DataTypes } = require('sequelize');

module.exports = enquiriesModel;

function enquiriesModel(sequelize) {
    const attributes = {
        enquiryRef:{type: DataTypes.STRING, allowNull: false},
        customerID:{type: DataTypes.STRING, allowNull: true},
        title: { type: DataTypes.STRING, allowNull: false },
        customerContactName: { type: DataTypes.STRING, allowNull: false },
        subject: { type: DataTypes.STRING, allowNull: false },
        enquiryContent: { type: DataTypes.STRING, allowNull: false },
        documents: { type: DataTypes.STRING},
        status: { type: DataTypes.STRING, allowNull: false },
        dateTime: { type: DataTypes.STRING, allowNull: false },
        createdAt:{type: DataTypes.DATE},
        updatedAt:{type: DataTypes.DATE}
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

    
    const enquiries = sequelize.define('enquires', attributes, options);
    return enquiries;
}