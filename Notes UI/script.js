const saveButton = document.querySelector("#btnSave")
const deleteButton = document.querySelector("#btnDelete")
const titleInput = document.querySelector('#title')
const descriptionInput = document.querySelector('#description')
const notesContainer = document.querySelector('#notes__container')
const notesAlert = document.querySelector('#alertBox')
let x = null

function clearForm() {
  titleInput.value = ''
  descriptionInput.value = ''
  deleteButton.classList.add('hidden')
  notesAlert.classList.add('hidden')
  deleteButton.setAttribute('data-id', '')
  saveButton.setAttribute('data-id', '')
}

function displayNoteInForm(note) {
  titleInput.value = note.title
  descriptionInput.value = note.description
  deleteButton.classList.remove('hidden')
  deleteButton.setAttribute('data-id', note.id)
  saveButton.setAttribute('data-id', note.id)
}

function getNoteById(id) {
  fetch(`https://localhost:7124/api/notes/${id}`)
  .then(data => data.json())
  .then(response => displayNoteInForm(response))
}

function populateForm(id) {
  getNoteById(id)
}

function addNote(title, description) {
  if(title.length == 0 || description.length == 0){
    changeNotesAlert('warning', 'Preencha todos os campos!')
    titleInput.focus()
    return
  }

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
    notesAlert.classList.remove('hidden')
    changeNotesAlert('success', 'Nota criada com sucesso!')
  })
}

function displayNotes(notes) {
  let allNotes = ''

  notes.forEach(note => {
    const noteElement = `
                          <div class="note" data-id="${note.id}">
                            <h3>${note.title}</h3>
                            <p>${note.description}</p>
                          </div>
                        `
    allNotes += noteElement
  });

  notesContainer.innerHTML = allNotes

  // add event listeners
  document.querySelectorAll('.note').forEach(note => {
    note.addEventListener('click', function(){
      if(x !== null){
        x.style.border = `none`
      }
      x = note
      note.style.border = `3px solid #e74c3c`
      note.style.borderRadius = `5px`
      populateForm(note.dataset.id)
    })
  })
}

function getAllNotes() {
  fetch('https://localhost:7124/api/notes')
  .then(data => data.json())
  .then(response => displayNotes(response))
}

function changeNotesAlert(color, text) {
  notesAlert.classList.remove('hidden')
  notesAlert.className = ''
  notesAlert.classList.add('alert-box', color)
  notesAlert.textContent = text

  setTimeout(function () {
    notesAlert.classList.add('hidden');
}, 2000);
}

getAllNotes()

function updateNote(id, title, description) {
  const body = {
    title: title,
    description: description,
    isVisible: true
  }

  fetch(`https://localhost:7124/api/notes/${id}`, {
    method: 'PUT',
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

saveButton.addEventListener('click', function(){
  const id = saveButton.dataset.id

  if (id) {
    updateNote(id, titleInput.value, descriptionInput.value)
  } else {
    addNote(titleInput.value, descriptionInput.value)
  }

})

function deleteNote(id) {
  fetch(`https://localhost:7124/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      "content-type": "application/json"
    }
  })
  .then(response => {
    clearForm()
    getAllNotes()
    changeNotesAlert('danger', 'Nota excluida com sucesso!')
  })
}

deleteButton.addEventListener('click', function(){
  const id = deleteButton.dataset.id
  deleteNote(id)
})