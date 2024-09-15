interface WeatherOverviewType {
    activityDate: string; // Date of the weather data
    count: number; // Number of data points
    cloudsall: number; // Cloud cover percentage
    mainhumidity: number; // Humidity percentage
    mainsea_level: number; // Sea level pressure in hPa
    maintemp: number; // Temperature in Celsius
    pop: number; // Probability of precipitation
    rain3h: number; // Rain volume for the last 3 hours
    visibility: number; // Visibility in meters
    windspeed: number; // Wind speed in meters per second
};

interface DateOverviewType {
    activity: string; // Name of the activity
    date: string; // Date of the activity
    status: Status; // Status of the activity
}

type Status = 'Danger' | 'Moderate' | 'Good';

interface Activity {
    name: string;
    icon: React.ReactNode;
}
