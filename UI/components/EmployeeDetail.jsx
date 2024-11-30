import React from "react";
import { useParams } from "react-router-dom";

function detailParams(EmpD) {
  return (props) => {
    const params = useParams();
    return <EmpD {...props} params={params} />;
  };
}

class EmployeeDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employee: null,
      error: null,
    };
  }

  // Loading the employee datas
  componentDidMount() {
    this.loadEmployeeData();
  }

  // Getting the employee based on ID params
  loadEmployeeData = async () => {
    const { id } = this.props.params;
    try {
      const query = `query {
        employee(id: ${id}) {
          id firstName lastName age dateOfJoining title department employeeType contractType
        }
      }`;
      const response = await fetch("/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();

      // Checking if we are getting the employee data and updating the state
      if (result.data && result.data.employee) {
        this.setState({
          employee: result.data.employee,
        });
      } else {
        this.setState({
          error: "Employee not found.",
        });
      }
    } catch (error) {
      this.setState({
        error: "There is an error fetching the employee details.",
      });
    }
  };

  // To reload the employee datas if the route params changes
  componentDidUpdate(prevProps) {
    if (this.props.params.id !== prevProps.params.id) {
      this.loadEmployeeData();
    }
  }

  render() {
    const { employee, error } = this.state;
    if (error) {
      return <div>{error}</div>;
    }

    return (
      <div>
        <h1>Employee Details</h1>
        {employee && (
          <div>
            <p>
              <b>First Name:</b> {employee.firstName}
            </p>
            <p>
              <b>Last Name:</b> {employee.lastName}
            </p>
            <p>
              <b>Age:</b> {employee.age}
            </p>
            <p>
              <b>Date of Joining:</b> {employee.dateOfJoining}
            </p>
            <p>
              <b>Title:</b> {employee.title}
            </p>
            <p>
              <b>Department:</b> {employee.department}
            </p>
            <p>
              <b>Employee Type:</b> {employee.employeeType}
            </p>
            <p>
              <b>Contract Type:</b>{" "}
              {employee.contractType ? "Working" : "Retired"}
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default detailParams(EmployeeDetail);
