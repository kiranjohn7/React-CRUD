import React from "react";
import { Routes, Route, NavLink,useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import EmployeeDirectory from "./EmployeeDirectory.jsx";
import EmployeeCreate from "./EmployeeCreate.jsx";
import EmployeeDetail from "./EmployeeDetail.jsx"; 
import HomePage from "./HomePage.jsx";



const NotFound = () => (
  <div className="text-center mt-4">
    <h1 className="text-danger">404 - Page Not Found</h1>
    <p className="text-muted">The page you are looking for does not exist.</p>
  </div>
);


export default function Navigation() {

  const navigate = useNavigate(); // Declare the useNavigate hook

  // Function to handle the "Get Support" button click
  const handleSupport = () => {
    navigate("/"); 
  };


  return (
    <Container fluid className="p-0">
      {/* Navbar */}
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="py-3 shadow-sm"
        style={{ fontFamily: "'Georgia', sans-serif" }}
      >
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="fw-bold text-uppercase" style={{ paddingRight: "400px" }}>
            EMS
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                as={NavLink}
                to="/"
                className="nav-link text-light mx-2"
                style={{ transition: "color 0.3s" }}
                activeStyle={{ color: "#0d6efd" }}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/employees"
                className="nav-link text-light mx-2"
                style={{ transition: "color 0.3s" }}
                activeStyle={{ color: "#0d6efd" }}
              >
                Employees List
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/create"
                className="nav-link text-light mx-2"
                style={{ transition: "color 0.3s" }}
                activeStyle={{ color: "#0d6efd" }}
              >
                Add Employee
              </Nav.Link>
            </Nav>
            <Button
              variant="outline-primary"
              className="ms-auto  px-4 py-2 shadow-sm"
              onClick={handleSupport}
            >
              Contact Support
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Page Content */}
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/employees" element={<EmployeeDirectory />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          <Route path="/create" element={<EmployeeCreate />} />
          <Route path="/edit/:id" element={<EmployeeCreate />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3 mt-5">
        <p className="mb-0">&copy; {new Date().getFullYear()} Employee Management System</p>
      </footer>
    </Container>
  );
}