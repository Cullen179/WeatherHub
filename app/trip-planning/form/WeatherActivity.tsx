import {
    Bike,
    Flower2,
    Footprints,
    Mountain,
    Telescope,
    Tent,
} from 'lucide-react';

const activities: Activity[] = [
    {
        name: 'Hiking',
        icon: <Mountain />,
    },
    {
        name: 'Running',
        icon: <Footprints />,
    },
    {
        name: 'Picnic',
        icon: <Tent />,
    },
    {
        name: 'Stargazing',
        icon: <Telescope />,
    },
    {
        name: 'Cycling',
        icon: <Bike />,
    },
    {
        name: 'Gardening',
        icon: <Flower2 />,
    },
];

function recommendActivity(
    activity: string,
    clouds: number,
    temp: number,
    rainProb: number,
    rainVol: number,
    vis: number,
    wind: number
) {
    let recommendation = 'Good';
    switch (activity) {
        case 'Hiking':
            if (
                temp < 10 ||
                temp > 40 ||
                rainProb > 0.8 ||
                rainVol > 10 ||
                wind > 25
            )
                recommendation = 'Danger';
            else if (
                temp < 15 ||
                temp > 35 ||
                rainProb > 0.7 ||
                wind > 15
            )
                recommendation = 'Moderate';
            break;
        case 'Running':
            if (
                temp < 0 ||
                temp > 40 ||
                rainProb > 0.8 ||
                wind > 15
            )
                recommendation = 'Danger';
            else if (
                temp < 10 ||
                temp > 35 ||
                rainProb > 0.5 ||
                wind > 10
            )
                recommendation = 'Moderate';
            break;
        case 'Picnic':
            if (rainProb > 0.8 || rainVol > 10 || wind > 20)
                recommendation = 'Danger';
            else if (clouds > 70 || rainProb > 0.7 || vis < 2000)
                recommendation = 'Moderate';
            break;
        case 'Stargazing':
            if (clouds > 80 || vis < 3000) recommendation = 'Danger';
            else if (clouds > 70 || vis < 5000) recommendation = 'Moderate';
            break;
        case 'Cycling':
            if (temp < 10 || temp > 40 || rainProb > 0.8 || wind > 15)
                recommendation = 'Danger';
            else if (clouds > 70 || rainProb > 0.7 || wind > 10)
                recommendation = 'Moderate';
            break;
        case 'Gardening':
            if (rainProb > 0.8 || rainVol > 10 || wind > 15)
                recommendation = 'Danger';
            else if (temp < 10 || temp > 35 || rainProb > 0.7 || wind > 10)
                recommendation = 'Moderate';
            break;
    }
    return recommendation as Status;
}

function WeatherActivity() { }

export { activities, recommendActivity, WeatherActivity };

