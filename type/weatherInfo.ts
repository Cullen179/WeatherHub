export const Temperature = {
  min: 0,
  max: 100,
};

export const WeatherInfo = {
  info: [
    {
      type: 'Temperature',
      min: 0,
      max: 100,
      startColor: '#4ab7ff',
      endColor: '#ff3232',
    },
  ],
};

export const WeatherType = WeatherInfo.info.map((info) => info.type);
