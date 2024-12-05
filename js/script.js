// Save note
document.querySelector('#save-note').addEventListener('click', () => {
  const noteInput = document.querySelector('#note-input').value;
  if (noteInput) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(noteInput);
    localStorage.setItem('notes', JSON.stringify(notes));
    document.querySelector('#note-input').value = ''; // Clear input
    displayNotes(); // Refresh the notes display
  }
});

// Display notes
function displayNotes() {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  const notesList = document.querySelector('#notes-list');
  notesList.innerHTML = ''; // Clear previous notes

  notes.forEach((note, index) => {
    const noteDiv = document.createElement('div');
    noteDiv.textContent = `${index + 1}. ${note}`;
    notesList.appendChild(noteDiv);
  });
}

// Save notes from calendar events
function saveNoteFromCalendar(noteText) {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.push(noteText);
  localStorage.setItem('notes', JSON.stringify(notes));
  displayNotes();
}

// Initialize the calendar
document.addEventListener('DOMContentLoaded', () => {
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: async function (info, successCallback, failureCallback) {
      try {
        const response = await fetch('https://events.umich.edu/day/json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const eventsData = await response.json();

        const events = eventsData.map(event => ({
          title: event.title,
          start: event.date, // Assuming event.date is in YYYY-MM-DD format
          url: event.url, // Link to the event
        }));
        successCallback(events);
      } catch (error) {
        console.error('Error fetching U-M events:', error);
        failureCallback(error);
      }
    },
    eventClick: function (info) {
      info.jsEvent.preventDefault();
      const noteText = `Event: ${info.event.title}, Date: ${info.event.start.toISOString().split('T')[0]}, URL: ${info.event.url}`;
      saveNoteFromCalendar(noteText);
    },
  });
  calendar.render();
});

// Function to fetch and display U-M events
async function fetchUMEvents() {
  try {
    const response = await fetch('https://events.umich.edu/day/json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const eventsData = await response.json();
    displayEvents(eventsData);
  } catch (error) {
    console.error('Error fetching U-M events:', error);
  }
}

// Display U-M events in the list
function displayEvents(events) {
  const eventsList = document.querySelector('#events-list');
  eventsList.innerHTML = ''; // Clear previous events

  events.forEach(event => {
    const eventItem = document.createElement('div');
    eventItem.classList.add('event-item');
    eventItem.innerHTML = `
      <h4>${event.title}</h4>
      <p>${event.date} at ${event.time}</p>
      <p>${event.location}</p>
      <a href="${event.url}" target="_blank">More Info</a>
    `;
    eventsList.appendChild(eventItem);
  });
}

// Call displayNotes and fetchUMEvents on load
document.addEventListener('DOMContentLoaded', () => {
  displayNotes();
  fetchUMEvents();
});
