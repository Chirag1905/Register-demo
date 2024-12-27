// Get references to the elements
const homeLink = document.getElementById("home-link");
const aboutLink = document.getElementById("about-link");
const contactLink = document.getElementById("contact-link");
const crudLink = document.getElementById("crud-link");

const homeSection = document.getElementById("home");
const aboutSection = document.getElementById("about");
const contactSection = document.getElementById("contact");
const crudSection = document.getElementById("crud");

const userForm = document.getElementById("user-form");
const userNameInput = document.getElementById("user-name");
const userList = document.getElementById("user-list");

let users = [];
let currentUserId = 0;

// Function to show only one section at a time
function showSection(sectionToShow) {
  homeSection.style.display = "none";
  aboutSection.style.display = "none";
  contactSection.style.display = "none";
  crudSection.style.display = "none";

  sectionToShow.style.display = "block";
}

// Event listeners for navigation
homeLink.addEventListener("click", () => showSection(homeSection));
aboutLink.addEventListener("click", () => showSection(aboutSection));
contactLink.addEventListener("click", () => showSection(contactSection));
crudLink.addEventListener("click", () => showSection(crudSection));

// Function to render the user list
function renderUserList() {
  userList.innerHTML = "";
  users.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.name}</td>
      <td>
        <button class="edit" onclick="editUser(${user.id})">Edit</button>
        <button class="delete" onclick="deleteUser(${user.id})">Delete</button>
      </td>
    `;
    userList.appendChild(row);
  });
}

// Function to add a new user
userForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const userName = userNameInput.value.trim();
  if (userName) {
    users.push({ id: ++currentUserId, name: userName });
    userNameInput.value = "";
    renderUserList();
  }
});

// Function to edit a user
window.editUser = function (id) {
  const user = users.find((user) => user.id === id);
  if (user) {
    const newName = prompt("Edit user name:", user?.name);
    if (newName) {
      user.name = newName?.trim();
      renderUserList();
    }
  }
};

// Function to delete a user
window.deleteUser = function (id) {
  users = users.filter((user) => user.id !== id); // Filter out the user with the matching ID
  renderUserList(); // Re-render the user list
  console.log("User deleted:", id); // Debugging - check which user was deleted
};

// Initialize the page
showSection(homeSection);

// script.js

let peopleImages = {}; // Object to store uploaded images for each person

document
  .getElementById("image-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const personName = document.getElementById("person-name").value.trim();
    const imageInput = document.getElementById("image-upload");
    const tableBody = document.getElementById("image-table-body");

    // Check if name and file are provided
    if (personName && imageInput.files.length > 0) {
      // Check if the person already has an image uploaded
      if (peopleImages[personName]) {
        alert(`${personName} has already uploaded an image.`);
        return;
      }

      const file = imageInput.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        // Store the uploaded image as base64 data
        peopleImages[personName] = e.target.result;

        // Create a table row for the person's image and actions
        const row = document.createElement("tr");
        row.id = `person-${personName}`; // Assign an ID for easy reference

        // Name column
        const nameCell = document.createElement("td");
        nameCell.textContent = personName;
        row.appendChild(nameCell);

        // Image column
        const imageCell = document.createElement("td");
        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.maxWidth = "100px"; // Limit image size
        imageCell.appendChild(img);
        row.appendChild(imageCell);

        // Actions column (Edit and Update buttons)
        const actionsCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = function () {
          editImage(personName); // Function to handle image edit
        };

        const updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.style.display = "none"; // Initially hide the Update button
        updateButton.onclick = function () {
          updateImage(personName, img, updateButton); // Function to update image
        };

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(updateButton);
        row.appendChild(actionsCell);

        // Append the row to the table
        tableBody.appendChild(row);
      };

      // Read the file as a data URL
      reader.readAsDataURL(file);

      // Clear the form for the next input
      document.getElementById("person-name").value = "";
      imageInput.value = "";
    } else {
      alert("Please enter a name and select an image.");
    }
  });

// Function to handle image edit
function editImage(personName) {
  const imageInput = document.getElementById("image-upload");
  const updateButton = document.querySelector(
    `#person-${personName} td button:nth-child(2)`
  ); // Find the Update button

  // Enable the file input for a new image upload
  imageInput.disabled = false;
  imageInput.focus();
  imageInput.click(); // Automatically trigger the file input click

  // Change the update button to be visible
  updateButton.style.display = "inline-block";
}

// Function to handle image update
function updateImage(personName, imgElement, updateButton) {
  const imageInput = document.getElementById("image-upload");
  const file = imageInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      // Update the stored image for the person
      peopleImages[personName] = e.target.result;

      // Update the image in the table
      imgElement.src = e.target.result;

      // Hide the Update button after the image is updated
      updateButton.style.display = "none";
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);

    // Clear the file input and disable it again
    imageInput.value = "";
    imageInput.disabled = true;
  } else {
    alert("Please select an image to update.");
  }
}
