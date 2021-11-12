export const colors = [
    {
        color: '#fff'
    },
    {
        color: '#ccefe5'
    },
    {
        color: "#ecf0f1"
    },
    {
        color: "#95a5a6"
    },
    {
        color: "#bdc3c7"
    },
    {
        color: "#f8a5c2"
    },
    {
        color: "#63cdda"
    },
    {
        color: "#cf6a87"
    },
    {
        color: "#778beb"
    },
    {
        color: "#f7f1e3"
    },
    {
        color: "#ffda79"
    },
    {
        color: "#33d9b2"
    },
    {
        color: "#67e6dc"
    },
    {
        color: "#7efff5"
    },
    {
        color: "#fffa65"
    },
    {
        color: "#ffaf40"
    },
    {
        color: '#C0392B'
    },
    {
        color: '#E74C3C'
    },
    {
        color: '#9B59B6'
    },
    {
        color: '#8E44AD'
    },
    {
        color: '#2980B9'
    },
];

const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    const d = new Date();
    const monthIndex = d.getMonth();
    const dayIndex = d.getDate();
    const hr = d.getHours();
    const hour = hr < 10 ? `0${hr}` : `${hr}` - 12;
    const min = d.getMinutes();
    const minute = min < 10 ? `0${min}` : `${min}`;
    const monthName = months[monthIndex];
    const time = hr < 12 ? "AM" : "PM";

export const setHours = `${monthName} ${dayIndex}, ${hour}:${minute} ${time}`;