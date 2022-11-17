function register(){

	let userNameInput = document.getElementById("uName");
    let passwordInput  = document.getElementById("uPass");	
    let passwordInputConf  = document.getElementById("uPassConf");	
	
	if (passwordInput.value == passwordInputConf.value) fetch("/new", {
		method: "POST",
		headers: {'Content-Type': 'application/json'}, 
		body: "{ \"username\": \"" + userNameInput.value + "\", \"password\": \"" + passwordInput.value + "\" }"
	}).then(response => response.json()).then(data => {
		if (data.valid == true) {
            document.cookie = "token="+data.token.id+";";
            window.location.href = "/"
		} else {
            document.getElementById("registerError").innerText = "User Already Exists!";

			console.log("Non valid login");
		}
	});

    else {
        document.getElementById("registerError").innerText = "Make Sure Passwords Match!";
    }
}