
const answers = {}

let answerer = "";

window.answers = answers;


const questions = {
    upOrDown: 'Do you feel more connected to people through making art?',
    qSearchForPeople: 'How do you search for your audience? How do you reach for them?',
    qMoreFans: 'Do you want a bigger audience? Or stronger ties with a smaller audience? Or is what you have enough? Why?',
    qMaterialChange: 'Could you invite people more deeply into your work? How could you make space for them to materially change your art?',
    qDeepListen: 'In what ways do you listen to your audience? How do you know when they feel moved? When they feel left behind?',
    qTransformWork: 'How far do you go in transforming your work to be understood? How far should you go?',
    qLoseEnergy: 'Is it worth it to reach people if you lose your own artistic vigor on the way?',
    darkOrJoy: 'Does your audience cocreate art with you?',
    outOrIn: 'Are you searching for connection?',
    chaosOrCalm: 'Is art about the artist?',
    forestOrMeadow: 'Do you take your audience by the hand and pull them in?',
    morningOrNight: 'Will you delightedly translate your work to be understood?',
    unfoldOrCycle: 'Is public art a dialogue? Are you in conversation with other people?'
}

const yesNoQuestions = ['upOrDown', 'darkOrJoy', 'chaosOrCalm', 'forestOrMeadow', 'outOrIn', 'morningOrNight', 'unfoldOrCycle']


let myAnswers = []

document.getElementById('seekText').addEventListener('input', (e) => {
    answerer = e.target.value;
})


const textAreas = ['qSearchForPeople', 'qMoreFans', 'qMaterialChange', 'qDeepListen', 'qTransformWork', 'qLoseEnergy']

textAreas.forEach(id => {
    document.getElementById(id).addEventListener('input', (e) => {
        answers[id] = e.target.value
    })
})

document.addEventListener('answer', (e) => {
    const answerMap = {
        'up': 'yes',
        'down': 'no',
        'dark': 'yes',
        'joy': 'no',
        'chaos': 'yes',
        'calm': 'no',
        'forest': 'yes',
        'meadow': 'no',
        'out': 'yes',
        'in': 'no',
        'morning': 'yes',
        'night': 'no',
        'unfold': 'yes',
        'cycle': 'no',
    }

    answers[e.detail.question] = answerMap[e.detail.value];
}, false);

document.getElementById('findSongBtn').addEventListener('click', async () => {

    const res = await fetch('/answers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            answerer: answerer || 'Friend',
            answers
        })
    });


    myAnswers = await res.json();
    const answersRes = await fetch('/answers');
    renderGems(await answersRes.json())

}, { once: true })


function renderGems(answers) {
    const questionss = {}

    answers.forEach(({ id, answerer, questionID, answer, targetX, targetY }, idx) => {

        if (!answer) {
            return
        }

        if (!(questionID in questionss)) {
            questionss[questionID] = Math.random() * 360;
        }


        const gem = document.createElement('img');
        gem.classList.add('gem')

        gem.setAttribute('style', `--animationTime : ${Math.random() * 10}s; --baseHue: ${questionss[questionID]}deg;`)

        gem.src = `images/gems/gem.png`

        const container = document.createElement('div')
        container.classList.add('answer-gem_container')

        const div = document.createElement('div');
        container.appendChild(div)
        div.classList.add('answer-gem')

        if (yesNoQuestions.includes(questionID)) {
            div.classList.add('yes-no')
        }

        div.id = `answer-${id}`;


        if (myAnswers.find(a => a.id == id)) {
            gem.classList.add('own')
        }

        div.style.position = 'relative';
        container.style.width = 'fit-content';

        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (500);


        container.style.position = 'absolute';
        container.style.left = `${(targetX + (Math.random() - 0.5) / 5) * 100}%`
        container.style.top = `${(targetY + (Math.random() - 0.5) / 5) * 100}%`

        container.style.setProperty('--slowMoveOffset', `${Math.random()}s`)
        container.style.setProperty('--rotateShift', 0)// `${Math.random() * 360}deg`)
        container.style.setProperty('--slowMoveTime', `${Math.random()}s`)

        div.appendChild(gem);

        const tooltip = document.createElement('div');
        tooltip.classList.add('answer-tooltip');

        const question = questions[questionID] || ''
        tooltip.innerHTML = `<span class="answer-tooltip__answerer">${answerer}</span><br><div class="answer-tooltip__question">${question}</div><br>${answer}`;
        div.appendChild(tooltip);


        const vw = Math.max(0.1, Math.min(answer.length / 800, 1.0));
        tooltip.style.width = `${vw * 100}vw`

        gem.addEventListener('pointerenter', () => {
            if (!window.activeGem) {
                div.setAttribute('tooltip-visible', true);
            }
        })

        gem.addEventListener('pointerleave', () => {
            if (!window.activeGem) {
                div.removeAttribute('tooltip-visible')
            }
        })

        document.getElementById('lastLvl').appendChild(container);
    })

    if (!document.querySelector('[src="dragGems.js"]')) {
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", "dragGems.js");
        document.getElementsByTagName("head")[0].appendChild(script);
    }
}
