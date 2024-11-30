import React from "react";
class EmployeeCreate extends React.Component {
  constructor() {
    super();
    this.state = {
      errors: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  validateForm(employee) {
    const errors = {};
    if (!employee.firstName || employee.firstName.trim() === "") {
      errors.firstName = "First name is required.";
    }
    if (!employee.lastName || employee.lastName.trim() === "") {
      errors.lastName = "Last name is required.";
    }
    if (!employee.age || employee.age < 20 || employee.age > 70) {
      errors.age = "Age must be between 20 and 70.";
    }
    if (!employee.dateOfJoining || employee.dateOfJoining === "") {
      errors.dateOfJoining = "Date of joining is required.";
    }
    if (!employee.title || employee.title === "") {
      errors.title = "Title is required.";
    }
    if (!employee.department || employee.department === "") {
      errors.department = "Department is required.";
    }
    return errors;
  }
  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.createEmployee;
    const employee = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      age: parseInt(form.age.value),
      dateOfJoining: form.dateOfJoining.value,
      title: form.title.value,
      department: form.department.value,
      employeeType: form.employeeType.value,
      contractType: true
    };
    const errors = this.validateForm(employee);
    if (Object.keys(errors).length > 0) {
      this.setState({
        errors
      });
      return;
    }
    this.setState({
      errors: {}
    });
    this.props.addEmployee(employee);
    form.reset();
  }
  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
      name: "createEmployee",
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "firstName",
      placeholder: "First Name"
    }), this.state.errors.firstName && /*#__PURE__*/React.createElement("div", null, this.state.errors.firstName), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "lastName",
      placeholder: "Last Name"
    }), this.state.errors.lastName && /*#__PURE__*/React.createElement("div", null, this.state.errors.lastName), /*#__PURE__*/React.createElement("input", {
      type: "number",
      name: "age",
      placeholder: "Age"
    }), this.state.errors.age && /*#__PURE__*/React.createElement("div", null, this.state.errors.age), /*#__PURE__*/React.createElement("input", {
      type: "date",
      name: "dateOfJoining",
      placeholder: "Date Of Joining"
    }), this.state.errors.dateOfJoining && /*#__PURE__*/React.createElement("div", null, this.state.errors.dateOfJoining), /*#__PURE__*/React.createElement("select", {
      name: "title"
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "Select Title"), /*#__PURE__*/React.createElement("option", {
      value: "Employee"
    }, "Employee"), /*#__PURE__*/React.createElement("option", {
      value: "Manager"
    }, "Manager"), /*#__PURE__*/React.createElement("option", {
      value: "Director"
    }, "Director"), /*#__PURE__*/React.createElement("option", {
      value: "VP"
    }, "VP")), this.state.errors.title && /*#__PURE__*/React.createElement("div", null, this.state.errors.title), /*#__PURE__*/React.createElement("select", {
      name: "department"
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "Select Department"), /*#__PURE__*/React.createElement("option", {
      value: "IT"
    }, "IT"), /*#__PURE__*/React.createElement("option", {
      value: "Marketing"
    }, "Marketing"), /*#__PURE__*/React.createElement("option", {
      value: "HR"
    }, "HR"), /*#__PURE__*/React.createElement("option", {
      value: "Engineering"
    }, "Engineering")), this.state.errors.department && /*#__PURE__*/React.createElement("div", null, this.state.errors.department), /*#__PURE__*/React.createElement("select", {
      name: "employeeType"
    }, /*#__PURE__*/React.createElement("option", {
      value: "FullTime"
    }, "Full Time"), /*#__PURE__*/React.createElement("option", {
      value: "PartTime"
    }, "Part Time"), /*#__PURE__*/React.createElement("option", {
      value: "Contract"
    }, "Contract"), /*#__PURE__*/React.createElement("option", {
      value: "Seasonal"
    }, "Seasonal")), /*#__PURE__*/React.createElement("input", {
      type: "submit",
      value: "Add"
    })));
  }
}
class EmployeeRow extends React.Component {
  render() {
    const isoDOJ = new Date(this.props.employee.dateOfJoining).toDateString();
    return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, this.props.employee.firstName), /*#__PURE__*/React.createElement("td", null, this.props.employee.lastName), /*#__PURE__*/React.createElement("td", null, this.props.employee.age), /*#__PURE__*/React.createElement("td", null, isoDOJ), /*#__PURE__*/React.createElement("td", null, this.props.employee.title), /*#__PURE__*/React.createElement("td", null, this.props.employee.department), /*#__PURE__*/React.createElement("td", null, this.props.employee.employeeType), /*#__PURE__*/React.createElement("td", null, this.props.employee.contractType ? "Working" : "Retired"));
  }
}
class EmployeeTable extends React.Component {
  render() {
    const result = this.props.employees.map(employee => /*#__PURE__*/React.createElement(EmployeeRow, {
      key: employee.id,
      employee: employee
    }));
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "First Name"), /*#__PURE__*/React.createElement("th", null, "Last Name"), /*#__PURE__*/React.createElement("th", null, "Age"), /*#__PURE__*/React.createElement("th", null, "Date Of Joining"), /*#__PURE__*/React.createElement("th", null, "Title"), /*#__PURE__*/React.createElement("th", null, "Department"), /*#__PURE__*/React.createElement("th", null, "Employee Type"), /*#__PURE__*/React.createElement("th", null, "Contract Type"))), /*#__PURE__*/React.createElement("tbody", null, result)));
  }
}
class EmployeeSearch extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "Search Employees"
    }), /*#__PURE__*/React.createElement("input", {
      type: "submit",
      value: "Search"
    }));
  }
}
class EmployeeDirectory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: []
    };
  }
  componentDidMount() {
    this.loadData();
  }
  addEmployee = async employee => {
    const query = `mutation createEmployee($employee: EmployeeInputType!) {
      createEmployee(employee: $employee) {
        id firstName lastName age dateOfJoining title department employeeType contractType
      }
    }`;
    const response = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
        variables: {
          employee
        }
      })
    });
    const result = await response.json();
    if (result.data.createEmployee) {
      this.loadData();
    }
  };
  loadData = async () => {
    const query = `query {
      employees {
        id firstName lastName age dateOfJoining title department employeeType contractType
      }
    }`;
    const response = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query
      })
    });
    const result = await response.json();
    this.setState({
      employees: result.data.employees
    });
  };
  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(EmployeeSearch, null), /*#__PURE__*/React.createElement(EmployeeTable, {
      employees: this.state.employees
    }), /*#__PURE__*/React.createElement(EmployeeCreate, {
      addEmployee: this.addEmployee
    }));
  }
}
const element = /*#__PURE__*/React.createElement(EmployeeDirectory, null);
ReactDOM.render(element, document.getElementById("root"));