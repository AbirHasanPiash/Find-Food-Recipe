async function handleSearch(searchValue) {
  // If searchValue is empty, clear the card container and sessionStorage
  if (!searchValue.trim()) {
    sessionStorage.removeItem("lastSearch");
    sessionStorage.removeItem("searchResults");
    document.querySelector(".card-container").innerHTML = ""; // Clear displayed cards
    return;
  }

  try {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.meals) {
      displaySorry();
    } else {
      // Store the new search results in sessionStorage
      sessionStorage.setItem("lastSearch", searchValue);
      sessionStorage.setItem("searchResults", JSON.stringify(data.meals));
      displayCard(data.meals);
    }
  } catch (error) {
    console.error("Error fetching meal data:", error);
  }
}

// Restore search results when navigating back/forward
window.addEventListener("pageshow", () => {
  const lastSearch = sessionStorage.getItem("lastSearch");
  const savedResults = sessionStorage.getItem("searchResults");

  if (lastSearch && savedResults) {
    displayCard(JSON.parse(savedResults));
  }
});

// Clear search results on reload (but not when navigating back)
window.addEventListener("load", () => {
  if (!performance.navigation.type || performance.navigation.type === 1) {
    sessionStorage.removeItem("lastSearch");
    sessionStorage.removeItem("searchResults");
    document.querySelector(".card-container").innerHTML = ""; // Clear results on reload
  }
});

// Display meal cards dynamically
function displayCard(meals) {
  const cardContainer = document.querySelector(".card-container");
  cardContainer.innerHTML = ""; // Clear previous content before adding new cards

  meals.forEach((meal) => {
    const div = document.createElement("div");
    div.className = "card";
    div.id = meal.idMeal;
    div.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h3>${meal.strMeal}</h3>
      `;
    cardContainer.appendChild(div);
  });
}

// Show "Not Found" message
function displaySorry() {
  const cardContainer = document.querySelector(".card-container");
  cardContainer.innerHTML = ""; // Clear previous content before showing "Not Found"
  
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
      <img src="./sorry.png" alt="Not Found">
      <h3>Not Found</h3>
  `;
  cardContainer.appendChild(div);
}

// Event listener for searching
document.getElementById("search-button").addEventListener("click", () => {
  const searchValue = document.getElementById("search-value").value.trim();
  handleSearch(searchValue);
});

// Allow pressing "Enter" for search
document.getElementById("search-value").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const searchValue = document.getElementById("search-value").value.trim();
    handleSearch(searchValue);
  }
});

// Event delegation for card clicks
document.querySelector(".card-container").addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (card) {
    const mealId = card.id;
    window.location.href = `details.html?id=${mealId}`;
  }
});
