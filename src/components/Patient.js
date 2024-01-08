import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { jwtDecode } from 'jwt-decode';


function Patient({patientId}){
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = useAuth();

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const extractInfo = () => {
      if (auth && auth.user && auth.user.access_token) {
        const decodedToken = jwtDecode(auth.user.access_token);
        const realmRoles = decodedToken.realm_access?.roles || [];
        setRoles(realmRoles);
      }
    };

    extractInfo();
  }, [auth]);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = auth.user?.access_token;
        const response = await fetch(`https://raven-journal.app.cloud.cbh.kth.se/patient?id=${patientId}`, {
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

        console.log(patient);

        setPatient(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, []);

  if (loading) {
    return <div><p>Loading...</p></div>;
  }

  if (error) {
    return <div><p>Error: {error}</p></div>;
  }

  if (!patient) {
    return <div><p>Patient not found.</p></div>;
  }

  return (
    <div>
      <h2>Patient Information</h2>
      <ul>
        <li><strong>Name:</strong> {patient.name}</li>
        <li><strong>Gender:</strong> {patient.gender}</li>
        <li><strong>Date of Birth:</strong> {patient.dob}</li>
        <li><strong>Phone Number:</strong> {patient.phoneNumber}</li>
        <li><strong>Email:</strong> {patient.email}</li>

        <li><strong>Condition:</strong> 
        {patient.condition ?
          <div>
            <li>
              {patient.condition.condition}
            </li>
            <li>
              Description: {patient.condition.description}
            </li>
            <li>
              Severity: {patient.condition.severity}
            </li>
            <li>
              Date Diagnosed: {patient.condition.dateDiagnosed}
            </li>
            <li>
              Date Recovered: {patient.condition.dateRecovered}
            </li>
          </div>
          :
          ""}
        </li>

        <li>
          <strong>Doctor:</strong>
        {patient.doctor ? 
        <div>
          <li>
            {patient.doctor.name} {roles.includes("ROLE_PATIENT")
            ? <span>- <Link to={`/messages/${patient.doctor.id}/${patient.doctor.name}`}>Chat</Link></span> : ""}
          </li>
          <li>
            Phone number: {patient.doctor.phoneNumber}
          </li>
          <li>
            E-mail: {patient.doctor.email}
          </li>
        </div>
        :
        ""
        }
        </li>
      </ul>
    </div>
  );
}

export default Patient;