/**
 * Array containing Michigan Hockey Schedule as dummy data.
 * Each object represents a game with title, start time, location, description, and URL.
 */
const hockeySchedule = [
  {
    title: 'Michigan vs. Ohio State',
    start: '2024-12-08T19:00:00',
    location: 'Yost Ice Arena',
    description: 'Big Ten Conference Game',
    url: 'https://mgoblue.com/sports/mens-ice-hockey/schedule',
  },
  {
    title: 'Michigan vs. Wisconsin',
    start: '2024-12-15T19:00:00',
    location: 'Yost Ice Arena',
    description: 'Big Ten Conference Game',
    url: 'https://mgoblue.com/sports/mens-ice-hockey/schedule',
  },
  {
    title: 'Michigan @ Minnesota',
    start: '2024-12-22T18:00:00',
    location: '3M Arena at Mariucci',
    description: 'Big Ten Conference Game',
    url: 'https://mgoblue.com/sports/mens-ice-hockey/schedule',
  },
];

/**
 * Saves a new note entered by the user to localStorage.
 * Notes are stored in an array, which is serialized to JSON format.
 */
document.querySelector('#save-note').addEventListener('click', () => {
  const noteInput = document.querySelector('#note-input').value;
  if (noteInput) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(noteInput);
    localStorage.setItem('notes', JSON.stringify(notes)); // Save updated notes
    document.querySelector('#note-input').value = ''; // Clear the input field
    displayNotes(); // Refresh displayed notes
  }
});

/**
 * Displays all saved notes from localStorage on the page.
 * Each note is displayed with options to edit or delete it.
 */
function displayNotes() {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  const notesList = document.querySelector('#notes-list');
  notesList.innerHTML = ''; // Clear previous notes

  notes.forEach((note, index) => {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note-item', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-2');

    // Display the note text
    const noteText = document.createElement('span');
    noteText.textContent = `${index + 1}. ${note}`;
    noteDiv.appendChild(noteText);

    // Add buttons to edit and delete the note
    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('btn-group');

    // Create the Edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('btn', 'btn-sm', 'btn-primary');
    editButton.addEventListener('click', () => editNote(index)); // Attach edit handler
    buttonGroup.appendChild(editButton);

    // Create the Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-sm', 'btn-danger');
    deleteButton.addEventListener('click', () => deleteNote(index)); // Attach delete handler
    buttonGroup.appendChild(deleteButton);

    noteDiv.appendChild(buttonGroup);
    notesList.appendChild(noteDiv);
  });
}

/**
 * Edits a specific note by index.
 * Loads the note into the input field for modification and removes it from the saved list.
 * @param {number} index - The index of the note to edit.
 */
function editNote(index) {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  const noteToEdit = notes[index];
  document.querySelector('#note-input').value = noteToEdit; // Load note into input field
  notes.splice(index, 1); // Remove the note
  localStorage.setItem('notes', JSON.stringify(notes)); // Update localStorage
  displayNotes(); // Refresh displayed notes
}

/**
 * Deletes a specific note by index.
 * Removes the note from localStorage and refreshes the displayed notes.
 * @param {number} index - The index of the note to delete.
 */
function deleteNote(index) {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.splice(index, 1); // Remove the note
  localStorage.setItem('notes', JSON.stringify(notes)); // Update localStorage
  displayNotes(); // Refresh displayed notes
}

/**
 * Displays the Michigan Hockey schedule as a list.
 * Each game includes a title, date, location, description, and buttons for "Save as Note" and "More Info".
 */
function displayEvents() {
  const eventsList = document.querySelector('#events-list');
  eventsList.innerHTML = ''; // Clear previous events

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
    moreInfoButton.target = '_blank'; // Open link in a new tab
    moreInfoButton.classList.add('btn', 'btn-sm', 'btn-primary');
    eventItem.appendChild(moreInfoButton);

    eventsList.appendChild(eventItem);
  });
}

/**
 * Saves a hockey game as a note.
 * Combines game details (title, date, location, and description) into a single note.
 * @param {Object} game - The hockey game object to save.
 */
function saveGameAsNote(game) {
  const note = `Game: ${game.title}, Date: ${new Date(game.start).toLocaleString()}, Location: ${game.location}, Description: ${game.description}`;
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.push(note); // Add the game note
  localStorage.setItem('notes', JSON.stringify(notes)); // Save to localStorage
  displayNotes(); // Refresh displayed notes
}

/**
 * Initializes the FullCalendar component and loads the hockey schedule.
 * Also initializes the list of notes and hockey games on page load.
 */
document.addEventListener('DOMContentLoaded', () => {
  displayNotes(); // Load saved notes
  displayEvents(); // Display hockey games as a list

  const calendarEl = document.querySelector('#calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: hockeySchedule, // Load hockey schedule into calendar
    eventClick: function (info) {
      info.jsEvent.preventDefault();
      if (info.event.extendedProps.url) {
        window.open(info.event.extendedProps.url, '_blank'); // Open game link in a new tab
      }
    },
    eventDidMount: function (info) {
      info.el.title = `${info.event.title} - ${info.event.extendedProps.location}`;
    },
  });

  calendar.render(); // Render the calendar
});
