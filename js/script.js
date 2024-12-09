// Dummy Data for Michigan Hockey Schedule
const hockeySchedule = [
  {
    title: 'Michigan vs. Ohio State',
    start: '2024-12-08T19:00:00',
    location: 'Yost Ice Arena',
    description: 'Big Ten Conference Game',
    url: 'https://mgoblue.com/sports/mens-ice-hockey/schedule'
  },
  {
    title: 'Michigan vs. Wisconsin',
    start: '2024-12-15T19:00:00',
    location: 'Yost Ice Arena',
    description: 'Big Ten Conference Game',
    url: 'https://mgoblue.com/sports/mens-ice-hockey/schedule'
  },
  {
    title: 'Michigan @ Minnesota',
    start: '2024-12-22T18:00:00',
    location: '3M Arena at Mariucci',
    description: 'Big Ten Conference Game',
    url: 'https://mgoblue.com/sports/mens-ice-hockey/schedule'
  }
];

// Save Note Functionality
document.querySelector('#save-note').addEventListener('click', () => {
  const noteInput = document.querySelector('#note-input').value;
  if (noteInput) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(noteInput);
    localStorage.setItem('notes', JSON.stringify(notes));
    document.querySelector('#note-input').value = ''; // Clear input
    displayNotes();
  }
});

// Display Saved Notes
function displayNotes() {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  const notesList = document.querySelector('#notes-list');
  notesList.innerHTML = '';

  notes.forEach((note, index) => {
    // Create a container for each note
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note-item', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-2');

    // Note text
    const noteText = document.createElement('span');
    noteText.textContent = `${index + 1}. ${note}`;
    noteDiv.appendChild(noteText);

    // Edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('btn', 'btn-sm', 'btn-primary', 'ms-2');
    editButton.addEventListener('click', () => editNote(index)); // Attach edit function
    noteDiv.appendChild(editButton);

    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-sm', 'btn-danger', 'ms-2');
    deleteButton.addEventListener('click', () => deleteNote(index)); // Attach delete function
    noteDiv.appendChild(deleteButton);

    // Append the note container to the list
    notesList.appendChild(noteDiv);
  });
}

// Edit a Note
function editNote(index) {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  const noteToEdit = notes[index];

  // Populate the input field with the selected note
  document.querySelector('#note-input').value = noteToEdit;

  // Remove the note and re-render the list after editing
  notes.splice(index, 1); // Remove the note temporarily
  localStorage.setItem('notes', JSON.stringify(notes));
  displayNotes();
}

// Delete a Note
function deleteNote(index) {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.splice(index, 1); // Remove the note at the specified index
  localStorage.setItem('notes', JSON.stringify(notes)); // Update localStorage
  displayNotes(); // Refresh the list
}

// Display Hockey Games as a List
function displayEvents() {
  const eventsList = document.querySelector('#events-list');
  eventsList.innerHTML = '';

  hockeySchedule.forEach((game) => {
    const eventItem = document.createElement('div');
    eventItem.classList.add('event-item');
    eventItem.innerHTML = `
      <h4>${game.title}</h4>
      <p>Date: ${new Date(game.start).toLocaleString()}</p>
      <p>Location: ${game.location}</p>
      <p>Description: ${game.description}</p>
      <a href="${game.url}" target="_blank">More Info</a>
    `;
    eventsList.appendChild(eventItem);
  });
}

// Initialize FullCalendar
document.addEventListener('DOMContentLoaded', () => {
  displayNotes(); // Load saved notes
  displayEvents(); // Display hockey games as a list

  const calendarEl = document.querySelector('#calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: hockeySchedule, // Load hockey schedule in the calendar
    eventClick: function (info) {
      info.jsEvent.preventDefault();
      if (info.event.extendedProps.url) {
        window.open(info.event.extendedProps.url, '_blank'); // Open game details in a new tab
      }
    },
    eventDidMount: function (info) {
      // Optional: Add tooltip for games
      info.el.title = `${info.event.title} - ${info.event.extendedProps.location}`;
    }
  });

  calendar.render(); // Render the calendar
});
