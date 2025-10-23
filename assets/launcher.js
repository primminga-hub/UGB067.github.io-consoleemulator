document.addEventListener('DOMContentLoaded', () => {
  const builtInManifest = {
  N64: [
    { name: "Super Mario 64", file: "N64/SB64.html" },
    { name: "Zelda: Majora’s Mask", file: "N64/ZELDAMAJORAS.html" },
    { name: "Mario Kart 64 Amped Up", file: "N64/KART64REMIX.html" },
    { name: "Mario Kart 64", file: "N64/MARIOKART64.html" },
    { name: "Wario Ware Inc", file: "N64/WARIOWAREINC.html" },
    { name: "Pokemon Sapphire", file: "N64/POKEMONSAPPHIRE.html" },
    { name: "Need For Speed: Underground 2", file: "N64/NEEEDFORSPEEDUG2.html" },
    { name: "Crash Bandicoot 2", file: "N64/CRASHBANDICOOT2.html" },
    { name: "Madden NFL: 2002", file: "N64/MADDENNFL2002.html" },
    { name: "Kirby 64", file: "N64/KIRBY64.html" },
    { name: "Donkey Kong 64", file: "N64/DONKEYKONG64.html" },
    { name: "Doom 64", file: "N64/DOOM64.html" },
    { name: "Star Fox 64", file: "N64/STARFOX64.html" },
    { name: "Smash Bros", file: "N64/SMASHBROS.html" }
  ],
  SegaGenesis: [
    { name: "Sonic the Hedgehog", file: "SegaGenesis/SONIC1.html" },
    { name: "Sonic the Hedgehog 2", file: "SegaGenesis/SONIC2.html" },
    { name: "Sonic the Hedgehog 3", file: "SegaGenesis/SONIC3.html" },
    { name: "Sonic the Hedgehog 3 And Knuckles", file: "SegaGenesis/SONIC3KNUCKLES.html" },
    { name: "Sonic the Hedgehog: 3D Blast", file: "SegaGenesis/SONIC3DBLAST.html" },
    { name: "Mortal Kombat 3", file: "SegaGenesis/MORTALCOMBAT3.html" },
    { name: "Streets of Rage", file: "SegaGenesis/STREETSOFRAGE.html" }
  ],
  NDS: [
    { name: "Sonic Classic Collection", file: "NDS/SONICCLASSIC.html" },
	{ name: "Sonic Colors", file: "NDS/SONICCOLORS.html" },
	{ name: "Sonic Rush", file: "NDS/SONICRUSH.html" },
	{ name: "Pokemon Platinum", file: "NDS/POKEMONPLAT.html" },
    { name: "Mario Kart DS", file: "NDS/MARIOKARTDS.html" },
	{ name: "Super Mario Bros DS", file: "NDS/SMARIOBROS.html" },
    { name: "Counter Strike DS", file: "NDS/CS.html" },
	{ name: "FIFA 11", file: "NDS/FIFA11.html" }
  ],
  PlayStation: [
    { name: "Tony Hawk: Pro Skating", file: "PlayStation/TONYHAWK.html" },
    { name: "GRAN TURISMO 2", file: "PlayStation/GRANTURIMSO2.html" },
    { name: "Silent Hill", file: "PlayStation/SilentHill.html" }
  ]
};

  const menu = document.getElementById('menu');
  const gameList = document.getElementById('game-list');
  const gamesUl = document.getElementById('games');
  const folderTitle = document.getElementById('folder-title');
  const backBtn = document.getElementById('back');
  const addFolderBtn = document.getElementById('add-folder');
  const customFoldersDiv = document.getElementById('custom-folders');
  const fileUpload = document.getElementById('file-upload');

  // Settings elements
  const settingsScreen = document.getElementById('settings');
  const openSettingsBtn = document.getElementById('open-settings');
  const closeSettingsBtn = document.getElementById('close-settings');
  const cloakTabCheckbox = document.getElementById('cloak-tab');
  const redirectKeyInput = document.getElementById('redirect-key');
  const redirectUrlInput = document.getElementById('redirect-url');
  const emergencyKeyInput = document.getElementById('emergency-key');
  const styleSelect = document.getElementById('style-select');

  let currentIndex = 0;
  let currentMode = 'console';
  let currentFolder = '';
  let currentFolderType = '';

  function highlight(index) {
    const entries = document.querySelectorAll('.console-entry');
    entries.forEach((el, i) => el.classList.toggle('selected', i === index));
  }

  function highlightGame(index) {
    [...gamesUl.children].forEach((li, i) => {
      li.classList.toggle('selected', i === index);
    });
  }

  function loadGames(folder, type) {
    const games = type === 'built-in'
      ? builtInManifest[folder] || []
      : getCustomGames(folder);

    gamesUl.innerHTML = '';
    games.forEach(game => {
      const li = document.createElement('li');
      li.textContent = game.name;
      li.dataset.href = game.file;
      li.tabIndex = 0;
      gamesUl.appendChild(li);
    });

    folderTitle.textContent = folder;
    currentFolder = folder;
    currentFolderType = type;
    currentIndex = 0;
    currentMode = 'games';
    menu.style.display = 'none';
    gameList.style.display = 'block';
    highlightGame(currentIndex);
  }

  function getCustomFolders() {
    return JSON.parse(localStorage.getItem('customFolders') || '[]');
  }

  function getCustomGames(folder) {
    const folders = getCustomFolders();
    const match = folders.find(f => f.name === folder);
    return match ? match.games : [];
  }

  function saveCustomFolders(folders) {
    localStorage.setItem('customFolders', JSON.stringify(folders));
  }

  function renderCustomFolders() {
    const saved = getCustomFolders();
    customFoldersDiv.innerHTML = '';
    saved.forEach(({ name, thumbnail }) => {
      const div = document.createElement('div');
      div.className = 'console-entry';
      div.dataset.folder = name;
      div.dataset.type = 'custom';
      div.tabIndex = 0;
      div.innerHTML = `
        <img src="${thumbnail || ''}" class="console-img" />
        <span>${name}</span>
        <button onclick="editFolder('${name}')">✎</button>
        <button onclick="uploadGame('${name}')">📤</button>
      `;
      customFoldersDiv.appendChild(div);
    });
  }

  window.editFolder = function(name) {
    const newName = prompt("Edit folder name:", name);
    const newThumb = prompt("Enter new thumbnail URL:");
    let folders = getCustomFolders();
    folders = folders.map(f => f.name === name ? { ...f, name: newName, thumbnail: newThumb } : f);
    saveCustomFolders(folders);
    renderCustomFolders();
  };

  window.uploadGame = function(folderName) {
    fileUpload.onchange = () => {
      const file = fileUpload.files[0];
      if (file) {
        const gameName = prompt("Enter game name:");
        const relativePath = `${folderName}/${file.name}`;
        let folders = getCustomFolders();
        const folder = folders.find(f => f.name === folderName);
        folder.games.push({ name: gameName, file: relativePath });
        saveCustomFolders(folders);
        renderCustomFolders();
      }
    };
    fileUpload.click();
  };

  addFolderBtn.addEventListener('click', () => {
    const folder = prompt("Enter folder name:");
    const thumbnail = prompt("Enter thumbnail URL:");
    if (folder) {
      const folders = getCustomFolders();
      folders.push({ name: folder, thumbnail, games: [] });
      saveCustomFolders(folders);
      renderCustomFolders();
    }
  });

  openSettingsBtn.addEventListener('click', () => {
    menu.style.display = 'none';
    settingsScreen.style.display = 'block';
  });

  closeSettingsBtn.addEventListener('click', () => {
    settingsScreen.style.display = 'none';
    menu.style.display = 'block';
  });

  styleSelect.addEventListener('change', () => {
    document.body.className = styleSelect.value;
  });

  document.addEventListener('keydown', e => {
    if (cloakTabCheckbox.checked) {
      document.title = "Google Docs";
    }

    if (redirectKeyInput.value && redirectUrlInput.value &&
        e.key.toLowerCase() === redirectKeyInput.value.toLowerCase()) {
      window.location.href = redirectUrlInput.value;
    }

    if (emergencyKeyInput.value &&
        e.key.toLowerCase() === emergencyKeyInput.value.toLowerCase()) {
      window.close();
    }

    if (currentMode === 'console') {
      const entries = document.querySelectorAll('.console-entry');
      if (e.key === 'ArrowDown') {
        currentIndex = (currentIndex + 1) % entries.length;
        highlight(currentIndex);
      } else if (e.key === 'ArrowUp') {
        currentIndex = (currentIndex - 1 + entries.length) % entries.length;
        highlight(currentIndex);
      } else if (e.key === 'Enter') {
        const selected = entries[currentIndex];
        loadGames(selected.dataset.folder, selected.dataset.type);
      }
    } else if (currentMode === 'games') {
      const items = gamesUl.children;
      if (e.key === 'ArrowDown') {
        currentIndex = (currentIndex + 1) % items.length;
        highlightGame(currentIndex);
      } else if (e.key === 'ArrowUp') {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        highlightGame(currentIndex);
      } else if (e.key === 'Enter') {
        window.location.href = items[currentIndex].dataset.href;
      } else if (e.key === 'Backspace') {
        gameList.style.display = 'none';
        menu.style.display = 'block';
        currentMode = 'console';
        currentIndex = 0;
        highlight(currentIndex);
      }
    }
  });
  const bgMusic = document.getElementById('bg-music');

// Try to play immediately (some browsers allow it)
bgMusic.play().catch(() => {});

// Ensure it plays after first user interaction
document.body.addEventListener('click', () => {
  bgMusic.play().catch(() => {});
}, { once: true });

  backBtn.addEventListener('click', () => {
    gameList.style.display = 'none';
    menu.style.display = 'block';
    currentMode = 'console';
    currentIndex = 0;
    highlight(currentIndex);
  });

  renderCustomFolders();
  highlight(currentIndex);

});