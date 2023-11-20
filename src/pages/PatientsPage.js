import React, {useState, useEffect} from 'react';
import { Link, Navigate } from 'react-router-dom';
import Header from '../components/Header'

function PatientsPage(){
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(sessionStorage.getItem('user'));

  const doctorId = user.person.id;

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`http://localhost:8080/doctor?id=${doctorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(user.username + ":" + user.password)
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();

        console.log(result);
        setDoctor(result);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, []);

  if (loading) {
    return <div><p>Loading...</p></div>;
  }

  if (error) {
    return <div><p>Error: {error}</p></div>;
  }

  if (!doctor) {
    return <div><p>Doctor not found.</p></div>;
  }

  return (
    <div>
      <Header />
      <h2>Patients for {doctor.name}</h2>
      <ul>
        {doctor.patients.map(patient => 
          <li>
            <p><strong>Name:</strong> <Link to={`/journal/${patient.id}`}>{patient.name}</Link> </p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Date of Birth:</strong> {patient.dob}</p>
          </li>
        )}
      </ul>
    </div>
  );
}

export default PatientsPage;