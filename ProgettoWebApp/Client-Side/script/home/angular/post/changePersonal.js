let changeForm = document.querySelector("#formSettings");

export let refreshProfileData = ($scope, callback) => {
	changeForm.addEventListener("submit", (event) => {
		event.preventDefault();
		const resp = fetch(event.target.action, {
			method: "POST",
			body: new URLSearchParams(new FormData(event.target)),
		}).then((response) => {
			response.json().then((data) => {
				if (callback) {
					callback($scope, data);
				}
			}).catch((err) => {
				console.log(err);
			})
		});
	});
}