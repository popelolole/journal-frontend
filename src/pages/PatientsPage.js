import React, {useState, useEffect} from 'react';
import { Link, Navigate } from 'react-router-dom';
import Header from '../components/Header'
import { useAuth } from 'react-oidc-context';
import { jwtDecode } from 'jwt-decode';

function PatientsPage(){
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = useAuth();

  const [personId, setPersonId] = useState();

  useEffect(() => {
    const extractInfo = () => {
      if (auth && auth.user && auth.user.access_token) {
        const decodedToken = jwtDecode(auth.user.access_token);
        const personId = decodedToken.person_id;
        setPersonId(personId);
      }
    };

    extractInfo();
  }, [auth]);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const doctorId = auth.user.profile.person_id;
        const token = auth.user?.access_token;
        const response = await fetch(`https://raven-journal.app.cloud.cbh.kth.se/doctor?id=${doctorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
            <p><Link to={`/messages/${patient.id}/${patient.name}`}>Chat</Link></p>
          </li>
        )}
      </ul>
    </div>
  );
}

export default PatientsPage;