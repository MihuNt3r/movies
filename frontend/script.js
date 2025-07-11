const form = document.getElementById("form");

form.addEventListener("submit", submitForm);

function submitForm(e) {
	e.preventDefault();
	const singleFile = document.getElementById("single-file")
	const formData = new FormData();
	console.log(singleFile.files[0]);
	formData.append("file", singleFile.files[0])

	//update the url where we'll send the request to
	fetch("/movies/import", {
		method: "POST",
		body: formData,
	})
		.then((res) => {
			if (res.ok) {
				$("#notification")
					.text("Import completed successfully ✅")
					.css("color", "green")
					.fadeIn()
					.delay(3000)
					.fadeOut();
			} else {
				throw new Error("Server error");
			}
		})
		.catch((err) => {
			console.log("Error occurred", err);
			$("#notification")
				.text("Import failed ❌")
				.css("color", "red")
				.fadeIn()
				.delay(3000)
				.fadeOut();
		});
}