import React from "react";
import { useParams, useNavigate } from "react-router-dom";

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
          <h1>{this.state.isEdit ? "Edit" : "Create"} Employee </h1>

          <form name="createEmployee" onSubmit={this.handleSubmit}>
            <div>
              <label>FirstName: </label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                defaultValue={employee ? employee.firstName : ""}
                disabled={!!employee}
              />
              {this.state.errors.firstName && (
                <div>{this.state.errors.firstName}</div>
              )}
            </div>
            <br />
            <div>
              <label>LastName: </label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                defaultValue={employee ? employee.lastName : ""}
                disabled={!!employee}
              />
              {this.state.errors.lastName && (
                <div>{this.state.errors.lastName}</div>
              )}
            </div>
            <br />
            <div>
              <label>DOB:</label>
              <input
                type="date"
                name="dob"
                placeholder="DOB"
                defaultValue={employee ? employee.dob.slice(0, 10) : ""}
                onChange={this.handleChange}
                disabled={!!employee}
                min={minDOB.toISOString().split("T")[0]}
                max={maxDOB.toISOString().split("T")[0]}
              />
              {this.state.errors.dob && <div>{this.state.errors.dob}</div>}
            </div>
            <br />
            <div>
              <label>Age: </label>
              <input
                type="number"
                name="age"
                placeholder="Age"
                defaultValue={
                  this.state.isEdit ? employee.age : this.state.calculatedAge
                }
                disabled
              />
              {this.state.errors.age && <div>{this.state.errors.age}</div>}
            </div>
            <br />
            <div>
              <label>Date of Joining: </label>
              <input
                type="date"
                name="dateOfJoining"
                placeholder="Date Of Joining"
                defaultValue={
                  employee ? employee.dateOfJoining.slice(0, 10) : ""
                }
                disabled={!!employee}
                max={currentDate.toISOString().split("T")[0]}
              />
              {this.state.errors.dateOfJoining && (
                <div>{this.state.errors.dateOfJoining}</div>
              )}
            </div>
            <br />
            <div>
              <label>Title: </label>
              <select
                name="title"
                defaultValue={employee ? employee.title : ""}
              >
                <option value="" disabled selected>
                  Select Title
                </option>
                <option
                  value="Employee"
                  selected={
                    employee && employee.title == "Employee" ? true : false
                  }
                >
                  Employee
                </option>
                <option
                  value="Manager"
                  selected={
                    employee && employee.title == "Manager" ? true : false
                  }
                >
                  Manager
                </option>
                <option
                  value="Director"
                  selected={
                    employee && employee.title == "Director" ? true : false
                  }
                >
                  Director
                </option>
                <option
                  value="VP"
                  selected={employee && employee.title == "VP" ? true : false}
                >
                  VP
                </option>
              </select>
              {this.state.errors.title && <div>{this.state.errors.title}</div>}
            </div>
            <br />
            <div>
              <label>Department: </label>
              <select
                name="department"
                defaultValue={employee ? employee.department : ""}
              >
                <option value="" disabled selected>
                  Select Department
                </option>
                <option
                  value="IT"
                  selected={
                    employee && employee.department == "IT" ? true : false
                  }
                >
                  IT
                </option>
                <option
                  value="Marketing"
                  selected={
                    employee && employee.department == "Marketing"
                      ? true
                      : false
                  }
                >
                  Marketing
                </option>
                <option
                  value="HR"
                  selected={
                    employee && employee.department == "HR" ? true : false
                  }
                >
                  HR
                </option>
                <option
                  value="Engineering"
                  selected={
                    employee && employee.department == "Engineering"
                      ? true
                      : false
                  }
                >
                  Engineering
                </option>
              </select>
              {this.state.errors.department && (
                <div>{this.state.errors.department}</div>
              )}
            </div>
            <br />
            <div>
              <label>Employee Type: </label>
              <select
                name="employeeType"
                defaultValue={employee ? employee.employeeType : ""}
                disabled={!!employee}
              >
                <option
                  value="FullTime"
                  selected={
                    employee && employee.employeeType == "FullTime"
                      ? true
                      : false
                  }
                >
                  Full Time
                </option>
                <option
                  value="PartTime"
                  selected={
                    employee && employee.employeeType == "PartTime"
                      ? true
                      : false
                  }
                >
                  Part Time
                </option>
                <option
                  value="Contract"
                  selected={
                    employee && employee.employeeType == "Contract"
                      ? true
                      : false
                  }
                >
                  Contract
                </option>
                <option
                  value="Seasonal"
                  selected={
                    employee && employee.employeeType == "Seasonal"
                      ? true
                      : false
                  }
                >
                  Seasonal
                </option>
              </select>
            </div>
            <br />
            {employee && (
              <div>
                <label>Contract Type: </label>
                <select
                  name="contractType"
                  id="contractType"
                  defaultValue={employee ? employee.contractType : true}
                >
                  <option
                    value={true}
                    selected={
                      employee && employee.contractType == true ? true : false
                    }
                  >
                    Working
                  </option>
                  <option
                    value={false}
                    selected={
                      employee && employee.contractType == false ? true : false
                    }
                  >
                    Retired
                  </option>
                </select>
              </div>
            )}
            <br />
            <div>
              <input type="submit" value={employee ? "Update" : "Add"} />
            </div>
          </form>
        </center>
      </div>
    );
  }
}

export default editParams(EmployeeCreate);
