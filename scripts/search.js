function search(){

	let searchQuery = document.getElementById("searchPrompt");

	// Send a post request to the search endpoint
	fetch("/post/search", {
		method: "POST",
		headers: {'Content-Type': 'application/json'}, 
        // Include the query
		body: "{ \"query\": \"" + searchQuery.value + "\"}"

    // Handle response here
	}).then(response => response.json()).then(data => {

        const results = document.getElementById("searchResultContent");

        results.innerHTML = '';

		for (const image of data) {
            console.log(image.imageName);

            var elem = document.createElement("img");
            elem.setAttribute("src", "/u/" + image.imageName);
            results.appendChild(elem);

            var br = document.createElement("br");
            results.appendChild(br);
        }
	});

}