window.onload = () => {

    console.log("FF");

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
    })
    .add({
        targets: '.device',
        translateY: [100, 0],
        opacity: 1,
        delay: anime.stagger(100, {start: 200}),
        duration: 500,
        autoplay: false
    });

    document.querySelector(".link.l2").onclick = animationDevices.restart;
    document.querySelector(".select").onclick = animationDevices.restart;


    let animationTopic = anime({
        targets: '.topicLabel',
        translateY: [100, 0],
        opacity: 1,
        easing: 'easeOutCirc',
        delay: anime.stagger(100, {start: 200}),
        duration: 500,
        autoplay: false
    });
    document.querySelector(".link.l3").onclick = animationTopic.restart;



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
        targets: '.mapouter',
        translateX: [30, 0],
        opacity: 1,
        duration: 400,
    })
    .add({
        targets: '.info',
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