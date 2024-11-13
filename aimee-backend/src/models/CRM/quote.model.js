const { DataTypes } = require('sequelize');

module.exports = quoteModel;

function quoteModel(sequelize){
    const attributes = {
        QuoteRef:{type: DataTypes.STRING, allowNull: false},
        EnquiryRef:{type: DataTypes.STRING, allowNull: false},
        CustomerID:{type: DataTypes.STRING, allowNull: false},
        JobRef:{type: DataTypes.STRING, allowNull: false},
        CustomerEmail:{type: DataTypes.STRING, allowNull: false},
        CustomerName:{type: DataTypes.STRING, allowNull: true},
        CustomerAddress:{type: DataTypes.STRING, allowNull: false},
        BillingAddress: {type: DataTypes.STRING},
        DeliveryAddress: {type: DataTypes.STRING, allowNull: true},
        AdditionalReceipts: {type: DataTypes.STRING, allowNull: true},
        CustomerPhone:{type: DataTypes.STRING, allowNull: false},
        CustomerContactName:{type: DataTypes.STRING, allowNull: true},
        QuoteTitle:{type: DataTypes.STRING, allowNull: false},
        QuoteContent:{type: DataTypes.STRING, allowNull: false},
        QuoteDateTime:{type: DataTypes.STRING, allowNull: false},
        TenderSubmissionDate:{type: DataTypes.STRING, allowNull: false},
        Status:{type: DataTypes.STRING, allowNull: false},
        ModifiedDateTime:{type: DataTypes.STRING, allowNull: false},
        Workflow:{type: DataTypes.STRING, allowNull: false},
        EstimatedValue:{type: DataTypes.STRING, allowNull: false},
        PurchaseOrder:{type: DataTypes.STRING, allowNull: false},
        AssignedAdmin:{type: DataTypes.STRING, allowNull: false},
        AdminNotes:{type: DataTypes.STRING, allowNull: false},
        ProjectJobDescription: {type: DataTypes.STRING, allowNull: true},
        ProjectRef:  {type: DataTypes.STRING, allowNull: true},
        QuoteValidFrom: {type: DataTypes.STRING, allowNull: true},
        PaymentWithin: {type: DataTypes.STRING, allowNull: true},
        BillingType: {type: DataTypes.STRING, allowNull: true},
        ServiceType: {type: DataTypes.STRING, allowNull: true},
        AssignedCreator: {type: DataTypes.STRING, allowNull: true},
        AssignedApprover: {type: DataTypes.STRING, allowNull: true},
        SendReminders: {type: DataTypes.STRING, allowNull: true},
        ReminderStatus: {type: DataTypes.STRING, allowNull: true},
        LastReminderSend: {type: DataTypes.STRING, allowNull: true},
        Steel: {type: DataTypes.STRING, allowNull: true},
        Finish: {type: DataTypes.STRING, allowNull: true},
        FabDrawing: {type: DataTypes.STRING, allowNull: true},
        Bolts: {type: DataTypes.STRING, allowNull: true},
        AnchorBolts: {type: DataTypes.STRING, allowNull: true},
        Programme: {type: DataTypes.STRING, allowNull: true},
        Comments: {type: DataTypes.STRING, allowNull: true},
        AdditionalInfo: {type: DataTypes.STRING, allowNull: true},
        OnershipOfGoods: {type: DataTypes.STRING, allowNull: true},
        PaymentTerms: {type: DataTypes.STRING, allowNull: true},
        Tasks: {type: DataTypes.STRING, allowNull: true},
        ReminderStatus:{type: DataTypes.STRING, allowNull: true},
        quoteFields : {type: DataTypes.STRING, allowNull: true}
    };
    const options = {
        defaultScope: {
            attributes: { exclude: ['passwordHash'] }
        },
        scopes: {
            withHash: { attributes: {}, }
        }
    };

    const quote = sequelize.define('quote', attributes, options);
    return quote;
}