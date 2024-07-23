document.addEventListener('DOMContentLoaded', function () {
    const contentSection = document.getElementById('content');

    fetch('travel_recommendation_api.json')  // Assuming your JSON file is named data.json and is in the same directory
        .then(response => {
            console.log('Fetch response:', response);  // Log the response object
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Parsed JSON data:', data);  // Log the parsed JSON data
            displayData(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

        function displayData(data) {
            const contentSection = document.getElementById('content');
            let htmlContent = '';
        
            // Display countries and cities
            if (data.countries) {
                data.countries.forEach(country => {
                    country.cities.forEach(city => {
                        htmlContent += `
                            <div class="item">
                                <img src="${city.imageUrl}" alt="${city.name}">
                                <h3>${city.name}</h3>
                                <p>${city.description}</p>
                                <a href="#" class="visit-btn">Visit</a>
                            </div>
                        `;
                    });
                });
            }
        
            // Display temples
            if (data.temples) {
                data.temples.forEach(temple => {
                    htmlContent += `
                        <div class="item">
                            <img src="${temple.imageUrl}" alt="${temple.name}">
                            <h3>${temple.name}</h3>
                            <p>${temple.description}</p>
                            <a href="#" class="visit-btn">Visit</a>
                        </div>
                    `;
                });
            }
        
            // Display beaches
            if (data.beaches) {
                data.beaches.forEach(beach => {
                    htmlContent += `
                        <div class="item">
                            <img src="${beach.imageUrl}" alt="${beach.name}">
                            <h3>${beach.name}</h3>
                            <p>${beach.description}</p>
                            <a href="#" class="visit-btn">Visit</a>
                        </div>
                    `;
                });
            }
        
            contentSection.innerHTML = htmlContent;
        }
        
});


//keywordmatch 

const keywords = ['beach', 'temple', 'country'];

function matchKeyword(input) {
    const normalizedInput = input.toLowerCase().trim();
    let closestMatch = null;
    let smallestDistance = Infinity;

    keywords.forEach(keyword => {
        const distance = levenshteinDistance(normalizedInput, keyword);
        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestMatch = keyword;
        }
    });

    return closestMatch;
}
function levenshteinDistance(a, b) {
    const matrix = [];
    let i, j;
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
    }
    return matrix[b.length][a.length];
}

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    const input = document.getElementById('searchInput').value;
    const matchedKeyword = matchKeyword(input);
    document.getElementById('result').innerText = `Matched keyword: ${matchedKeyword}`;
});