let noteList = [];
const newDoc = document.querySelector(".fa-plus");
const noteContent = document.querySelector('#noteContent');
const input = document.querySelector('.search');
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
  },
  placeholder: 'Write something fun...',
  scrollingContainer: '#mainEditorContainer',
  theme: 'snow'
};

var icons = Quill.import('ui/icons');

var editor = new Quill('#quillEditor', options);

editor.on('text-change', function (delta) {
  if (!selectedNote) {
    selectedNote = newNote();
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

//Keyup event för search
input.addEventListener('keyup', e => {
  search();
  input.addEventListener('click', e => {
    noteContent.childNodes.forEach(e => { e.style.display = "block" })
  })
})

//Favoritikonens toggle effekt 
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

//nytt dokumentknapp (+)
newDoc.addEventListener('click', () => {
  Array.from(noteContent.childNodes).map(div => { div.classList.remove('picked') })
  if (selectedNote) {
    selectedNote = !selectedNote;
  }
  clearEditor();
});

//skapar en ny note med "keys" som innehåller id, editor content mm. 
function newNote() {
  return {
    id: Date.now(),
    favourite: false,
    contents: "notes",
    title: "title",
    deleted: false
  };
}


// Tar bort noten   
function del(e) {
  selectedNote.deleted = true;
  e.target.closest('div').remove();
  saveNotes();
  clearEditor();
  selectedNote = !selectedNote
}


// skapar en div i second sidebar med info om noten
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

//updaterar en div. tarbort gamla oh byter ut den till en ny.
function updateDiv(note) {

  let oldDiv = document.getElementById(note.id);
  let newDiv = document.createElement("div");
  newDiv.id = note.id;
  newDiv.classList.add('div');
  if (selectedNote && selectedNote.id == note.id) {
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

//laddar data från localstorage och läggertillbaka data i editorn när en av note-divarna klickas. Sätter en ny class på noten som klickats. 
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
//Söker igenom divarna i second sidebar. Söker inbart i rubrikerna.
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

//Sätt en note till favorit eller ta bort som favorit.
function selectFavo(e) {
  selectedNote.favourite = !selectedNote.favourite
  saveNotes();
  e.target.classList.toggle('fas');
}


//Print-funktion 
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

function myFunction() {
  var element = document.body;
  var secondSideBar = document.querySelector('.secondSideBar');
  var secondSideBarContainer = document.querySelector('.secondSideBarContainer');
  var darkEditor = document.querySelector(".ql-editor");

  darkEditor.classList.toggle("dark-mode-editor");
  element.classList.toggle("dark-mode");
  secondSideBar.classList.toggle("dark-mode-secondSidebar");
  secondSideBarContainer.classList.toggle("dark-mode-secondSidebar");
  input.classList.toggle("dark-mode-secondSidebar");
  noteContent.classList.toggle("dark-mode-secondSidebar");
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

