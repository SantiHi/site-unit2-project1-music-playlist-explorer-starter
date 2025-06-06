// JavaScript for Opening and Closing the Modal
const modal = document.getElementById("Modal");
const editModal = document.getElementById("editor");
const span = document.getElementsByClassName("close")[0];
const allTab = document.getElementsByClassName("navigation")[0];
const featTab = document.getElementsByClassName("navigation")[1];
const searchButton = document.getElementById("search-button");
const clearButton = document.getElementById("clear-button");
const sort = document.getElementById("sorting");

// Get playlists container
const playlistList = document.querySelector(".playlist-container");
const modalContent = document.querySelector(".modal-content");

featTab.addEventListener("click", () => {
  window.location.href = "featured.html";
});

if (sort) {
  document.getElementById("sorting").addEventListener("change", function () {
    const selectedValue = this.value;
    console.log(selectedValue);
    handleSort(selectedValue);
  });
}

if (searchButton) {
  searchButton.addEventListener("click", (event) => {
    event.preventDefault();
    handleSearch();
  });
}

if (clearButton) {
  clearButton.addEventListener("click", (event) => {
    event.preventDefault();
    handleClear();
  });
}

function handleClear() {
  const searchQuery = document.querySelector("#search-form");
  searchQuery.reset();
  const B = document.querySelectorAll(".playlist-card");
  Array.from(B).forEach((playlist) => {
    playlist.style.display = "block";
  });
}

allTab.addEventListener("click", () => {
  window.location.href = "index.html";
});

function handleSearch() {
  const searchText = document.querySelector("#search-text");
  const searchString = searchText.value.toLowerCase();
  const B = document.querySelectorAll(".playlist-card");
  Array.from(B).forEach((playlist) => {
    const title = playlist.querySelector("h4").innerText.toLowerCase();
    const author = playlist.querySelector("p").innerText.toLowerCase();
    if (author.includes(searchString) || title.includes(searchString)) return;
    playlist.style.display = "none";
  });
}

function openModal(playlist) {
  modal.style.display = "block";
}
if (span) {
  span.onclick = function () {
    modal.style.display = "none";
  };
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (event.target == editModal) {
    editModal.style.display = "none";
  }
};

// still need to add picture functionality, for now just focus on title, etc
const createPlaylistElement = (playlistObj) => {
  const playlistElement = document.createElement("section");
  playlistElement.className = "playlist-card";
  playlistElement.id = `${playlistObj.date_added}`;
  playlistElement.innerHTML = `
        <img
            src="${playlistObj.playlist_art}" 
            alt="Playlist Icon"
            class="playlist-image"
          />
          <h4>${playlistObj.playlist_name}</h4>
          <p>${playlistObj.playlist_author}</p>
          <div class="likes">
            <p id = "edit">&#9998</p>
            <p id = "trash">🗑️</p>
            <img
              src="assets/img/love-transparent-heart-png-hd-3.png"
              class="heart-image"
            />
            <p id="name">${playlistObj.likes}</p>
          </div>`;

  const heartElement = playlistElement.querySelector(".heart-image");
  const numLikes = playlistElement.querySelector("#name");
  const deleteButton = playlistElement.querySelector("#trash");
  const editButton = playlistElement.querySelector("#edit");

  heartElement.addEventListener("click", (event) => {
    event.stopPropagation();
    if (playlistObj.heartColor === "gray") {
      heartElement.style.filter = "drop-shadow(2px 2px 2px #000000)";
      playlistObj.heartColor = "red";
      numLikes.innerHTML = Number(numLikes.innerHTML) + 1 + "";
      numLikes.style.color = "red";
    } else {
      playlistObj.heartColor = "gray";
      heartElement.style.filter = "grayscale()";
      numLikes.innerHTML = Number(numLikes.innerHTML) - 1 + "";
      numLikes.style.color = "white";
    }
    if (handleSort(document.getElementById("sorting").value) === "likes") {
      handleSort("likes");
    }
  });

  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    playlistElement.parentNode.removeChild(playlistElement);
  });
  playlistElement.addEventListener("click", () => {
    populateModal(playlistObj);
  });
  editButton.addEventListener("click", (event) => {
    event.stopPropagation();
    document.querySelector("#editor").style.display = "block";
    populateEdit(playlistObj);
  });

  return playlistElement;
};

const populateEdit = (playlistObj) => {
  console.log(playlistObj);

  const editContainer = document.querySelector(".edit-container");
  const editForm = document.createElement("form");
  editForm.id = "editor-form";
  console.log(editContainer);
  // generate correctly formatted song string.
  let initString = "";

  playlistObj.songs.forEach((song, index) => {
    const string =
      song.title +
      ":" +
      song.artist +
      "," +
      song.album +
      "," +
      song.duration +
      ";";
    initString = initString + string;
  });
  console.log(initString);
  editForm.innerHTML = `
    <h2>Edit Current Playlist:</h2>
              <label for="new-name">Playlist Title: </label>
              <input type="text" id="new-name" name="book-title" value = ${playlistObj.playlist_name} required />
              <label for="author"> Author of Playlist: </label>
              <input type="text" id="author" name="book-title" value = ${playlistObj.playlist_author}required />
              <label for="image"> Image URL </label>
              <input type="text" id="image" name="url" value = ${playlistObj.playlist_art} required />
              <label for="new-songs" id = "songlist" 
                >Songs (form songname: artist, album, duration; song2:..)</label
              >
              <textarea id="new-songs" name="review-text" required> ${initString}</textarea>
              <button type="submit">Save Changes</button>
  `;
  console.log(editForm);
  editContainer.appendChild(editForm);
  console.log(editContainer);
};

const populateModal = (playlistObj) => {
  const init = document.createElement("span");
  init.className = "close";
  init.innerHTML = "&times;";
  init.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modalContent.innerHTML = "";
  makeHeader = modalHeader(playlistObj);
  makeBody = modalBody(playlistObj);
  modalContent.appendChild(init);
  modalContent.appendChild(makeHeader);
  modalContent.appendChild(makeBody);
  modal.style.display = "block";
};

const modalHeader = (playlistObj) => {
  const modalHeader = document.createElement("section");
  modalHeader.id = "playlist-header";
  modalHeader.innerHTML = `
            <img
              src="${playlistObj.playlist_art}"
              alt="Playlist Icon"
              class="playlist-image"
            />
            <article id = "popup">
              <h3> ${playlistObj.playlist_name}</h3>
              <h5> ${playlistObj.playlist_author}</h5>
            </article>
            <button> shuffle </button> 
    `;
  const actionButton = modalHeader.querySelector("button");
  actionButton.addEventListener("click", () => {
    const playListBody = document.querySelector("#playlist-body");
    playListBody.innerHTML = "";
    playlistObj.songs = shuffleArray(playlistObj.songs);
    playListBody.innerHTML = "";
    playListBody.append(modalBody(playlistObj));
  });
  return modalHeader;
};

const shuffleArray = (array) => {
  let currentIndex = array.length;
  for (let i = array.length - 1; i >= 0; i--) {
    let randInd = Math.floor(Math.random() * (i + 1));
    let songAtI = array[i];
    let songAtRand = array[randInd];
    array[i] = songAtRand;
    array[randInd] = songAtI;
  }
  return array;
};

const modalBody = (playlistObj) => {
  let modalBody = document.createElement("section");
  modalBody.id = "playlist-body";

  for (let song of playlistObj.songs) {
    const songObj = document.createElement("article");
    songObj.className = "song";
    songObj.innerHTML = ` 
        <img src= "assets/img/song.png" 
                    class = "song-image"/>
                    <div id = "song-desc">
                    <h6>${song.title}</h6>
                    <h7>${song.artist}</h7>
                    <h8>${song.album}</h8>
                    </div> 
                    <div id= "song-duration"> 
                        <h5 id = "duration-song">${song.duration}</h5>
                    </div> 
    `;
    modalBody.appendChild(songObj);
  }
  return modalBody;
};

const featuredPlaylistTab = (feature) => {
  const container = document.querySelector(".feature-container");
  container.innerHTML = `
      <div id="feature-image">
          <img class="image-feature" src="${feature.playlist_art}" />
          <h3 id="feature-text">${feature.playlist_name}</h3>
        </div>
    `;

  let sect = document.createElement("section");
  sect.id = "feature-body";

  for (let song of feature.songs) {
    const songObj = document.createElement("article");
    songObj.className = "song";
    songObj.innerHTML = ` 
        <img src= "assets/img/song.png" 
                    class = "song-image"/>
                    <div id = "song-desc">
                    <h6>${song.title}</h6>
                    <h7>${song.artist}</h7>
                    <h8>${song.album}</h8>
                    </div> 
                    <div id= "song-duration"> 
                        <h5 id = "duration-song">${song.duration}</h5>
                    </div> 
    `;
    sect.appendChild(songObj);
  }
  container.append(sect);
};

const handleSort = (sortingFunc) => {
  const B = document.querySelectorAll(".playlist-card");
  array = Array.from(B);
  console.log(array);

  console.log(compareName(array[0], array[1]));

  if (sortingFunc === "title") {
    // lexographically by name of playlist
    array.sort((a, b) => compareName(a, b));
    console.log(array);
  } else if (sortingFunc === "likes") {
    // by number of likes (descending)
    array.sort((a, b) => compareLikes(a, b));
  } else {
    // sort by date
    array.sort((a, b) => compareDate(a, b));
  }
  Array.from(B).forEach((playlist) => {
    playlist.parentNode.removeChild(playlist);
  });
  array.forEach((playlist) => {
    playlistList.appendChild(playlist);
  });
};

const compareName = (playlist1, playlist2) => {
  // names lexographically
  const title1 = playlist1.querySelector("h4").innerText;
  const title2 = playlist2.querySelector("h4").innerText;
  const play1 = title1.toLowerCase();
  const play2 = title2.toLowerCase();

  console.log(play1);
  console.log(play2);
  if (play2 > play1) {
    return -1;
  } else if (play2 < play1) {
    return 1;
  } else {
    return compareLikes(playlist1, playlist2);
  }
};

const compareLikes = (playlist1, playlist2) => {
  // names lexographically
  const likes1 = Number(playlist1.querySelector("#name").innerText);
  const likes2 = Number(playlist2.querySelector("#name").innerText);
  if (likes1 >= likes2) return -1;
  return 1;
};

const compareDate = (playlist1, playlist2) => {
  let date1 = new Date(playlist1.id);
  let date2 = new Date(playlist2.id);
  if (date2 >= date1) return 1;
  return -1;
};

fetch("data/data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    console.log(window.name);
    if (window.location.pathname.includes("index")) {
      data.forEach((playlist) => {
        const el = createPlaylistElement(playlist);
        playlistList.appendChild(el);
      });
      handleSort("title");
    } else {
      const randFeature = shuffleArray(data)[0];
      console.log(randFeature);
      featuredPlaylistTab(randFeature);
    }
  })
  .catch((error) => {
    console.log("error with playlist retrieval", error);
  });

/* FORM SUBMIT NEW ALBUM: */

document.addEventListener("DOMContentLoaded", () => {
  const playlistForm = document.querySelector("playlist-form");
  addEventListener("submit", handleNewSubmit);
});

const handleNewSubmit = (event) => {
  console.log("NewPlaylist called!");
  event.preventDefault();

  const PlaylistTitle = document.querySelector("#new-name");
  const title = PlaylistTitle.value;
  const reviewRate = document.querySelector("#new-songs");
  const newSongs = reviewRate.value;
  const author = document.querySelector("#author");
  const newAuthor = author.value;
  const image = document.querySelector("#image");
  const imageURL = image.value;
  let newPlaylist = {
    playlist_name: title,
    playlist_author: newAuthor,
    playlist_art: imageURL,
    likes: 0,
    heartColor: "gray",
    songs: [],
    date_added: new Date().toISOString(),
  };

  console.log(newPlaylist);
  const songBlocks = newSongs.match(/.*?(?=;)/g);
  console.log(songBlocks);

  const regExp = /^\s*(.*?)\s*:\s*(.*?)\s*,\s*(.*?)\s*,\s*(.*?)\s*$/;

  let filteredSongs = songBlocks.filter((song) => song && song.trim() !== "");

  console.log(filteredSongs);
  newPlaylist.songs = filteredSongs.map((song) => {
    let el = song.trim().match(regExp);
    if (!el) return null;
    return {
      title: el[1].trim(),
      artist: el[2].trim(),
      album: el[3].trim(),
      duration: el[4].trim(),
    };
  });
  const final = createPlaylistElement(newPlaylist);
  playlistList.appendChild(final);
  handleSort(document.getElementById("sorting").value);
  document.querySelector("#playlist-form").reset();
};
