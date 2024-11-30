require("dotenv").config({ path: "./server/.env" });
const { MongoClient } = require("mongodb");

const DB_URL = process.env.DB_URI;

let db;

// Mongo DB Connection
async function connect2Db() {
  try {
    const client = new MongoClient(DB_URL);
    await client.connect();
    db = client.db();
    console.log("Database connected");
    return db;
  } catch (err) {
    console.error("Failed to connect with the database", err);
  }
}

// Getting all the employees
async function getAllEmployees(type) {
  const filter = {};
  if (type) filter["employeeType"] = type;
  const employees = await db.collection("employees").find(filter).toArray();
  return employees;
}

// Adding new employees
async function addEmployees(employee) {
  employee.id = await generateEmployeeId("employees");
  await db.collection("employees").insertOne(employee);
}

// this counters are for generating unique IDs for each employee
async function generateEmployeeId(myname) {
  const result = await db
    .collection("counters")
    .findOneAndUpdate(
      { name: myname },
      { $inc: { counter: 1 } },
      { returnOriginal: false, upsert: true }
    );
  return result.counter;
}

// Getting employees by ID
async function getEmployeesbyID(employeeId) {
  const employee = await db.collection("employees").findOne({ id: employeeId });
  return employee;
}

// deleting employees
async function deleteEmployeesbyID(employeeId) {
  const result = await db.collection("employees").deleteOne({ id: employeeId });
  return result.deletedCount > 0;
}

// updating employees
async function updateEmployeesbyID(employeeId, updatedEmployee) {
  const result = await db
    .collection("employees")
    .findOneAndUpdate({ id: parseInt(employeeId) }, { $set: updatedEmployee });
  return result;
}

module.exports = {
  connect2Db,
  addEmployees,
  getAllEmployees,
  getEmployeesbyID,
  deleteEmployeesbyID,
  updateEmployeesbyID,
};
