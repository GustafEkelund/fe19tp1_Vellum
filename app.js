let noteList = [];
const savebtn = document.querySelector(".fa-plus");
const noteContent = document.querySelector('#noteContent');
const input = document.querySelector('#search');
const saveToFav = document.querySelector('#saveFav');
const favIcon = document.querySelector(".fa-heart");
const print = document.querySelector("#print")
const openSideBar = document.querySelector('.fa-folder');
const openSideBarLogo = document.querySelector('.logo');
const closeBtn = document.querySelector('.closebtn');
const darkMode = document.querySelector('.fa-moon');
const changeEditor = document.querySelector('#editor');
let selectedNote;
let clicks = 1;

/* Sidebar toggle */
const SecondSideBarToggle = () => {
  const secondSideBarContainer = document.querySelector('.secondSideBarContainer');
  // Toggle Nav
  openSideBar.addEventListener('click', () => {
    secondSideBarContainer.classList.toggle('secondSideBarContainer-active');
  });
}; SecondSideBarToggle();


/* closeBtn.addEventListener('click', () => {
  
}) */


/* Editor */

var Delta = Quill.import('delta');
var options = {
  modules: {
    toolbar:
      [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold'],
        ['italic'],
        ['underline'],
        ['link'],
        ['image'],
        [{ 'list': 'ordered' }],
        [{ 'list': 'bullet' }],
        [{ 'align': [] }],
      ]
    // ['print'],


  },
  placeholder: 'Write something fun...',
  theme: 'snow'
};

var icons = Quill.import('ui/icons');

var editor = new Quill('#quillEditor', options);

editor.on('text-change', function (delta) {
  if (!selectedNote) {
    selectedNote = saveDocs();
  }

  let contents = editor.getContents();
  let save = JSON.stringify(contents, null, 2);

  if (delta) {
    save = JSON.stringify(delta, null, 2) + "\n\n" + save;
    selectedNote.contents = contents;
    selectedNote.title = editor.getText(0, 10);

    if (noteList.filter(note => note.id == selectedNote.id).length < 1) {
      noteList.unshift(selectedNote);
      createDiv(selectedNote);
      saveNotes()
    } else {
      if (selectedNote.deleted === false) {
        selectedNote.contents = contents;
        selectedNote.title = editor.getText(0, 10);
        saveNotes();
        updateDiv(selectedNote);
      }
    }
  }
});

//Click event för divarna
noteContent.addEventListener('click', e => {
  let noteID = e.target.closest("div").id;
  selectedNote = noteList.find(note => note.id === Number(noteID));

  if (e.target.classList.contains("delete")) { del(e) }


  if (e.target.classList.contains('far')) { selectFavo(e) }
  else { pickDoc(e) } //clicked div
})


input.addEventListener('keyup', e => {
  search();
  input.addEventListener('click', e => {
    noteContent.childNodes.forEach(e => { e.style.display = "block" })
  })
})


favIcon.addEventListener('click', e => {
  let arrayOfDivs = Array.from(noteContent.childNodes);

  clicks += 1;

  arrayOfDivs.forEach(div => {
    let noteID = div.id;
    selectedNote = noteList.find(note => note.id === Number(noteID));
    if (clicks % 2 === 0) {
      if (selectedNote.favourite) {
        div.style.display = "block";
      } else { div.style.display = "none" }
    } else { div.style.display = "block" }

  })
})

//Save button
savebtn.addEventListener('click', () => {
  Array.from(noteContent.childNodes).map(div => { div.classList.remove('picked') })
  if (selectedNote) {
    selectedNote = !selectedNote;
  }
  clearEditor();
});

//Auto saving
function saveDocs() {
  return {
    id: Date.now(),
    favourite: false,
    contents: "notes",
    title: "title",
    deleted: false
  };
} saveDocs();

function del(e) {
  selectedNote.deleted = true;
  e.target.closest('div').remove();
  saveNotes();
  clearEditor();

}


// Creats a new div containing info about Docs
function createDiv(note) {
  let newDiv = document.createElement("div");
  newDiv.id = note.id;
  newDiv.classList.add('div');
  if (selectedNote && selectedNote.id == note.id) {
    newDiv.classList.add("picked")
  }

  let newDivList = {
    title: `<strong>${note.title}</strong>`,
    date: `<span>${Date(note.id)}</span>`,
    icon: `<span class='far fa-heart ${note.favourite ? 'fas fa-heart' : ''}'></span>`,
    trash: `<span class='far fa-trash-alt delete'></span>`
  };
  newDiv.innerHTML = ` ${newDivList.title} ${newDivList.trash} ${newDivList.icon} <br> ${newDivList.date};`
  noteContent.appendChild(newDiv);
}

function updateDiv(note) {

  let oldDiv = document.getElementById(note.id);
  let newDiv = document.createElement("div");
  newDiv.id = note.id;
  newDiv.classList.add('div');
  if (Array.from(noteContent.childNodes).find(note => note.id == selectedNote.id)) {
    newDiv.classList.add('picked')
  }
  let newDivList = {
    title: `<strong>${note.title}</strong>`,
    date: `<span>${Date(note.id)}</span>`,
    icon: `<span class='far fa-heart ${note.favourite ? 'fas fa-heart' : ''}'></span>`,
    trash: `<span class='far fa-trash-alt delete'></span>`
  };
  newDiv.innerHTML = ` ${newDivList.title} ${newDivList.trash} ${newDivList.icon} <br> ${newDivList.date};`
  noteContent.replaceChild(newDiv, oldDiv)
}

// Load localstorage när sidan laddar
window.addEventListener('load', (event) => {
  let quire = JSON.parse(localStorage.getItem('quire'));
  if (quire) {
    modal.style.display = "none";
  } else {
    modal.style.display = "block";
  }
  loadNotes();
});

//Laddar info från local storage
function loadNotes() {
  if (localStorage.getItem('quire')) {
    noteList = JSON.parse(localStorage.getItem('quire')).notes
    //editor.setContents(noteList[0].contents);
    renderDocs();
  } else {
    noteList = [];
  }
}

//Rensar editorn
function clearEditor() {
  editor.setContents([
    { insert: '\n' }
  ]);
}

//Sparar dokumentet till local storage
function saveNotes() {
  localStorage.setItem('quire', JSON.stringify({ showSplash: true, notes: noteList }))
}


//Renderar dokumentet samt div när sidan laddas om
function renderDocs() {
  noteList.forEach(note => {
    if (note.deleted === false) {
      createDiv(note)
    }
  })
}

function pickDoc(e) {
  const loadData = JSON.parse(localStorage.getItem('quire')).notes;
  const newDiv = document.querySelectorAll('#noteContent > div');
  for (let i = 0; i < loadData.length; i++) {
    if (loadData[i].id == e.target.closest('div').id) {
      editor.setContents(loadData[i].contents);
      newDiv.forEach(event => {
        if (e.target.closest('div') == event) {
          event.classList.add('picked');
        } else { event.classList.remove('picked'); }
      })
    }
  }
}

function search() {
  let input = document.querySelector('#search');
  let filter = input.value.toUpperCase();
  for (let i = 0; i < noteContent.childNodes.length; i++) {
    textValue = noteContent.childNodes[i].childNodes[1].textContent || noteContent.childNodes[i].childNodes[1].innerText;
    if (textValue.toUpperCase().indexOf(filter) > -1) {
      noteContent.childNodes[i].style.display = "";
    } else {
      noteContent.childNodes[i].style.display = 'none';
    }
  }
}

function selectFavo(e) {
  selectedNote.favourite = !selectedNote.favourite
  saveNotes();
  e.target.classList.toggle('fas');
}

function displayChecked() {
  let checkboxes = document.querySelectorAll('.fav > #noteContent > div > input');
  let arrayOfCheckboxes = Array.from(checkboxes);
  arrayOfCheckboxes.map(e => {
    if (e.checked) { e.parentElement.style.display = 'block' }
    else { e.parentElement.style.display = 'none' }
  })
}

function printDiv() {
  var divContents = document.querySelector(".ql-editor").innerHTML;
  var a = window.open('', '', 'height=1200, width=1200');
  a.document.write('<html>');
  a.document.write('<body > ');
  a.document.write(divContents);
  a.document.write('</body></html>');
  a.document.close();
  a.print();
}





/* Popup */

// Get the modal
var modal = document.getElementById("myModal");
// Get the button that opens the modal
var btn = document.getElementById("myBtn");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
window.onload = function () {
  //modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}






print.addEventListener('click', () => {
  printDiv();
})





