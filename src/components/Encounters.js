import React, {useState, useEffect} from 'react';
import ObservationInput from './ObservationInput';

function Encounters({patientId}){
  const [encounters, setEncounters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(sessionStorage.getItem('tokenJSON'));

  const fetchEncounters = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:31000/patient/encounters?patientId=${patientId}`, {
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

      setEncounters(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncounters();
  }, []);

  const handleAddObservation = (encounterIndex, observation) => {
    const encounter = encounters[encounterIndex];
    postObservation(encounter, observation);
    console.log(encounters);
  };
  
  if (loading) {
    return <div><p>Loading...</p></div>;
  }

  if (error) {
    return <div><p>Error: {error}</p></div>;
  }

  if (!encounters) {
    return <div><p>Encounters not found.</p></div>;
  }

  const postObservation = async (encounter, observation) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:31000/encounter/observation?encounterId=${encounter.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({"observation": observation, "patient": {"id": encounter.patient.id}}),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('POST request successful:', data);
        setEncounters(encounters.map(en => {
          if(en.id === encounter.id){
            return { ...en, observations: [...en.observations, data] };
          }
          return en;
        }));
      } else {
        console.error('POST request failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while making the POST request:', error);
    }
  };

  return (
    <div>
      <h2>Encounters</h2>
      <ul>
        {encounters.map((encounter, index) => 
        <div key={index}>
          <li><strong>Encounter date: </strong>{encounter.date}</li>
          <li>Location: {encounter.location}</li>
          <li>Doctor: {encounter.doctor != null ? encounter.doctor.name : ""}</li>
        <br />
        {encounter.observations.map((observation, obsIndex) => 
          <div key={obsIndex}>
            <li>Observation: {observation.observation}</li>
          </div>
        )}
        {user.role === "ROLE_DOCTOR" ? 
        <ObservationInput
            onAddObservation={(observation) => handleAddObservation(index, observation)}
          /> 
          : ""}
        <br />
        </div>
          )}
      </ul>
    </div>
  );
}

export default Encounters;