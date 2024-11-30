import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import EmployeeDirectory from "./EmployeeDirectory.jsx";
import EmployeeCreate from "./EmployeeCreate.jsx";
import EmployeeDetail from "./EmployeeDetail.jsx";

const Home = () => <h1> This is Home Page</h1>;
const NotFound = () => <h1>Page Not Found</h1>;

export default function Navbar() {
  return (
    <>
      <NavLink to="/">Home Page</NavLink> {" | "}
      <NavLink to="/employees">Employees List</NavLink> {" | "}
      <NavLink to="/create">Add an Employee </NavLink> 

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/employees" element={<EmployeeDirectory />}>
          <Route path=":id" element={<EmployeeDetail />} />
        </Route>
        <Route path="/create" element={<EmployeeCreate />} />
        <Route path="/edit/:id" element={<EmployeeCreate />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
}
