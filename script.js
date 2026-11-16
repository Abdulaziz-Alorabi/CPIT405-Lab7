const ACCESS_KEY = "D65OkwhUOSKaA2NUA3b31NuKdJ3sITcij6mFqQvxl-o";
const API_URL = "https://api.unsplash.com/search/photos";

const searchInput = document.getElementById("searchInput");
const photosContainer = document.getElementById("photosContainer");

function getSearchUrl() {
    const query = searchInput.value.trim();

    if (!query) {
        alert("Please enter a search term.");
        return null;
    }

    return `${API_URL}?query=${encodeURIComponent(query)}&per_page=8`;
}

function displayPhotos(data) {
    photosContainer.innerHTML = "";

    if (data.results.length === 0) {
        photosContainer.textContent = "No images found.";
        return;
    }

    data.results.forEach((photo) => {
        const card = document.createElement("div");
        card.className = "photo-card";

        const photoLink = document.createElement("a");
        photoLink.href = photo.links.html;
        photoLink.target = "_blank";
        photoLink.rel = "noopener noreferrer";

        const image = document.createElement("img");
        image.src = photo.urls.small;
        image.alt = photo.alt_description || "Unsplash photo";
        photoLink.appendChild(image);

        const credit = document.createElement("a");
        credit.className = "credit";
        credit.href = photo.user.links.html;
        credit.target = "_blank";
        credit.rel = "noopener noreferrer";
        credit.textContent = `Photo by ${photo.user.name}`;

        card.appendChild(photoLink);
        card.appendChild(credit);
        photosContainer.appendChild(card);
    });
}

function displayError(message) {
    photosContainer.textContent = message;
}

// 1. XMLHttpRequest (XHR)
function searchWithXHR() {
    const url = getSearchUrl();
    if (!url) return;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Authorization", `Client-ID ${ACCESS_KEY}`);

    xhr.onload = function () {
        if (xhr.status === 200) {
            displayPhotos(JSON.parse(xhr.responseText));
        } else {
            displayError(`Request failed: ${xhr.status}`);
        }
    };

    xhr.onerror = function () {
        displayError("Network error.");
    };

    xhr.send();
}

// 2. Fetch with Promises
function searchWithPromises() {
    const url = getSearchUrl();
    if (!url) return;

    fetch(url, {
        headers: { Authorization: `Client-ID ${ACCESS_KEY}` }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => displayPhotos(data))
        .catch((error) => displayError(error.message));
}

// 3. Fetch with Async/Await
async function searchWithAsyncAwait() {
    const url = getSearchUrl();
    if (!url) return;

    try {
        const response = await fetch(url, {
            headers: { Authorization: `Client-ID ${ACCESS_KEY}` }
        });

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();
        displayPhotos(data);
    } catch (error) {
        displayError(error.message);
    }
}

// Mouse events
document.getElementById("xhrButton").addEventListener("click", searchWithXHR);
document.getElementById("promiseButton").addEventListener("click", searchWithPromises);
document.getElementById("asyncButton").addEventListener("click", searchWithAsyncAwait);

// Keyboard event: press Enter to search
searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchWithAsyncAwait();
    }
});
