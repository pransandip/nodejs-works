const { sql, poolPromise } = require("../config/config");

const createUser = async (
  firstName,
  lastName,
  email,
  password,
  address,
  city,
  postCode,
  phone,
  photo,
  documents,
  role,
  jobTitle,
  totalHolidays,
  remainingHolidays,
  holidayDate,
  holidayReason,
  joinedDate,
  performance,
  workingHours,
  status,
  linkedinUrl
) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("firstName", sql.NVarChar, firstName)
      .input("lastName", sql.NVarChar, lastName)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, password)
      .input("address", sql.NVarChar, address)
      .input("city", sql.NVarChar, city)
      .input("postCode", sql.NVarChar, postCode)
      .input("phone", sql.NVarChar, phone)
      .input("photo", sql.NVarChar, photo)
      .input("documents", sql.NVarChar, documents)
      .input("role", sql.NVarChar, role)
      .input("jobTitle", sql.NVarChar, jobTitle)
      .input("totalHolidays", sql.NVarChar, totalHolidays)
      .input("remainingHolidays", sql.NVarChar, remainingHolidays)
      .input("holidayDate", sql.NVarChar, holidayDate)
      .input("holidayReason", sql.NVarChar, holidayReason)
      .input("joinedDate", sql.NVarChar, joinedDate)
      .input("performance", sql.NVarChar, performance)
      .input("workingHours", sql.NVarChar, workingHours)
      .input("status", sql.NVarChar, status)
      .input("linkedinUrl", sql.NVarChar, linkedinUrl)
      .query(
        "INSERT INTO users (firstName, lastName, email, password, address, city, postCode, phone, photo, documents, role, jobTitle, totalHolidays, remainingHolidays, holidayDate, holidayReason,joinedDate, performance, workingHours, status, linkedinUrl) VALUES (@firstName, @lastName, @email, @password, @address, @city, @postCode, @phone, @photo, @documents, @role, @jobTitle, @totalHolidays, @remainingHolidays, @holidayDate, @holidayReason,@joinedDate, @performance, @workingHours, @status, @linkedinUrl)"
      );
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createUser,
};
