import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Card } from "react-bootstrap";

export default function EmployeeSearch() {
  const [employeeType, setEmployeeType] = useState(""); // to store the selected employee type
  const [upcomingRetirement, setUpcomingRetirement] = useState(false); // New state to store the upcomingRetirement filter
  const navigate = useNavigate();
  const location = useLocation();

  // To set the type based on query params when the component mounts or the location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type") || "";
    const retirement = params.get("upcomingRetirement") === "true"; // Check if retirement filter is set
    setEmployeeType(type); // Updating the state
    setUpcomingRetirement(retirement);
  }, [location.search]); // This triggers when the query string changes

  // Function to filter employees based on type and updates the URL
  const filterEmpType = () => {
    const query = `/employees?type=${employeeType}&upcomingRetirement=${upcomingRetirement}`;
    navigate(query);
  };

  return (
   <div className="mt-4 d-flex justify-content-end">
  <Card className="shadow-sm border-light rounded">
    <Card.Body>
    <h5 className="mb-4 text-primary text-center">Employee Filter</h5>
      <div className="d-flex justify-content-center align-items-center" >
        <Form className="w-95" style={{paddingLeft:"100px"}}>
        <Row className="mb-3 align-items-center">
          {/* Filter Dropdown */}
          <Col sm={12} md={6} lg={6}>
            <Form.Group controlId="employeeType">
              {/* <Form.Label>Filter</Form.Label> */}
              <Form.Control
                as="select"
                value={employeeType}
                onChange={(e) => setEmployeeType(e.target.value)} // updates the state when we change the selected type
                className="shadow-sm mb-3"
               
              >
                <option value="">All</option>
                <option value="FullTime">Full Time</option>
                <option value="PartTime">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Seasonal">Seasonal</option>
              </Form.Control>
            </Form.Group>
          </Col>

          {/* Upcoming Retirement Checkbox */}
          <Col sm={6} md={4} lg={4}>
            <Form.Group controlId="upcomingRetirement">
              <Form.Check
                type="checkbox"
                label="Upcoming Retirement"
                checked={upcomingRetirement}
                onChange={() => setUpcomingRetirement(!upcomingRetirement)} // Toggle the retirement filter
                className="ms-2"
              />
            </Form.Group>
          </Col>

          {/* Search Button */}
          <Col sm={12} md={5} lg={3} className="d-flex justify-content-end">
            <Button
              variant="primary"
              onClick={filterEmpType}
              className="px-4 py-2 shadow-lg "
              style={{ transition: "all 0.3s", width: "auto" }} // Reduced button width
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              Search
            </Button>
          </Col>
        </Row>
      </Form>
      </div>
    </Card.Body>
  </Card>
</div>

  );
}
