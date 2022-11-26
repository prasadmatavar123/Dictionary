let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let apiKey = '531f1164-8228-459a-8897-f2a16a6639ed';
let notFound = document.querySelector('.not__found');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');
searchBtn.addEventListener('click', function(e){
    e.preventDefault();

    //clear data
    audioBox.innerHTML = '';
    notFound.innerText = '';
    defBox.innerText = '';

    //Get input data
    let word = input.value;

    //call API get data
    if(word === ''){
        alert('word is required');
        return;
    }
    getData(word);
})

async function getData(word){
    loading.style.display = 'block';
    //Ajax call
    const respone = await fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`)
    const data = await respone.json();
    
    //if empty result
    if(!data.length){
        loading.style.display = 'none';
        notFound.innerText = 'No result found';
        return;

    }


    //if result is suggetions
    if(typeof data[0] === 'string'){
        loading.style.display = 'none';
        let heading = document.createElement('h3');
        heading.innerText = 'Did you mean?';
        notFound.appendChild(heading);
        data.forEach(element =>{
            let suggetion = document.createElement('span');
            suggetion.classList.add('suggested');
            suggetion.innerText = element;
            notFound.appendChild(suggetion);
        })
        return;

    }

    //Result found
    loading.style.display = 'none';
    let defination = data[0].shortdef[0];
    defBox.innerText = defination;


    //sound
    const soundName = data[0].hwi.prs[0].sound.audio;
    if(soundName){
        renderSound(soundName);
    }
    console.log(data);
}

function renderSound(soundName){
    //https://media.merriam-webster.com/soundc11
    let subfolder = soundName.charAt(0);
    let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${apiKey}`;

    let aud = document.createElement('audio');
    aud.src = soundSrc;
    aud.controls = true;
    audioBox.appendChild(aud);
}