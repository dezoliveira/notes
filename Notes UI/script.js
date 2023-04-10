const saveButton = document.querySelector("#btnSave")
const titleInput = document.querySelector('#title')
const descriptionInput = document.querySelector('#description')
const notesContainer = document.querySelector('#notes__container')

function clearForm() {
  titleInput.value = ''
  descriptionInput.value = ''
}

function addNote(title, description) {

  const body = {
    title: title,
    description: description,
    isVisible: true
  }

  fetch('https://localhost:7124/api/notes', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json"
    }
  })
  .then(data => data.json())
  .then(response => {
    clearForm()
    getAllNotes()
  })
}

function displayNotes(notes) {
  let allNotes = ''

  notes.forEach(note => {
    const noteElement = `
                          <div class="note">
                            <h3>${note.title}</h3>
                            <p>${note.description}</p>
                          </div>
                        `
    allNotes += noteElement
  });

  notesContainer.innerHTML = allNotes
}

function getAllNotes() {
  fetch('https://localhost:7124/api/notes')
  .then(data => data.json())
  .then(response => displayNotes(response))
}

getAllNotes()

saveButton.addEventListener('click', function(){
    addNote(titleInput.value, descriptionInput.value)
  }
)