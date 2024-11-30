require("dotenv").config({ path: "./.env" });
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { readFile } = require("fs/promises");
const {
  connect2Db,
  addEmployees,
  getAllEmployees,
  getEmployeesbyID,
  deleteEmployeesbyID,
  updateEmployeesbyID,
} = require("./db.js");
const { GraphQLScalarType } = require("graphql");

const app = express();

// Custom Scalar type for Date
const GraphQlDateResolver = new GraphQLScalarType({
  name: "GraphQlDate",
  serialize(value) {
    return value.toISOString(); //converting date object to ISO string format
  },
  parseValue(value) {
    const date = new Date(value);
    return isNaN(date) ? undefined : date; //Parsing the input and returning undefined if invalid
  },
});

// Loading the GraphQL Schema and starting the Apollo Server
async function loadSchema() {
  const mySchema = await readFile("./server/schema.graphql", "utf8");
  const server = new ApolloServer({
    typeDefs: mySchema,
    resolvers: {
      Query: {
        employee: getEmployeebyID,
        employees: getEmployees,
      },
      Mutation: {
        createEmployee: addEmployee,
        deleteEmployee: deleteEmployeebyID,
        updateEmployee: updateEmployeebyID,
      },
      GraphQlDate: GraphQlDateResolver,
    },
  });

  //Filtering the employee by type
  async function getEmployees(_, { type }) {
    return await getAllEmployees(type);
  }

  //Adding a new employee
  async function addEmployee(_, { employee }) {
    await addEmployees(employee);
    return employee;
  }

  // Getting employees by ID
  async function getEmployeebyID(_, { id }) {
    return await getEmployeesbyID(id);
  }

  // Deleting employees by ID
  async function deleteEmployeebyID(_, { id }) {
    return await deleteEmployeesbyID(id);
  }

  // Updating employees by ID
  async function updateEmployeebyID(_, { id, employee }) {
    const updatedEmployee = await updateEmployeesbyID(id, employee);
    return updatedEmployee;
  }

  const enableCors = process.env.ENABLE_CORS;
  console.log("CORS setting:", enableCors);

  try {
    await connect2Db();
    await server.start();
    server.applyMiddleware({ app, path: "/graphql", cors: enableCors });

    app.listen(process.env.SERVER_PORT, () => {
      console.log(`App started on port ${process.env.SERVER_PORT}`);
    });
  } catch (err) {
    console.error("Error in connecting database", err);
  }
}

loadSchema();
