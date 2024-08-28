import * as React from 'react';

// Define the props for the EmailTemplate component

// 
export interface EmailTemplateProps {
  data: EmailNotification[];
}
export interface EmailNotification {
  type: string; 
  value: number;
  date: Date;
} 



export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  data
}) => {

  // Separate the notifications by type
  const temperatureNotifications = data.filter((notification) => notification.type === 'temperature');
  const humidityNotifications = data.filter((notification) => notification.type === 'humidity');
  const seaPressureNotifications = data.filter((notification) => notification.type === 'seaPressure');
  const visibilityNotifications = data.filter((notification) => notification.type === 'visibility');
  const windSpeedNotifications = data.filter((notification) => notification.type === 'windSpeed');
  const rainChanceNotifications = data.filter((notification) => notification.type === 'rainChance');
  const rainVolumeNotifications = data.filter((notification) => notification.type === 'rainVolume');

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        color: '#333',
      }}
    >
      <h1>Weather Notifications</h1>
      <h2>Temperature</h2>
      {temperatureNotifications.map((notification, index) => (
        <p key={index}>
          Temperature: {notification.value}°C on {notification.date.toLocaleString()}
        </p>
      ))}
      <h2>Humidity</h2>
      {humidityNotifications.map((notification, index) => (
        <p key={index}>
          Humidity: {notification.value}% on {notification.date.toLocaleString()}
        </p>
      ))}
      <h2>Sea Pressure</h2>
      {seaPressureNotifications.map((notification, index) => (
        <p key={index}>
          Sea Pressure: {notification.value} hPa on {notification.date.toLocaleString()}
        </p>
      ))}
      <h2>Visibility</h2>
      {visibilityNotifications.map((notification, index) => (
        <p key={index}>
          Visibility: {notification.value} km on {notification.date.toLocaleString()}
        </p>
      ))}
      <h2>Wind Speed</h2>
      {windSpeedNotifications.map((notification, index) => (
        <p key={index}>
          Wind Speed: {notification.value} m/s on {notification.date.toLocaleString()}
        </p>
      ))}
      <h2>Rain Chance</h2>
      {rainChanceNotifications.map((notification, index) => (
        <p key={index}>
          Rain Chance: {notification.value}% on {notification.date.toLocaleString()}
        </p>
      ))}
      <h2>Rain Volume</h2>
      {rainVolumeNotifications.map((notification, index) => (
        <p key={index}>
          Rain Volume: {notification.value} mm on {notification.date.toLocaleString()}
        </p>
      ))}
    </div>
  );
};
