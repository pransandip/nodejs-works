const { DataTypes } = require('sequelize');

module.exports = projectModel;

function projectModel(sequelize) {
    const attributes = {
        projectRef:{type: DataTypes.STRING, allowNull: false},
        enquiryID:{type: DataTypes.STRING, allowNull: false},
        customerID:{type: DataTypes.STRING, allowNull: false},
        quoteID:{type: DataTypes.STRING, allowNull: false},
        jobRed: { type: DataTypes.STRING, allowNull: false },
        projectTitle: { type: DataTypes.STRING, allowNull: false },
        projectContent: { type: DataTypes.STRING, allowNull: false },
        createdDateTime: { type: DataTypes.STRING, allowNull: false },
        estimatedStartDate: { type: DataTypes.STRING, allowNull: false },
        completionDate: { type: DataTypes.STRING, allowNull: false },
        status: {type: DataTypes.STRING, allowNull: false},
        notes: {type: DataTypes.STRING, allowNull: false},
        documents: {type: DataTypes.STRING, allowNull: false},
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
    
    const project = sequelize.define('project', attributes, options);
    return project;
}