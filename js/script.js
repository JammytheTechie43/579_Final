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
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note-item', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-2');

    // Note text
    const noteText = document.createElement('span');
    noteText.textContent = `${index + 1}. ${note}`;
    noteDiv.appendChild(noteText);

    // Button group container
    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('btn-group');

    // Edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('btn', 'btn-sm', 'btn-primary');
    editButton.addEventListener('click', () => editNote(index));
    buttonGroup.appendChild(editButton);

    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-sm', 'btn-danger');
    deleteButton.addEventListener('click', () => deleteNote(index));
    buttonGroup.appendChild(deleteButton);

    noteDiv.appendChild(buttonGroup);
    notesList.appendChild(noteDiv);
  });
}

// Edit a Note
function editNote(index) {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  const noteToEdit = notes[index];
  document.querySelector('#note-input').value = noteToEdit;
  notes.splice(index, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  displayNotes();
}

// Delete a Note
function deleteNote(index) {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.splice(index, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  displayNotes();
}

// Display Hockey Games as a List
function displayEvents() {
  const eventsList = document.querySelector('#events-list');
  eventsList.innerHTML = '';

  hockeySchedule.forEach((game) => {
    const eventItem = document.createElement('div');
    eventItem.classList.add('event-item', 'mb-3');
    eventItem.innerHTML = `
      <h4>${game.title}</h4>
      <p>Date: ${new Date(game.start).toLocaleString()}</p>
      <p>Location: ${game.location}</p>
      <p>Description: ${game.description}</p>
    `;

    // Add "Save as Note" button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save as Note';
    saveButton.classList.add('btn', 'btn-sm', 'btn-success', 'me-2');
    saveButton.addEventListener('click', () => saveGameAsNote(game));
    eventItem.appendChild(saveButton);

    // Add "More Info" button
    const moreInfoButton = document.createElement('a');
    moreInfoButton.textContent = 'More Info';
    moreInfoButton.href = game.url;
    moreInfoButton.target = '_blank';
    moreInfoButton.classList.add('btn', 'btn-sm', 'btn-primary');
    eventItem.appendChild(moreInfoButton);

    eventsList.appendChild(eventItem);
  });
}



// Save a Game as a Note
function saveGameAsNote(game) {
  const note = `Game: ${game.title}, Date: ${new Date(game.start).toLocaleString()}, Location: ${game.location}, Description: ${game.description}`;
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.push(note);
  localStorage.setItem('notes', JSON.stringify(notes));
  displayNotes();
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
      info.el.title = `${info.event.title} - ${info.event.extendedProps.location}`;
    }
  });

  calendar.render(); // Render the calendar
});
