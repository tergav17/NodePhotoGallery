function login(){

	let userNameInput = document.getElementById("uName");
    let passwordInput  = document.getElementById("uPass");	
	
	fetch("/post/login", {
		method: "POST",
		headers: {'Content-Type': 'application/json'}, 
		body: "{ \"username\": \"" + userNameInput.value + "\", \"password\": \"" + passwordInput.value + "\" }"
	}).then(response => response.json()).then(data => {
		if (data.valid == true) {
            document.cookie = "token="+data.token.id+";";
            window.location.href = "/"
		} else {
            document.getElementById("loginError").innerText = "Please Enter Valid Login";

			console.log("Non valid login");
		}
	});
}