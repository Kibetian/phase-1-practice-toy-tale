let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const toyCollection = document.getElementById("toy-collection");

  // Function to create a toy card
  const createToyCard = (toy) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" alt="${toy.name}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like</button>
    `;
    toyCollection.appendChild(card);
  };

  const handleToyFormSubmit = (event) => {
    event.preventDefault();
    const nameInput = toyFormContainer.querySelector("input[name='name']");
    const imageInput = toyFormContainer.querySelector("input[name='image']");

    const toyData = {
      name: nameInput.value,
      image: imageInput.value,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(toyData)
    })
      .then(response => response.json())
      .then(newToy => {
        createToyCard(newToy);
        nameInput.value = "";
        imageInput.value = "";
      })
      .catch(error => console.log("Error:", error));
  };

  // Event listener for toy form submission
  toyFormContainer.addEventListener("submit", handleToyFormSubmit);


 // Event listener for like button clicks
 toyCollection.addEventListener("click", (event) => {
  if (event.target.classList.contains("like-btn")) {
    const toyId = event.target.id;
    const likeCountElement = event.target.previousElementSibling;

    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: parseInt(likeCountElement.innerText) + 1
      })
    })
      .then(response => response.json())
      .then(updatedToy => {
        likeCountElement.innerText = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.log("Error:", error));
  }
});


  // Fetch existing toys
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(data => {
      data.forEach(toy => {
        createToyCard(toy);
      });
    })
    .catch(error => console.log("Error:", error));
});
