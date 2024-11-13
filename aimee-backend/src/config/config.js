const tedious = require('tedious');
const { Sequelize } = require('sequelize');
require('dotenv').config()

const { dbConfig , secret } = require('../../config.json');

module.exports = db = { secret};

initialize();

async function initialize() {
    const dialect = 'mssql';
    const host = process.env.DB_HOST;

    // connect to db
    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, { host, dialect });

    // init models and add them to the exported db object
    db.User = require('../models/user.model')(sequelize);
    db.Customer = require('../models/CRM/customer.model')(sequelize);
    db.Enquiries = require('../models/CRM/enquiries.model')(sequelize);
    db.project = require('../models/PMO/project.model')(sequelize);
    db.Quote = require('../models/CRM/quote.model')(sequelize);
    db.Job = require('../models/PMO/job.model')(sequelize);
    db.QuoteKeyValues = require('../models/CRM/quoteKeyValue.model')(sequelize);
    db.Quote.hasMany(db.QuoteKeyValues,{foreignKey:"quoteId"});
    db.QuoteKeyValues.hasMany(db.Quote,{foreignKey:"id"});

    // sync all models with database
    await sequelize.sync({ alter: true });
}


async function ensureDbExists(dbName) {
  return new Promise((resolve, reject) => {
      const connection = new tedious.Connection(dbConfig);
      connection.connect((err) => {
          if (err) {
              console.error(err);
              reject(`Connection Failed: ${err.message}`);
          }

          const createDbQuery = `IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = '${dbName}') CREATE DATABASE [${dbName}];`;
          const request = new tedious.Request(createDbQuery, (err) => {
              if (err) {
                  console.error(err);
                  reject(`Create DB Query Failed: ${err.message}`);
              }

              // query executed successfully
              resolve();
          });

          connection.execSql(request);
      });
  });
}
