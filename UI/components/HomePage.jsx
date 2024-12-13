// HomePage.jsx
import React from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/employees");
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col className="text-center mb-4">
          <h1 className="display-4 text-primary">Employee Management System</h1>
          <p className="lead text-secondary">
            The Employee Management System (EMS) is a comprehensive platform designed to
            streamline the management of employee data, improve organizational efficiency,
            and facilitate seamless HR operations.
          </p>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title className="text-info">Manage Employees</Card.Title>
              <Card.Text>
                Track employee details, roles, and departments with ease. Edit and
                update records in real time.
              </Card.Text>
              <Button variant="info" onClick={handleGetStarted}>Learn More</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title className="text-success">Organizational Insights</Card.Title>
              <Card.Text>
                Gain valuable insights into employee performance and departmental efficiency
                with detailed reports.
              </Card.Text>
              <Button variant="success" onClick={handleGetStarted}>Learn More</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title className="text-danger">Seamless Integration</Card.Title>
              <Card.Text>
                Integrate EMS with your existing tools for a unified HR experience.
              </Card.Text>
              <Button variant="danger" onClick={handleGetStarted}>Learn More</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="text-center mt-4">
        <Col>
          <Button variant="primary" size="lg" onClick={handleGetStarted}>
            Get Started
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
