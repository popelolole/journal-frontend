import React, {useState, useEffect} from 'react';

function Patient({patientId}){
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`http://localhost:8080/patient?id=${patientId}`, {
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

        console.log(patient);

        setPatient(result);
      } catch (error) {
        // Handle errors
        setError(error.message);
      } finally {
        // Set loading to false whether the request succeeded or failed
        setLoading(false);
      }
    };

    // Call the fetchData function
    fetchPatient();
  }, []);

  if (loading) {
    return <div><p>Loading...</p></div>;
  }

  if (error) {
    return <div><p>Error: {error}</p></div>;
  }

  if (!patient) {
    return <div><p>Patient not found.</p></div>; // Handle the case where data is not available yet
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
            {patient.doctor.name}
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