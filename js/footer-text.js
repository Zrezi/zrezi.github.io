(function() {
	var a = document.createElement("a");
	a.innerHTML = "0705176";
	a.href = "";
	a.onclick = function(event) {
		event.preventDefault();
		window.location = "/pages/programminglog.html";
	}
	
	document.getElementById("footer-text").appendChild(a);
})();