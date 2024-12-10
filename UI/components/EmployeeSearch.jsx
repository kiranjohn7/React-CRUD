import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EmployeeSearch() {
  const [employeeType, setEmployeeType] = useState(""); // to store the selected employee
  const [upcomingRetirement, setUpcomingRetirement] = useState(false); // New state to store the upcomingRetirement filter
  const navigate = useNavigate();
  const location = useLocation();

  // TO set the type based on query params when the component mounts or the location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type") || "";
    const retirement = params.get("upcomingRetirement") === "true"; // Check if retirement filter is set
    setEmployeeType(type); // Updating the state
    setUpcomingRetirement(retirement);
  }, [location.search]); // this triggers when the query string changes

  // function to filter employees based on type and updates the URL
  const filterEmpType = () => {
    const query = `/employees?type=${employeeType}&upcomingRetirement=${upcomingRetirement}`;
    navigate(query);
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
      </select>
      <label>
        <input
          type="checkbox"
          checked={upcomingRetirement}
          onChange={() => setUpcomingRetirement(!upcomingRetirement)}  // Toggle the retirement filter
        />
        Show Upcoming Retirement
      </label>
      <button onClick={filterEmpType}>Search </button>
    </div>
  );
}
