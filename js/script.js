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

// Call displayNotes on load
displayNotes();

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

// Function to display events in the extension's popup
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

// Call fetchUMEvents when the popup is loaded
document.addEventListener('DOMContentLoaded', () => {
  fetchUMEvents();
});
