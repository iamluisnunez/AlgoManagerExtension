document
  .getElementById("deleteButton")
  .addEventListener("click", deleteSnippet);
const snippetTitle = document.getElementById("titleText").value.trim();

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
    const snippetTitle = document.getElementById("titleText").value.trim();
    saveSnippet(snippetText, snippetTitle);
  });

  document
    .getElementById("snippetList")
    .addEventListener("click", function (e) {
      if (e.target.tagName === "LI") {
        const snippetIndex = Array.from(e.target.parentNode.children).indexOf(
          e.target
        );
        showCode(snippetIndex);
      }
    });
  // Add event listener for back button
  document.getElementById("backButton").addEventListener("click", function () {
    showMainView();
  });
});

function saveSnippet(snippetText, snippetTitle) {
  // Get existing snippets from storage
  chrome.storage.sync.get({ snippets: [] }, function (data) {
    const snippets = data.snippets;

    //create a new snippet object
    const newSnippet = {
      title: snippetTitle,
      code: snippetText,
    };

    // Add the new snippet
    snippets.push(newSnippet);

    // Save the updated snippets back to storage
    chrome.storage.sync.set({ snippets: snippets }, function () {
      // Reload the snippets in the popup
      loadSnippets();
    });
    document.getElementById("snippetText").value = "";
    document.getElementById("titleText").value = "";
  });
}

/* DELETE FUNCTION */
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
        document.getElementById("titleText").value = "";
      } else {
        alert("Invalid snippet number. Please enter a valid number.");
      }
    });
  } else {
    alert("Please enter a valid number.");
  }
}

/*SHOW CODE FUNCTION this is what you see when you click on the title from the mainView*/
function showCode(snippetIndex) {
  document.getElementById("mainView").style.display = "none";
  // Display the code view with the selected snippet
  const codeView = document.getElementById("codeView");
  const codeTextBox = document.querySelector(".code-text-box");
  const backButton = document.getElementById("backButton");
  const codeTitle = document.getElementById("codeTitle");

  // Get snippets from storage
  chrome.storage.sync.get({ snippets: [] }, function (data) {
    const snippets = data.snippets;

    // Check if the snippetIndex is valid
    if (snippetIndex >= 0 && snippetIndex < snippets.length) {
      const snippet = snippets[snippetIndex];
      // Update the content of codeTextBox
      codeTextBox.textContent = `${snippet.code}`;
      codeTitle.textContent = `${snippet.title}`;

      // Show the codeView
      codeView.style.display = "block";

      // Show the back button
      backButton.style.display = "block";
    } else {
      codeView.innerHTML = "Invalid snippet index.";
    }
  });
}

function showMainView() {
  // Show the main view
  document.getElementById("mainView").style.display = "block";

  // Hide the code view
  document.getElementById("codeView").innerHTML = "";

  // Hide the back button
  document.getElementById("backButton").style.display = "none";
  document.querySelector(".code-text-box").style.display = "none";
}

function loadSnippets() {
  // Get snippets from storage and display them in the popup
  chrome.storage.sync.get({ snippets: [] }, function (data) {
    const snippetList = document.getElementById("snippetList");
    snippetList.innerHTML = "";
    console.log(data);
    data.snippets.forEach(function (snippet, index) {
      const listItem = document.createElement("li");
      console.log(snippet);
      listItem.textContent = `${index + 1}: ${snippet.title}`;
      snippetList.appendChild(listItem);
    });
  });
}
