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
                temp < 5 ||
                temp > 30 ||
                rainProb > 0.5 ||
                rainVol > 5 ||
                wind > 15
            )
                recommendation = 'Danger';
            else if (
                clouds > 70 ||
                temp < 10 ||
                temp > 25 ||
                rainProb > 0.3 ||
                wind > 10
            )
                recommendation = 'Moderate';
            break;
        case 'Running':
            if (
                temp < 0 ||
                temp > 30 ||
                rainProb > 0.5 ||
                vis < 5000 ||
                wind > 20
            )
                recommendation = 'Danger';
            else if (
                clouds > 50 ||
                temp < 5 ||
                temp > 25 ||
                rainProb > 0.2 ||
                vis < 10000
            )
                recommendation = 'Moderate';
            break;
        case 'Picnic':
            if (rainProb > 0.3 || rainVol > 2 || wind > 15)
                recommendation = 'Danger';
            else if (clouds > 60 || rainProb > 0.1 || vis < 8000)
                recommendation = 'Moderate';
            break;
        case 'Stargazing':
            if (clouds > 20 || wind > 10) recommendation = 'Danger';
            else if (clouds > 10 || vis < 20000) recommendation = 'Moderate';
            break;
        case 'Cycling':
            if (temp < 0 || temp > 35 || rainProb > 0.4 || wind > 25)
                recommendation = 'Danger';
            else if (clouds > 70 || rainProb > 0.2 || wind > 15)
                recommendation = 'Moderate';
            break;
        case 'Gardening':
            if (rainProb > 0.6 || rainVol > 10 || wind > 20)
                recommendation = 'Danger';
            else if (temp < 10 || temp > 30 || rainProb > 0.3 || wind > 15)
                recommendation = 'Moderate';
            break;
    }
    return recommendation as Status;
}

function WeatherActivity() { }

export { activities, recommendActivity, WeatherActivity };

