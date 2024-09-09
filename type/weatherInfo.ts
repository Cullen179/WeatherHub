interface WeatherMustHave {
  type: string;
  definition: string;
  unit: string;
  variablePath: string;
  subPath?: string;
  chartColor: string;
}

export interface WeatherInfoType extends WeatherMustHave {
  [key: string]: any;
}
export const WeatherInfo: WeatherInfoType[] = [
  {
    type: 'Temperature',
    definition:
      'Temperature is a measure of the warmth or coldness of an object or substance with reference to a standard value.',
    unit: '°C',
    min: 0,
    max: 100,
    startColor: '#4ab7ff',
    endColor: '#ff3232',
    variablePath: 'main',
    subPath: 'temp',
    chartColor: '12 76% 61%',
  },
  {
    type: 'Humidity',
    definition:
      'Humidity is the amount of water vapor in the air. Water vapor is the gaseous state of water and is invisible. Humidity indicates the likelihood for precipitation, dew, or fog to be present.',
    unit: '%',
    variablePath: 'main',
    subPath: 'humidity',
    chartColor: '160 60% 45%',
  },
  {
    type: 'Sea Pressure',
    definition:
      'Sea pressure is the pressure exerted by the weight of the atmosphere above the sea level. It is also known as atmospheric pressure. It decreases with altitude.',
    unit: 'hPa',
    variablePath: 'main',
    subPath: 'sea_level',
    chartColor: '220 70% 50%',
  },
  {
    type: 'Visibility',
    definition:
      'Visibility is a measure of the distance at which an object or light can be clearly discerned. It is reported in kilometers or miles.',
    unit: 'km',
    variablePath: 'visibility',
    chartColor: '240 1% 58%',
  },
  {
    type: 'Wind Speed',
    definition:
      'Wind speed, or wind flow velocity, is a fundamental atmospheric quantity caused by air moving from high to low pressure, usually due to changes in temperature.',
    unit: 'm/s',
    variablePath: 'wind',
    subPath: 'speed',
    chartColor: '160 60% 45%',
  },
  {
    type: 'Probability of Precipitation',
    definition:
      'Probability of precipitation is a measure of the likelihood of precipitation occurring at a specific location within a specified time period.',
    unit: '%',
    variablePath: 'pop',
    chartColor: '280 65% 60%',
  },
  {
    type: 'Rain Volume',
    definition:
      'Rain volume is the amount of rain that falls in a specific location within a specified time period.',
    unit: 'mm',
    variablePath: 'rain',
    subPath: '3h',
    chartColor: '220 70% 50%',
  },
  {
    type: 'Cloudiness',
    definition:
      'Cloudiness is the fraction of the sky covered by clouds when observed from a particular location.',
    unit: '%',
    variablePath: 'clouds',
    subPath: 'all',
    chartColor: '240 1% 58%',
  }
];

export const WeatherType = WeatherInfo.map((info) => info.type);
