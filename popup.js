document.addEventListener("DOMContentLoaded", function () {
  //Will load the snippets when loaded
  loadSnippets();

  document.getElementById("snippetName").addEventListener("input", function () {
    const saveButton = document.getElementById("saveSnippet");
    saveButton.disabled = !this.value.trim();
  });

  document.getElementById("saveSnippet").addEventListener("click", function () {
    const snippetText = document.getElementById("snippetCode");
    saveSnippet(snippetText);
  });

  function saveSnippet(snippetText) {
    // Get existing snippets from storage
    chrome.storage.sync.get({ snippets: [] }, function (data) {
      const snippets = data.snippets;

      // Add the new snippet
      snippets.push(snippetText);

      // Save the updated snippets back to storage
      chrome.storage.sync.set({ snippets: snippets }, function () {
        // Reload the snippets in the popup
        loadSnippets();
      });
    });
  }
  function loadSnippets() {
    // Get snippets from storage and display them in the popup
    chrome.storage.sync.get({ snippets: [] }, function (data) {
      const snippetList = document.getElementById("snippetList");
      snippetList.innerHTML = "";

      data.snippets.forEach(function (snippet) {
        const listItem = document.createElement("li");
        listItem.textContent = snippet;
        snippetList.appendChild(listItem);
      });
    });
  }
});
