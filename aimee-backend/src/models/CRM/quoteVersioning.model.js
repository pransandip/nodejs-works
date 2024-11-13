const { DataTypes } = require('sequelize');

module.exports = quoteVersioningModel;

function quoteVersioningModel(sequelize) {
    const attributes = {
        QuoteRef: { type: DataTypes.STRING, allowNull: false },
        EnquiryRef: { type: DataTypes.STRING, allowNull: false },
        CustomerID: { type: DataTypes.STRING, allowNull: false },
        JobRef: { type: DataTypes.STRING, allowNull: false },
        CustomerEmail: { type: DataTypes.STRING, allowNull: false },
        CustomerAddress: { type: DataTypes.STRING, allowNull: false },
        CustomerPhone: { type: DataTypes.STRING, allowNull: false },
        CustomerContactName: { type: DataTypes.STRING, allowNull: false },
        QuoteTitle: { type: DataTypes.STRING, allowNull: false },
        QuoteId : {type: DataTypes.STRING, allowNull: false},
        QuoteContent: { type: DataTypes.STRING, allowNull: false },
        QuoteDateTime: { type: DataTypes.STRING, allowNull: false },
        TenderSubmissionDate: { type: DataTypes.STRING, allowNull: false },
        Status: { type: DataTypes.STRING, allowNull: false },
        ModifiedDateTime: { type: DataTypes.STRING, allowNull: false },
        Workflow: { type: DataTypes.STRING, allowNull: false },
        EstimatedValue: { type: DataTypes.STRING, allowNull: false },
        PurchaseOrder: { type: DataTypes.STRING, allowNull: false },
        AssignedAdmin: { type: DataTypes.STRING, allowNull: false },
        AdminNotes: { type: DataTypes.STRING, allowNull: false },
    };

    const quoteVersioning = sequelize.define('quoteVersioning', attributes);
    return quoteVersioning;
}