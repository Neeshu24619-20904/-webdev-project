// Event Planner with Interactive Features
// Load Google API Client
function loadGoogleAPI() {
    gapi.load('client:auth2', initClient);
}

// Initialize Google API Client
function initClient() {
    gapi.client.init({
        apiKey: 'AIzaSyCOgdxUQKAeow4XTSTf-JzUs6yRpDTABsI',
        clientId: 'YOUR_CLIENT_ID',
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: "https://www.googleapis.com/auth/calendar.readonly"
    }).then(() => {
        gapi.auth2.getAuthInstance().signIn().then(fetchEvents);
    });
}

// Fetch events from Google Calendar API
async function fetchEvents() {
    try {
        const response = await gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': new Date().toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
        });

        updateEventSchedule(response.result);
    } catch (error) {
        console.error("Error fetching events: ", error);
    }
}

// Trigger Google API load when page loads
document.addEventListener('DOMContentLoaded', loadGoogleAPI);


// Fetch events from Google Calendar API
// async function fetchEvents() {
//     const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events'); // Example API
//     const data = await response.json();
//     return data;
// }

// Fetch venue suggestions from Yelp API
async function fetchVenues() {
    const response = await fetch('https://api.yelp.com/v3/businesses/search?location=YOUR_CITY&term=venue');
    const data = await response.json();
    return data;
}

// Process and visualize event schedule
function updateEventSchedule(eventData) {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = '';
    eventData.items.forEach(event => {
        const listItem = document.createElement('li');
        listItem.textContent = `${event.summary} - ${new Date(event.start.dateTime).toLocaleString()}`;
        eventList.appendChild(listItem);
    });
}

// Provide venue recommendations
function generateVenueRecommendations(venueData) {
    let recommendations = venueData.businesses.map(business => `${business.name} - Rating: ${business.rating}/5`);
    document.getElementById('venueRecommendations').innerHTML = recommendations.join('<br>');
}

// Initialize event planner
async function initEventPlanner() {
    const eventData = await fetchEvents();
    const venueData = await fetchVenues();
    updateEventSchedule(eventData);
    generateVenueRecommendations(venueData);
}

document.addEventListener('DOMContentLoaded', initEventPlanner);
