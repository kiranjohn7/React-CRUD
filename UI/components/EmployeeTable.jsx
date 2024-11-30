import React from "react";
import { Link } from "react-router-dom";

class EmployeeRow extends React.Component {
  confirmDel = () => {
    if (this.props.employee.contractType == true) {
      alert("Cannot delete a working employee");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete this employee ${this.props.employee.lastName}, ${this.props.employee.firstName}`
      )
    ) {
      this.props.deleteEmployee(this.props.employee);
    }
  };
  render() {
    const isoDOJ = new Date(this.props.employee.dateOfJoining).toDateString();

    return (
      <tr key={this.props.employee.id}>
        <td>{this.props.employee.firstName}</td>
        <td>{this.props.employee.lastName}</td>
        <td>{this.props.employee.age}</td>
        <td>{isoDOJ}</td>
        <td>{this.props.employee.title}</td>
        <td>{this.props.employee.department}</td>
        <td>{this.props.employee.employeeType}</td>
        <td>{this.props.employee.contractType ? "Working" : "Retired"}</td>
        <td>
          <Link to={`/employees/${this.props.employee.id}`}>View</Link>
        </td>
        <td>
          <Link to={`/edit/${this.props.employee.id}`}>Edit</Link>
        </td>
        <td>
          <button onClick={this.confirmDel}>Del</button>
        </td>
      </tr>
    );
  }
}

export default class EmployeeTable extends React.Component {
  // To handle the deletion of a employee
  deleteEmployee = (employee) => {
    if (employee) {
      this.props.deleteEmployee(employee.id);
    }
  };
  render() {
    // this is to map the employees array to the EmployeeRow component
    const result = this.props.employees.map((employee, index) => (
      <EmployeeRow
        deleteEmployee={this.deleteEmployee}
        key={`${employee.id}-${index}`}
        employee={employee}
      />
    ));

    return (
      <div className="table_container">
        <style>
          {`
              .table_container {
                margin: 20px;
                padding: 10px;
              }
  
              .table {
                width: 100%;
                border: 1px solid black;
                border-collapse: collapse;
              }
  
              .table th,
              .table td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
              }
            `}
        </style>
        <table className="table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>Date Of Joining</th>
              <th>Title</th>
              <th>Department</th>
              <th>Employee Type</th>
              <th>Contract Type</th>
              <th>View</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{result}</tbody>
        </table>
      </div>
    );
  }
}
