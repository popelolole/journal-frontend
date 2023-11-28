import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header'
import Patient from '../components/Patient'
import Encounters from '../components/Encounters'

function JournalPage(){
  const { patientId } = useParams();

  return (
    <div>
      <Header />
      <Patient patientId = {patientId} />
      <Encounters patientId = {patientId} />
    </div>
  );
}

export default JournalPage;