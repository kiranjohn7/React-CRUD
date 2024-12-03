import React from "react";
import { useParams, useLocation, Outlet } from "react-router-dom";
import EmployeeTable from "./EmployeeTable.jsx";
import EmployeeSearch from "./EmployeeSearch.jsx";

function edParams(Ed) {
  return (props) => (
    <Ed {...props} myparam={useParams()} myloc={useLocation()} />
  );
}

class EmployeeDirectory extends React.Component {
  constructor(props) {
    super(props);
    this.state = { employees: [] };
  }

  componentDidMount() {
    this.loadData();
  }

  // This is to reload the data when the location search query changes
  componentDidUpdate(prevProps) {
    if (prevProps.myloc.search !== this.props.myloc.search) {
      this.loadData(); // reloading the data
    }
  }

  // Fetching the employees according to the type parameter
  loadData = async () => {
    const params = new URLSearchParams(this.props.myloc.search); //parsing the query parameters from URL
    const type = params.get("type") || "";
    const query = `query  {
        employees (type: "${type}") {
          id firstName lastName dob age dateOfJoining title department employeeType contractType
        }
      }`;
    const response = await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const result = await response.json();
    this.setState({ employees: result.data.employees }); // the state is updated with the fetched employee data
  };

  // This function is for deleting the employees by ID and reloads the list
  deleteEmployee = async (id) => {
    try {
      const query = `mutation {
        deleteEmployee(id: ${id}) 
      }`;
      const response = await fetch("/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const result = await response.json();
      if (result.data.deleteEmployee) {
        this.loadData(); // reloads the data
      } else {
        console.error("Failed to delete employee:", result.errors);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      this.setState({ error: error.message });
    }
  };

  render() {
    return (
      <div>
        <EmployeeSearch />
        <EmployeeTable
          deleteEmployee={this.deleteEmployee}
          employees={this.state.employees}
        />
        <Outlet />
      </div>
    );
  }
}

export default edParams(EmployeeDirectory);
