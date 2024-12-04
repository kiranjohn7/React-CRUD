import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EmployeeSearch() {
  const [employeeType, setEmployeeType] = useState("");  // to store the selected employee
  const navigate = useNavigate();
  const location = useLocation();

  // TO set the type based on query params when the component mounts or the location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type") || "";
    setEmployeeType(type); // Updating the state
  }, [location.search]); // this triggers when the query string changes

  // function to filter employees based on type and updates the URL 
  const filterEmpType = () => {
    navigate(`/employees?type=${employeeType}`); // this is to navigate to the updated url
  };

  return (
    <div>
      <select
        name="employeeType"
        value={employeeType}
        onChange={(e) => setEmployeeType(e.target.value)} // updates the state when the we change the selected type
      >
        <option value="">All</option>
        <option value="FullTime">Full Time</option>
        <option value="PartTime">Part Time</option>
        <option value="Contract">Contract</option>
        <option value="Seasonal">Seasonal</option>
        <option value="upcomingRetirement">Upcoming Retirement</option>
      </select>
      <button onClick={filterEmpType}>Search </button>
    </div>
  );
}
