document.addEventListener("DOMContentLoaded", function () {
  // Load existing snippets from storage and display them
  loadSnippets();

  // Save a new snippet when the "Save" button is clicked
  document.getElementById("snippetText").addEventListener("input", function () {
    const saveButton = document.getElementById("saveButton");
    saveButton.disabled = !this.value.trim();
  });

  document.getElementById("saveButton").addEventListener("click", function () {
    const snippetText = document.getElementById("snippetText").value.trim();
    saveSnippet(snippetText);
  });
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
    document.getElementById("snippetText").value = "";
  });
}
function deleteSnippet() {
  console.log("This button is being pressed");
  // Get the snippet number from the text box
  const snippetNumberToDelete = document.getElementById(
    "snippetNumberToDelete"
  ).value;

  // Validate if the input is a valid number
  if (!isNaN(snippetNumberToDelete)) {
    // Convert the input to an integer
    const snippetNumber = parseInt(snippetNumberToDelete) - 1;
    console.log(snippetNumber);

    // Get existing snippets from storage
    chrome.storage.sync.get({ snippets: [] }, function (data) {
      const snippets = data.snippets;

      // Validate if the snippet number is within the array bounds
      if (snippetNumber >= 0 && snippetNumber < snippets.length) {
        // Remove the specified snippet from the array
        snippets.splice(snippetNumber, 1);

        // Save the updated snippets back to storage
        chrome.storage.sync.set({ snippets: snippets }, function () {
          // Reload the snippets in the popup
          loadSnippets();
        });
        document.getElementById("snippetNumberToDelete").value = "";
      } else {
        alert("Invalid snippet number. Please enter a valid number.");
      }
    });
  } else {
    alert("Please enter a valid number.");
  }
}

function loadSnippets() {
  // Get snippets from storage and display them in the popup
  chrome.storage.sync.get({ snippets: [] }, function (data) {
    const snippetList = document.getElementById("snippetList");
    snippetList.innerHTML = "";
    console.log(data);
    data.snippets.forEach(function (snippet) {
      const listItem = document.createElement("li");
      listItem.textContent = snippet;
      snippetList.appendChild(listItem);
    });
  });
}
document.getElementById("saveButton").addEventListener("click", saveSnippet);
document
  .getElementById("deleteButton")
  .addEventListener("click", deleteSnippet);
