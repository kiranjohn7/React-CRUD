import React from "react";
import { Link } from "react-router-dom";
import { Button, Table, Modal } from "react-bootstrap";

class EmployeeRow extends React.Component {
  confirmDel = () => {
    if (this.props.employee.contractType === true) {
      this.props.showAlertModal(); // Show alert modal
    } else {
      this.props.showDeleteModal(this.props.employee); // Show delete confirmation modal
    }
  };

  render() {

    return (
      <tr key={this.props.employee.id}>
        <td>{this.props.employee.firstName}</td>
        <td>{this.props.employee.lastName}</td>
        <td>{this.props.employee.age}</td>
        <td>{this.props.employee.dateOfJoining}</td>
        <td>{this.props.employee.title}</td>
        <td>{this.props.employee.department}</td>
        <td>{this.props.employee.employeeType}</td>
        <td>{this.props.employee.contractType ? "Working" : "Retired"}</td>
        <td>
          <Link to={`/employees/${this.props.employee.id}`} className="btn btn-info btn-sm">
            View
          </Link>
        </td>
        <td>
          <Link to={`/edit/${this.props.employee.id}`} className="btn btn-warning btn-sm">
            Edit
          </Link>
        </td>
        <td>
          <Button variant="danger" size="sm" onClick={this.confirmDel}>
            Delete
          </Button>
        </td>
      </tr>
    );
  }
}

export default class EmployeeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showAlertModal: false,
      selectedEmployee: null,
    };
  }

  showDeleteModal = (employee) => {
    this.setState({
      showModal: true,
      selectedEmployee: employee,
    });
  };

  showAlertModal = () => {
    this.setState({ showAlertModal: true });
  };

  closeDeleteModal = () => {
    this.setState({ showModal: false });
  };

  closeAlertModal = () => {
    this.setState({ showAlertModal: false });
  };

  deleteEmployee = () => {
    const employee = this.state.selectedEmployee;
    if (employee) {
      this.props.deleteEmployee(employee.id);
    }
    this.setState({ showModal: false });
  };

  render() {
    const result = this.props.employees.map((employee, index) => (
      <EmployeeRow
        deleteEmployee={this.deleteEmployee}
        showDeleteModal={this.showDeleteModal}
        showAlertModal={this.showAlertModal} // Pass alert modal function to EmployeeRow
        key={`${employee.id}-${index}`}
        employee={employee}
      />
    ));

    return (
      <div className="mt-4">
        <h3 className="mb-4 text-center text-primary">Employee List</h3>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>Date Of Joining</th>
              <th>Title</th>
              <th>Department</th>
              <th>Employee Type</th>
              <th>Current Status</th>
              <th>View</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{result}</tbody>
        </Table>

        {/* Modal for deletion confirmation */}
        <Modal show={this.state.showModal} onHide={this.closeDeleteModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body >
            {this.state.selectedEmployee && (
              <p>
                Are you sure you want to delete employee{" "}
                <strong>
                  {this.state.selectedEmployee.firstName} {this.state.selectedEmployee.lastName}
                </strong>
                ?
              </p>
            )}
          </Modal.Body>
          <Modal.Footer >
            <Button variant="secondary" onClick={this.closeDeleteModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={this.deleteEmployee}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for alert message */}
        <Modal show={this.state.showAlertModal} onHide={this.closeAlertModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Action Not Allowed</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>The working employee cannot be deleted.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.closeAlertModal}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
