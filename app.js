let noteList = [];
const savebtn = document.querySelector("#sideBar > i.fas.fa-plus")
const justText = document.querySelector('#justText');
const input = document.querySelector('#search');
const fav = document.querySelector("#sideBar > i.far.fa-heart");
const saveToFav = document.querySelector('#saveFav');

// Sidabar
function openNav() {
  document.getElementById("secondSideBar").style.width = "300px";
  document.getElementById("editor").style.width = "70%";
  document.getElementById("editor").style.marginLeft = "420px";
}
function closeNav() {
  document.getElementById("secondSideBar").style.width = "0";
  document.getElementById("editor").style.width = "90%";
  document.getElementById("editor").style.marginLeft = "130px";
}
/* Editor */

var Delta = Quill.import('delta');
var options = {
  modules: {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline'],
      ['link', 'image'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
    ]
  },
  placeholder: 'Write something fun...',
  theme: 'snow'
};

var editor = new Quill('#quillEditor', options);

//Save button
savebtn.addEventListener('click', () => {

  let note = {
    id: Date.now(),
    title: editor.getText(0, 10),
    contents: editor.getContents(),
    favourite: false,
    started: true
  };

  let newDiv = document.createElement("div");
  newDiv.id = note.id;
  justText.insertBefore(newDiv, justText.childNodes[0]);
  newDiv.classList.add('div');
  let newDivList = {
    title: `<strong>Title:</strong> ${note.title}....`,
    date: `<strong>Datum:</strong>${Date(note.id)}`,
    icon: `<span class="far fa-heart"></span>`
  };
  newDiv.innerHTML = `${newDivList.icon} <br> ${newDivList.title} <br> ${newDivList.date}`;

  noteList.unshift(note);
  saveNotes();
  clearEditor();

});

// Load localstorage när sidan laddar
window.addEventListener('DOMContentLoaded', (event) => {
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
    editor.setContents(noteList[0].contents);
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
  noteList.forEach(e => {
    let newDiv = document.createElement("div");
    newDiv.id = e.id;
    justText.appendChild(newDiv);
    newDiv.classList.add('div');
    let newDivList = {
      title: `<strong>Title:</strong><span class = 'span'> ${e.title}....</span>`,
      date: `<strong>Datum:</strong>${Date(e.id)}`,
      icon: `<span class="far fa-heart"></span>`
    };
    newDiv.innerHTML = `${newDivList.icon} ${newDivList.title} <br> ${newDivList.date}`;
  });
}

//Click event för divarna
justText.addEventListener('click', e => {
  const newDiv = document.querySelectorAll('#justText > div');
  const loadData = JSON.parse(localStorage.getItem('quire')).notes;
  for (let i = 0; i < loadData.length; i++) {
    if (loadData[i].id == e.target.id) {
      editor.setContents(loadData[i].contents);
      newDiv.forEach(event => {
        if (e.target == event) {
          event.classList.add('picked');
        } else { event.classList.remove('picked') }
      })

    }
  }
})

function search() {
  let input = document.querySelector('#search');
  let filter = input.value.toUpperCase();
  for (let i = 0; i < justText.childNodes.length; i++) {
    textValue = justText.childNodes[i].childNodes[1].textContent || justText.childNodes[i].childNodes[1].innerText;
    if (textValue.toUpperCase().indexOf(filter) > -1) {
      justText.childNodes[i].style.display = "";
    } else {
      justText.childNodes[i].style.display = 'none';
    }
  }
}

input.addEventListener('keyup', e => {
  search();
  input.addEventListener('click', e => {
    justText.childNodes.forEach(e => { e.style.display = "block" })
  })
})

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

/* saveToFav.addEventListener('click', e => {
  console.log(e.target);
  e.preventDefault();
  for (let i = 0; i < justText.childNodes.length; i++) {
    if (justText.childNodes[i].classList.contains('picked')) {
      for (let j = 0; j < noteList.length; j++) {
        if (justText.childNodes[i].id == noteList[j].id) {
          noteList[j].favourite = true;
        }
      }
    }
  }
})
 */
/* fav.addEventListener('click', e => {
  openNav();
  for (let i = 0; i < noteList.length; i++) {
    if (!noteList[i].favourite) {
      console.log(noteList[i])
      for (j = 0; j < justText.childNodes.length; j++) {
        if (noteList[i].id = justText.childNodes[j].id) {
          justText.childNodes[j].style.display = 'none';
        } else {justText.childNodes[j].style.display = 'block'}
      }

    }

  }
}) */

const favIcon = document.querySelectorAll('.secondSideBar div span');