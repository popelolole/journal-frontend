import React, { useState, useEffect } from 'react';
import Header from '../components/Header.js';

const SearchPage = () => {
  const [searchType, setSearchType] = useState('patient');
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchField, setSearchField] = useState('Name');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
  };

  const fetchEncountersForDoctor = async (doctorId) => {
    const token = sessionStorage.getItem('token');
    try{
      const response = await fetch(`http://localhost:8080/encounter/byDoctor/${doctorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch encounters.");
      }
  
      const encountersData = await response.json();
  
      setSearchResults((prevResults) =>
        prevResults.map((result) =>
          result.id === doctorId ? { ...result, encounters: encountersData } : result
        )
      );    
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    console.log(`Searching for ${searchType}s with ${searchText}`);
    
    const token = sessionStorage.getItem('token');
    try{
    const response = await fetch(`http://localhost:8080/${searchType}/by${searchField}?name=${searchText}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch.");
    }

    const result = await response.json();

    setSearchResults(result);
    console.log(result);

    if (searchType === 'doctor') {
      result.forEach((doctor) => fetchEncountersForDoctor(doctor.id));
    }

  } catch (error) {
    setError(error.message);
  } finally{
    setLoading(false);
  }
  };

  const searchFieldsForDoctor = ['Name'];
  const searchFieldsForPatient = ['Name', 'Condition'];

  return (
    <div>
      <Header />
      <h1>Search Page</h1>
      <div>
        <label>
          Search for:
          <select value={searchType} onChange={handleSearchTypeChange}>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Search by:
          <select value={searchField} onChange={handleSearchFieldChange}>
            {searchType === 'doctor'
              ? searchFieldsForDoctor.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))
              : searchFieldsForPatient.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Search text:
          <input type="text" value={searchText} onChange={handleSearchTextChange} />
        </label>
      </div>
      <div>
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        {searchResults.length > 0 && (
          <div>
            <h2>Search Results:</h2>
            <ul>
          {searchResults.map((result) => (
            <li key={result.id}>
              <strong>Name:</strong> {result.name}
              <br />
              <strong>Gender:</strong> {result.gender}
              <br />
              <strong>Email:</strong> {result.email}
              <br />
              <strong>Phone Number:</strong> {result.phoneNumber}
              <br />
              <strong>Date of Birth:</strong> {result.dob}
              <br />
              {searchType === 'patient' && result.condition && (
                <>
                  <strong>Condition:</strong> {result.condition.condition}
                  <br />
                </>
              )}
              {searchType === 'doctor' && result.patients && (
                <>
                  <strong>Patients:</strong> {result.patients.map((patient) => patient.name).join(', ')}
                  <br />
                  <hr />
                </>
              )}
              {searchType === 'doctor' && result.encounters && (
                <>
                  <strong>Encounters:</strong>
                  <ul>
                    {result.encounters.map((encounter) => (
                      <li key={encounter.id}>
                        <strong>Patient:</strong> {encounter.patient.name}
                        <br />
                        <strong>Location:</strong> {encounter.location}
                        <br />
                        <strong>Date:</strong> {encounter.date}
                      </li>
                    ))}
                  </ul>
                  <hr />
                </>
              )}
              <hr />
            </li>
          ))}
        </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
