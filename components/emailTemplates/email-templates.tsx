import * as React from 'react';

interface EmailTemplateProps {
  humidity?: number;
  rainChance?: number;
  temperature?: number;
  UV?: number;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  humidity,
  rainChance,
  temperature,
  UV,
}) => (
  <div
    style={{ fontFamily: 'Arial, sans-serif', color: '#333', padding: '20px' }}
  >
    <h1 style={{ color: '#2c3e50' }}>Weather Update</h1>
    <p>Here is your weather update:</p>

    {temperature !== undefined && <p>Temperature: {temperature}°C</p>}

    {humidity !== undefined && <p>Humidity: {humidity}%</p>}

    {rainChance !== undefined && <p>Chance of Rain: {rainChance}%</p>}

    {UV !== undefined && <p>UV Index: {UV}</p>}

    <p>Stay safe and have a great day!</p>
  </div>
);
