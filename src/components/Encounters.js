import React, {useState, useEffect} from 'react';

function Encounters({patientId}){
  const [encounters, setEncounters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    const fetchEncounters = async () => {
      try {
        const response = await fetch(`http://localhost:8080/patient/encounters?patientId=${patientId}`, {
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

        setEncounters(result);
      } catch (error) {
        // Handle errors
        setError(error.message);
      } finally {
        // Set loading to false whether the request succeeded or failed
        setLoading(false);
      }
    };

    // Call the fetchData function
    fetchEncounters();
  }, []);

  if (loading) {
    return <div><p>Loading...</p></div>;
  }

  if (error) {
    return <div><p>Error: {error}</p></div>;
  }

  if (!encounters) {
    return <div><p>Encounters not found.</p></div>; // Handle the case where data is not available yet
  }

  return (
    <div>
      <h2>Encounters</h2>
      <ul>
        {encounters.map(encounter => 
        <div>
          <li><strong>Encounter date: </strong>{encounter.date}</li>
          <li>Location: {encounter.location}</li>
          <li>Doctor: {encounter.doctor != null ? encounter.doctor.name : ""}</li>
        <br />
        {encounter.observations.map(observation => 
          <div>
            <li>Observation: {observation.observation}</li>
          </div>
        )}
        <br />
        </div>
          )}
      </ul>
    </div>
  );
}

export default Encounters;