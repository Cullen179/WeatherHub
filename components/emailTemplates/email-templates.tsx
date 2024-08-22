import * as React from 'react';

interface EmailTemplateProps {
  temperature?: number;
  spark?: number;
  hurricane?: number;
  fire?: number;
  airQuality?: number;
  stormRisk?: number;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  temperature, 
  spark,
  hurricane,
  fire,
  airQuality,
  stormRisk,
}) => (
  <div
    style={{ fontFamily: 'Arial, sans-serif', color: '#333', padding: '20px' }}
  >
    <h1 style={{ color: '#2c3e50' }}>Weather Update</h1>
    <p>Attention!!!, we have detected values beyond your acceptable range, see values below:</p>
    <br />

    {temperature && (
      <p>
        <strong>Temperature:</strong> {temperature}
      </p>
    )}
    {spark && (
      <p>
        <strong>Spark:</strong> {spark}
      </p>
    )}
    {hurricane && (
      <p>
        <strong>Hurricane:</strong> {hurricane}
      </p>
    )}
    {fire && (
      <p>
        <strong>Fire:</strong> {fire}
      </p>
    )}
    {airQuality && (
      <p>
        <strong>Air Quality:</strong> {airQuality}
      </p>
    )}
    {stormRisk && (
      <p>
        <strong>Storm Risk:</strong> {stormRisk}
      </p>
    )}
    <p>Stay safe and have a great day!</p>
  </div>
);
