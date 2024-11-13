const { DataTypes } = require('sequelize');

module.exports = jobModel;

function jobModel(sequelize) {
    const attributes = {
        jobId: {type: DataTypes.STRING, allowNull: false},
        jobRed: {type: DataTypes.STRING, allowNull: false},
        projectRef : {type: DataTypes.STRING, allowNull: false},
        customerRef: {type: DataTypes.STRING, allowNull: false}, 
        customerId: {type: DataTypes.STRING, allowNull: false}, 
        enquiryRef : {type: DataTypes.STRING, allowNull: false},
        enquiryId: {type: DataTypes.STRING, allowNull: false},
        quoteRef : {type: DataTypes.STRING, allowNull: false},
        quoteId: {type: DataTypes.STRING, allowNull: false}, 
        jobTitle : {type: DataTypes.STRING, allowNull: false},
        jobDescription : {type: DataTypes.STRING, allowNull: false},
        materialStatus: {type: DataTypes.STRING, allowNull: false},
        createdDate: {type: DataTypes.STRING, allowNull: false},
        createdBy : {type: DataTypes.STRING, allowNull: false},
        estimatedStartDate: {type: DataTypes.STRING, allowNull: false}, 
        completionDate: {type: DataTypes.STRING, allowNull: false}, 
        plannedHours : {type: DataTypes.STRING, allowNull: false},
        totalHoursWorked : {type: DataTypes.STRING, allowNull: false},
        drawingStatus :{type: DataTypes.STRING, allowNull: false},
        status : {type: DataTypes.STRING, allowNull: false},
        notes : {type: DataTypes.STRING, allowNull: false},
        inPlan : {type: DataTypes.STRING, allowNull: false},
        invoiced : {type: DataTypes.STRING, allowNull: false},
        workFlow : {type: DataTypes.STRING, allowNull: false},
        actualCost : {type: DataTypes.STRING, allowNull: false},
        documents: {type: DataTypes.STRING, allowNull: false},
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
    
    const job = sequelize.define('job', attributes, options);
    return job;
}