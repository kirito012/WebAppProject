window.onload = () => {

    let animationInput = anime.timeline({
        easing: 'easeOutCirc',
    });
    animationInput
    .add({
        targets: '.inputBox, .submit',
        translateY: [100, 0],
        opacity: 1,
        delay: anime.stagger(100, {start: 200}),
        duration: 500,
        autoplay: false
    })
    document.querySelector(".link.l1").onclick = animationInput.start;



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
        duration: 400,
        delay: 200
    })
    .add({
        targets: '.infoSelected',
        translateX: [-30, 0],
        opacity: 1,
        duration: 400,
    })
    .add({
        targets: '.select',
        translateX: [30, 0],
        opacity: 1,
        duration: 400,
    })
    .add({
        targets: '#map',
        translateX: [30, 0],
        opacity: 1,
        duration: 400,
    })
    .add({
        targets: '.information',
        translateX: [-30, 0],
        opacity: 1,
        duration: 400,
    })
    .add({
        targets: '.state, .infoBottom',
        scale: [1.3, 1],
        opacity: 1,
        duration: 400,
        delay: anime.stagger(100)
    })
    .add({
        targets: '.button.remove',
        translateX: [-30, 0],
        opacity: 1,
        duration: 400,
    })
    .add({
        targets: '.button.goTo',
        translateX: [30, 0],
        opacity: 1,
        duration: 400,
    });
}


export let textAnimation = () => {
    anime.timeline({loop: false})
  .add({
    targets: '.letter',
    scale: [10,1],
    opacity: [0,1],
    translateZ: 0,
    easing: "easeOutCirc",
    delay: anime.stagger(25)
  })
}

export let removeTextAnimation = () => {
    anime.timeline({loop: false})
  .add({
    targets: '.letter',
    scale: [1, 10],
    opacity: [1, 0],
    translateZ: 0,
    easing: "easeOutCirc",
    delay: anime.stagger(25)
  })
}