import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
const editParams = (Ec) => {
  return (props) => (
    <Ec {...props} params={useParams()} mynav={useNavigate()} />
  );
};

class EmployeeCreate extends React.Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      errormsg: "",
      employee: null,
      isEdit: false,
      ageCalculation: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // To load the employee data if the ID is provided on the URL
  componentDidMount() {
    const { id } = this.props.params;
    if (id) {
      this.loadEmployeeData(id);
    }
  }

  componentDidUpdate(prevProps) {
    // Get the current 'id' parameter from the URL
    const currentId = this.props.params.id;
    if (prevProps.params.id !== currentId) {
      if (currentId) {
        this.loadEmployeeData(currentId);
      } else {
        // If there is no ID then reset the state
        this.setState({
          employee: null,      
          isEdit: false,       
          errors: {}  
        });
      }
    }
  }

  loadEmployeeData = async (id) => {
    try {
      const query = `query {
          employee(id: ${id}) {
            id firstName lastName dob age dateOfJoining title department employeeType contractType
          }
        }`;
      const response = await fetch("/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      if (result.data && result.data.employee) {
        this.setState({
          employee: result.data.employee,
          isEdit: true,
        });
      } else {
        this.setState({
          errormsg: "Employee not found.",
        });
      }
    } catch (errormsg) {
      this.setState({
        errormsg: "An error occurred while fetching the employee details.",
      });
    }
  };

  // validation for the form
  validateForm(employee) {
    const errors = {};
    const dateValidation = new Date();

    if (!employee.firstName || employee.firstName.trim() === "") {
      errors.firstName = "First name is required.";
    }

    if (!employee.lastName || employee.lastName.trim() === "") {
      errors.lastName = "Last name is required.";
    }

    if (!employee.dob || employee.dob === "") {
      errors.dob = "Date of birth is required.";
    } else {
      const age = this.ageCalculation(employee.dob);
      if (age < 20 || age > 70) {
        errors.dob = "Age must be between 20 and 70 years.";
      }
    }

    if (!employee.dateOfJoining || employee.dateOfJoining === "") {
      errors.dateOfJoining = "Date of joining is required.";
    } else if (new Date(employee.dateOfJoining) > dateValidation) {
      errors.dateOfJoining = "Date of joining cannot be in the future.";
    }

    if (!employee.title || employee.title === "") {
      errors.title = "Title is required.";
    }

    if (!employee.department || employee.department === "") {
      errors.department = "Department is required.";
    }
    return errors;
  }

  // Calculate age based on the DOB
  ageCalculation(dob) {
    const currentDate = new Date();
    const birthday = new Date(dob);
    let age = currentDate.getFullYear() - birthday.getFullYear();
    const monthDiff = currentDate.getMonth() - birthday.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < birthday.getDate())
    ) {
      age--;
    }

    return age;
  }

  // this fuction is for handling dob calculation
  handleChange(event) {
    const { name, value } = event.target;
    const currentDate = new Date();

    if (name === "dob") {
      const age = this.ageCalculation(value);
      if (age < 20 || age > 70) {
        this.setState({
          errors: {
            ...this.state.errors,
            dob: "Age must be between 20 and 70.",
          },
          calculatedAge: "",
        });
      } else {
        this.setState({
          errors: {
            ...this.state.errors,
            dob: null,
          },
          calculatedAge: age,
        });
      }
    }

    if (name === "dateOfJoining") {
      if (new Date(value) > currentDate) {
        this.setState({
          errors: {
            ...this.state.errors,
            dateOfJoining: "Date of joining cannot be in the future.",
          },
        });
      } else {
        this.setState({
          errors: {
            ...this.state.errors,
            dateOfJoining: null,
          },
        });
      }
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.createEmployee;
    const employee = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      dob: form.dob.value,
      age: parseInt(form.age.value),
      dateOfJoining: form.dateOfJoining.value,
      title: form.title.value,
      department: form.department.value,
      employeeType: form.employeeType.value,
      contractType: this.state.isEdit
        ? JSON.parse(form.contractType.value)
        : true,
    };

    // Validates the imputs in the form and displays the error if it fails
    const errors = this.validateForm(employee);
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }
    this.setState({ errors: {} });

    // if the isEdit is true then it will display the form for editing if not its for create employee
    const query = this.state.isEdit
      ? `
    mutation updateEmployee($id: Int!, $employee: EmployeeInputType!) {
      updateEmployee(id: $id ,employee: $employee) {
        id firstName lastName dob age dateOfJoining title department employeeType contractType
      }
    }
  `
      : `
      mutation createEmployee($employee: EmployeeInputType!) {
        createEmployee(employee: $employee) {
          id firstName lastName dob age dateOfJoining title department employeeType contractType
        }
      }
    `;

    const variables = this.state.isEdit
      ? { id: parseInt(this.state.employee.id), employee }
      : { employee };
    const response = await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    const result = await response.json();

    if (
      this.state.isEdit
        ? result.data.updateEmployee
        : result.data.createEmployee
    ) {
      this.state.isEdit
        ? alert("Employee Updated successfully!")
        : alert("Employee created successfully!");
      form.reset();
    }
    this.props.mynav("/employees");
  }

  render() {
    const { employee } = this.state;
    const currentDate = new Date();
    const minDOB = new Date();
    const maxDOB = new Date();

    // Calculating the minimum and maximum dates for DOB 
    minDOB.setFullYear(currentDate.getFullYear() - 70); 
    maxDOB.setFullYear(currentDate.getFullYear() - 20);

        return (
      <div>
        <center>
          <h2>{this.state.isEdit ? "Update" : "Create"} Employee</h2>

          <Form name="createEmployee" onSubmit={this.handleSubmit}>
            {/* First Name */}
            <Form.Group as={Row} controlId="formFirstName">
              <Form.Label column sm={2}>FirstName:</Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  defaultValue={employee ? employee.firstName : ""}
                  disabled={!!employee}
                />
                {this.state.errors.firstName && (
                  <Alert variant="danger">{this.state.errors.firstName}</Alert>
                )}
              </Col>
            </Form.Group><br/>

            {/* Last Name */}
            <Form.Group as={Row} controlId="formLastName">
              <Form.Label column sm={2}>LastName:</Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  defaultValue={employee ? employee.lastName : ""}
                  disabled={!!employee}
                />
                {this.state.errors.lastName && (
                  <Alert variant="danger">{this.state.errors.lastName}</Alert>
                )}
              </Col>
            </Form.Group><br/>

            {/* Date of Birth */}
            <Form.Group as={Row} controlId="formDOB">
              <Form.Label column sm={2}>DOB:</Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="date"
                  name="dob"
                  placeholder="DOB"
                  defaultValue={employee ? employee.dob.slice(0, 10) : ""}
                  onChange={this.handleChange}
                  disabled={!!employee}
                  min={minDOB.toISOString().split("T")[0]}
                  max={maxDOB.toISOString().split("T")[0]}
                />
                {this.state.errors.dob && <Alert variant="danger">{this.state.errors.dob}</Alert>}
              </Col>
            </Form.Group><br/>

            {/* Age */}
            <Form.Group as={Row} controlId="formAge">
              <Form.Label column sm={2}>Age:</Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="number"
                  name="age"
                  placeholder="Age"
                  defaultValue={
                    this.state.isEdit ? employee.age : this.state.calculatedAge
                  }
                  disabled
                />
                {this.state.errors.age && <Alert variant="danger">{this.state.errors.age}</Alert>}
              </Col>
            </Form.Group><br/>

            {/* Date of Joining */}
            <Form.Group as={Row} controlId="formDateOfJoining">
              <Form.Label column sm={2}>Date of Joining:</Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="date"
                  name="dateOfJoining"
                  placeholder="Date Of Joining"
                  defaultValue={employee ? employee.dateOfJoining.slice(0, 10) : ""}
                  disabled={!!employee}
                  max={currentDate.toISOString().split("T")[0]}
                />
                {this.state.errors.dateOfJoining && (
                  <Alert variant="danger">{this.state.errors.dateOfJoining}</Alert>
                )}
              </Col>
            </Form.Group><br/>

            {/* Title */}
            <Form.Group as={Row} controlId="formTitle">
              <Form.Label column sm={2}>Title:</Form.Label>
              <Col sm={10}>
                <Form.Control
                  as="select"
                  name="title"
                  defaultValue={employee ? employee.title : ""}
                >
                  <option value="" disabled>Select Title</option>
                  <option value="Employee" selected={employee && employee.title === "Employee"}>Employee</option>
                  <option value="Manager" selected={employee && employee.title === "Manager"}>Manager</option>
                  <option value="Director" selected={employee && employee.title === "Director"}>Director</option>
                  <option value="VP" selected={employee && employee.title === "VP"}>VP</option>
                </Form.Control>
                {this.state.errors.title && <Alert variant="danger">{this.state.errors.title}</Alert>}
              </Col>
            </Form.Group><br/>

            {/* Department */}
            <Form.Group as={Row} controlId="formDepartment">
              <Form.Label column sm={2}>Department:</Form.Label>
              <Col sm={10}>
                <Form.Control
                  as="select"
                  name="department"
                  defaultValue={employee ? employee.department : ""}
                >
                  <option value="" disabled>Select Department</option>
                  <option value="IT" selected={employee && employee.department === "IT"}>IT</option>
                  <option value="Marketing" selected={employee && employee.department === "Marketing"}>Marketing</option>
                  <option value="HR" selected={employee && employee.department === "HR"}>HR</option>
                  <option value="Engineering" selected={employee && employee.department === "Engineering"}>Engineering</option>
                </Form.Control>
                {this.state.errors.department && <Alert variant="danger">{this.state.errors.department}</Alert>}
              </Col>
            </Form.Group><br/>

            {/* Employee Type */}
            <Form.Group as={Row} controlId="formEmployeeType">
              <Form.Label column sm={2}>Employee Type:</Form.Label>
              <Col sm={10}>
                <Form.Control
                  as="select"
                  name="employeeType"
                  defaultValue={employee ? employee.employeeType : ""}
                  disabled={!!employee}
                >
                  <option value="FullTime" selected={employee && employee.employeeType === "FullTime"}>Full Time</option>
                  <option value="PartTime" selected={employee && employee.employeeType === "PartTime"}>Part Time</option>
                  <option value="Contract" selected={employee && employee.employeeType === "Contract"}>Contract</option>
                  <option value="Seasonal" selected={employee && employee.employeeType === "Seasonal"}>Seasonal</option>
                </Form.Control>
              </Col>
            </Form.Group><br/>

            {/* Contract Type */}
            {employee && (
              <Form.Group as={Row} controlId="formContractType">
                <Form.Label column sm={2}>Contract Type:</Form.Label>
                <Col sm={10}>
                  <Form.Control
                    as="select"
                    name="contractType"
                    defaultValue={employee ? employee.contractType : true}
                  >
                    <option value={true} selected={employee && employee.contractType === true}>Working</option>
                    <option value={false} selected={employee && employee.contractType === false}>Retired</option>
                  </Form.Control>
                </Col>
              </Form.Group>
            )}
            <br/>
            <Form.Group as={Row}>
              <Col sm={{ span: 10, offset: 2 }}>
                <Button type="submit" variant="primary" style={{ backgroundColor: 'green', color: 'white' }}>{employee ? "Update Employee" : "Add Employee"}</Button>
              </Col>
            </Form.Group>
          </Form>
        </center>
      </div>
    );
  }
}

export default editParams(EmployeeCreate);
