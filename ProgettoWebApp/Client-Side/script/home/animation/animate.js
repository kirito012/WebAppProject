window.onload = () => {

	let animationInput = anime.timeline({
		easing: 'easeOutCirc',
	});
	animationInput
		.add({
			targets: '.inputBox, .submit',
			translateY: [100, 0],
			opacity: 1,
			delay: anime.stagger(100, { start: 200 }),
			duration: 500,
			autoplay: false
		})
	document.querySelector(".link.l1").onclick = animationInput.restart;


	let animationDevices = anime.timeline({
		easing: 'easeOutCirc',
	});

	animationDevices
		.add({
			targets: '.search',
			translateY: [100, 0],
			opacity: 1,
			duration: 500,
			delay: 100,
			autoplay: false
		})
		.add({
			targets: '.removeSelection',
			translateY: [100, 0],
			opacity: 1,
			duration: 500,
			autoplay: false
		});


	document.querySelector(".link.l2").onclick = animationDevices.restart;
	document.querySelector(".select").onclick = animationDevices.restart;

	let animationTextTitle = anime.timeline({
		easing: 'easeOutCirc'
	})

	animationTextTitle
		.add({
			targets: '.dashboardTitle',
			translateX: [-30, 0],
			opacity: 1,
			duration: 260,
			delay: 200
		})
		.add({
			targets: '.infoSelected',
			translateX: [-30, 0],
			opacity: 1,
			duration: 260,
		})
		.add({
			targets: '.select',
			translateX: [30, 0],
			opacity: 1,
			duration: 260,
		})
		.add({
			targets: '#map',
			translateX: [30, 0],
			opacity: 1,
			duration: 260,
		})
		.add({
			targets: '.information',
			translateX: [-30, 0],
			opacity: 1,
			duration: 260,
		})
		.add({
			targets: '.state, .infoBottom',
			scale: [1.3, 1],
			opacity: 1,
			duration: 260,
			delay: anime.stagger(100)
		})
		.add({
			targets: '.button.remove',
			translateX: [-30, 0],
			opacity: 1,
			duration: 260,
		})
		.add({
			targets: '.button.goTo',
			translateX: [30, 0],
			opacity: 1,
			duration: 260,
		});



	let once = false;
	let newOnce = false;

	let dashboard = document.querySelector(".dashboard");
	dashboard.addEventListener("scroll", () => {
		let y = dashboard.scrollTop;
		if (y > window.innerHeight / 1.6) {
			if (!once) {
				let dataAnimation = anime.timeline({
					autoplay: true,
					easing: 'easeOutCirc',
					loop: false,
				})

				dataAnimation
					.add({
						targets: '.overViewTitle',
						translateX: [-30, 0],
						opacity: [0, 1],
						duration: 260,
						delay: 200
					})
					.add({
						targets: '.dataContainer',
						translateY: [30, 0],
						opacity: [0, 1],
						duration: 260,
					})
					.add({
						targets: '.data',
						translateX: [-30, 0],
						opacity: [0, 1],
						duration: 260,
					})
					.add({
						targets: '.context',
						translateX: [-30, 0],
						opacity: [0, 1],
						duration: 260,
					})
					.add({
						targets: '.valueData',
						translateY: [-100, 0],
						opacity: [0, 1],
						duration: 260,
						delay: anime.stagger(50)
					})
					.add({
						targets: '.writeBottom ul li',
						translateY: [30, 0],
						opacity: [0, 1],
						duration: 260,
						delay: anime.stagger(50)
					})
					.add({
						targets: '.gaugeContainer',
						translateX: [30, 0],
						opacity: [0, 1],
						duration: 260,
					})
					.add({
						targets: '.infoDataSeleted',
						translateY: [30, 0],
						opacity: [0, 1],
						duration: 260,
					})
					.add({
						targets: '.goHistory',
						translateY: [30, 0],
						opacity: [0, 1],
						duration: 260,
					});
				once = true;
			}
			if (y > window.innerHeight / 0.8) {
				if (!newOnce) {
					let tableAnimation = anime.timeline({
						autoplay: true,
						easing: 'easeOutCirc',
						loop: false,
					})

					tableAnimation
						.add({
							targets: '.historic',
							translateX: [-30, 0],
							opacity: [0, 1],
							duration: 260,
							delay: 200
						})
						.add({
							targets: '.selectHistory',
							translateY: [-30, 0],
							opacity: [0, 1],
							duration: 260,
							delay: anime.stagger(100)
						})
						.add({
							targets: '.table',
							translateY: [30, 0],
							opacity: [0, 1],
							duration: 260,
						})
						.add({
							targets: '.itemNumber',
							translateY: [30, 0],
							scale: [4, 1],
							opacity: [0, 1],
							duration: 260,
							delay: anime.stagger(50)
						})
						.add({
							targets: '.a',
							translateX: [30, 0],
							scale: [4, 1],
							opacity: [0, 1],
							duration: 260,
							delay: anime.stagger(100)
						})



					newOnce = true;
				}
			}
		}

	})



}


export let textAnimation = () => {
	anime.timeline({ loop: false })
		.add({
			targets: '.letter',
			scale: [10, 1],
			opacity: [0, 1],
			translateZ: 0,
			easing: "easeOutCirc",
			delay: anime.stagger(25)
		})
}

export let removeTextAnimation = () => {
	anime.timeline({ loop: false })
		.add({
			targets: '.letter',
			scale: [1, 10],
			opacity: [1, 0],
			translateZ: 0,
			easing: "easeOutCirc",
			delay: anime.stagger(25)
		})
}

export let gaugeTextAnimation = (oldValue, value) => {
	anime({
		targets: '.valueNumber',
		innerHTML: [oldValue, value],
		round: 10,
		easing: 'linear',
		duration: 1000
	})
}
