import * as React from 'react';

interface EmailTemplateProps {
  type: string;
  value: number;
  date: Date;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  type,
  value,
  date,
}) => {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        color: '#333',
      }}
    >
      <h1 style={{ color: '#007BFF' }}>WeatherHub Alert</h1>
      <p>Dear User,</p>
      <p>
        We have detected a weather condition for tomorrow that matches your
        criteria:
      </p>
      <div style={{ marginBottom: '20px' }}>
        <h2>{type.charAt(0).toUpperCase() + type.slice(1)} Alert</h2>
        <p>
          <strong>Value:</strong> {value}
        </p>
        <p>
          <strong>Date:</strong> {date.toISOString()}
        </p>
      </div>
      <p>Thank you for using WeatherHub!</p>
      <p>
        Best regards,
        <br />
        The WeatherHub Team
      </p>
    </div>
  );
};
