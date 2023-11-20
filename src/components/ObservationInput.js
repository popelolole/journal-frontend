import { useState } from 'react';

const ObservationInput = ({ onAddObservation }) => {
  const [observationInput, setObservationInput] = useState('');
  const [showObservationInput, setShowObservationInput] = useState(false);

  const handleAddObservation = () => {
    onAddObservation(observationInput);
    setObservationInput('');
    setShowObservationInput(false);
  };

  return (
    <div>
      {showObservationInput ? 
      <div>
      <input
        type="text"
        value={observationInput}
        onChange={(e) => setObservationInput(e.target.value)}
        placeholder="Type observation here"
      />
      <button onClick={handleAddObservation}>Add Observation</button>
      </div>
      :
      <button onClick={() => setShowObservationInput(true)}>+</button>
      }
    </div>
  );
};

export default ObservationInput;