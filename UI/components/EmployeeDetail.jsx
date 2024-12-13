import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import { FaUser , FaCalendarAlt, FaBriefcase, FaBuilding, FaClock } from 'react-icons/fa';

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

  componentDidMount() {
    this.loadEmployeeData();
  }

  loadEmployeeData = async () => {
    const { id } = this.props.params;
    try {
      const query = `query {
        employee(id: ${id}) {
          id
          firstName
          lastName
          dob
          age
          dateOfJoining
          title
          department
          employeeType
          contractType
          retirementDate
          remainingTime {
            days
            months
            years
          }
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

  componentDidUpdate(prevProps) {
    if (this.props.params.id !== prevProps.params.id) {
      this.loadEmployeeData();
    }
  }

  render() {
    const { employee, error } = this.state;

    if (error) {
      return (
        <Container className="mt-4">
          <Alert variant="danger">
            {error}
          </Alert>
        </Container>
      );
    }

    return (
      <Container className="mt-4">
        <h1 className="text-center mb-4">Employee Details</h1>
        {employee && (
          <Card className="shadow">
            <Card.Body>
              <Row>
                <Col sm={6}>
                  <p><FaUser className="text-primary" />&nbsp; <b>First Name:</b> {employee.firstName}</p>
                  <p><FaUser className="text-primary" />&nbsp; <b>Last Name:</b> {employee.lastName}</p>
                  <p><FaCalendarAlt className="text-primary" /> &nbsp;<b>DOB:</b> {new Date(employee.dob).toDateString()}</p>
                  <p><FaClock className="text-primary" /> &nbsp;<b>Age:</b> {employee.age}</p>
                  <p><FaCalendarAlt className="text-primary" /> &nbsp;<b>Date of Joining:</b> {new Date(employee.dateOfJoining).toDateString()}</p>
                </Col>
                <Col sm={6}>
                  <p><FaBriefcase className="text-primary" /> &nbsp;<b>Title:</b> {employee.title}</p>
                  <p><FaBuilding className="text-primary"/> &nbsp;<b>Department:</b> {employee.department}</p>
                  <p><FaBriefcase className="text-primary"/>&nbsp; <b>Employee Type:</b> {employee.employeeType}</p>
                  <p><FaBriefcase className="text-primary"/>&nbsp; <b>Contract Type:</b> {employee.contractType ? "Permanent" : "Temporary"}</p>
                  <p><FaCalendarAlt className="text-primary"/>&nbsp; <b>Retirement Date:</b> {new Date(employee.retirementDate).toDateString()}</p>
                  
                </Col><br/><br/>

                <Col sm={12} className="text-center">
                  <p style={{ fontSize: '1.25rem', color: 'red' }}>
                    <FaClock className="text-danger" />&nbsp; 
                    <b>Time Left Until Retirement:</b> {employee.remainingTime.years} years, {employee.remainingTime.months} months, {employee.remainingTime.days} days
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}
      </Container>
    );
  }
}



export default detailParams(EmployeeDetail);
