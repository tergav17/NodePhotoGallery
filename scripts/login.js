function login(){
    //let bool = validateLogin();
    // if (bool) window.location.href = "index.html";

    
	let userNameInput = document.getElementById("uName");
    let passwordInput  = document.getElementById("uPass");	
	
	if (bool) fetch("/login", {
		method: "POST",
		headers: {'Content-Type': 'application/json'}, 
		body: "{ \"username\": \"" + userNameInput.value + "\", \"password\": \"" + passwordInput.value + "\" }"
	}).then(response => response.json()).then(data => {
		if (data.valid == "true") {
            document.cookie = data.token;
            window.location.href = "index.html"

            // storeUser(userNameInput); //need this function from index.js
		} else {
            document.getElementById("title").innerText = "Please Enter Valid Login";
			//document.getElementById("uPass").innerText = "";

		}
	});
}