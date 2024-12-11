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
    return value.toISOString().split('T')[0]; //converting date object to ISO string format and converting to string format for frontend YYYY-MM-DD
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
  async function getEmployees(_, { type, upcomingRetirement }) {
    const employees = await getAllEmployees();

    let filteredEmployees = employees;
    if (type) {
      filteredEmployees = filteredEmployees.filter(
        (employee) => employee.employeeType === type
      );
    }

    if (upcomingRetirement !== undefined) {
      filteredEmployees = filterEmployeesByRetirement(
        filteredEmployees,
        upcomingRetirement
      );
    }

    return filteredEmployees.map(handleEmployementRetirement);
  }

  // Getting employees by ID
  async function getEmployeebyID(_, { id }) {
    const employee = await getEmployeesbyID(id);
    if (!employee) {
      throw new Error(`Employee with ID ${id} not found.`);
    }
    return handleEmployementRetirement(employee);
  }

  function retirementCalc(employee, retirementAge = 70) {
    const dob = new Date(employee.dob);
    const retirementDate = new Date(dob);
    retirementDate.setFullYear(retirementDate.getFullYear() + retirementAge);

    const today = new Date();
    const timeDiff = retirementDate - today;

    if (timeDiff < 0) {
      return {
        retirementDate: retirementDate,
        remainingTime: null,
      };
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    return {
      retirementDate: retirementDate,
      remainingTime: {
        days: days % 30,
        months: months % 12,
        years,
      },
    };
  }

  function handleEmployementRetirement(employee) {
    const retirementInfo = retirementCalc(employee);
    return {
      ...employee,
      ...retirementInfo,
    };
  }

  function filterEmployeesByRetirement(employees, upcomingRetirement, today = new Date()) {
    if (upcomingRetirement) {
      // Calculate the threshold for retirement (next 6 months)
      const sixMonthsAhead = new Date(today);
      sixMonthsAhead.setMonth(today.getMonth() + 6);
  
      return employees.filter((employee) => {
        const { retirementDate } = retirementCalc(employee);
        const retirementDateObj = new Date(retirementDate);
        return retirementDateObj > today && retirementDateObj <= sixMonthsAhead;
      });
    }
  
    // If upcomingRetirement is false or undefined, return all employees
    return employees;
  }

  //Adding a new employee
  async function addEmployee(_, { employee }) {
    await addEmployees(employee);
    return employee;
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
