import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'YOUR_PROJECT_URL'
const supabaseKey = 'YOUR_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

const min = 1;
let max = 32;

class Card {
    constructor(image, score) {
        this.image = image;
        this.score = score;
    }
    present() {
        return 'images/photo' + this.image + '.JPG';
    }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
const mashList = [];
for (let i = min; i <= max; i++) {
    mashList.push('images/photo' + i + '.JPG');
}
console.log(mashList);

const scoreList = [];
for (let i = min; i <= max; i++) {
    scoreList.push(0);
}
console.log(scoreList);

let newcard = new Card(getRandomInt(min, max), 0);
let newcard2 = new Card(getRandomInt(min, max), 0);
document.getElementById("card").src = newcard.present();
document.getElementById("card2").src = newcard2.present();
*/

let mashList = [];
let scoreList = [];

async function loadScores() {
    const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('id');

    if (data) {
        mashList = data.map(row => row.image);
        scoreList = data.map(row => row.score);
    }

    // now it's safe to show the first cards
    let [i1, i2] = getTwoUniqueCards();
    newcard = new Card(i1, 0);
    newcard2 = new Card(i2, 0);
    document.getElementById("card").src = newcard.present();
    document.getElementById("card2").src = newcard2.present();
    updateElo();
}

loadScores();

function addscore() {
    for (let j = 0; j <= max - min; j++) {
        if (mashList[j] == newcard2.present()) {
            for (let i = 0; i <= max - min; i++) {
                if (mashList[i] == newcard.present() && scoreList[i] >= scoreList[j]) {
                    scoreList[i] += 1;
                }
                else if (mashList[i] == newcard.present() && scoreList[i] < scoreList[j]) {
                    scoreList[i] += 2;
                }
            }
        }
    }
    console.log(scoreList);
    newcard = new Card(getRandomInt(min, max), 0); 
    document.getElementById("card").src = newcard.present();
    newcard2 = new Card(getRandomInt(min, max), 0);     
    document.getElementById("card2").src = newcard2.present();
    updateElo();
}

function addscore2() {
    for (let j = 0; j <= max - min; j++) {
        if (mashList[j] == newcard.present()) {
            for (let i = 0; i <= max - min; i++) {
                if (mashList[i] == newcard2.present() && scoreList[i] >= scoreList[j]) {
                    scoreList[i] += 1;
                }
                else if (mashList[i] == newcard2.present() && scoreList[i] < scoreList[j]) {
                    scoreList[i] += 2;
                }
            }
        }
    }
    console.log(scoreList);
    newcard = new Card(getRandomInt(min, max), 0); 
    document.getElementById("card").src = newcard.present();
    newcard2 = new Card(getRandomInt(min, max), 0);     
    document.getElementById("card2").src = newcard2.present();
    updateElo();
}
function updateElo() {
    for (let i = 0; i <= max - min; i++) {
        if (mashList[i] == newcard2.present()) {
            document.getElementById("score2").innerHTML = "score: " + scoreList[i];
        }
    }
    for (let i = 0; i <= max - min; i++) {
        if (mashList[i] == newcard.present()) {
            document.getElementById("score1").innerHTML = "score: " + scoreList[i];
        }
    }
    sortScores();
}
function sortScores() {
    let sortedMashList = [...mashList];
    let sortedScoreList = [...scoreList];
    for (let j = 0; j < max - min; j++) {
        for (let i = 0; i < max - min; i++) {
            if (sortedScoreList[i] < sortedScoreList[i + 1]) {
                [sortedScoreList[i], sortedScoreList[i + 1]] = [sortedScoreList[i + 1], sortedScoreList[i]];
                [sortedMashList[i], sortedMashList[i + 1]] = [sortedMashList[i + 1], sortedMashList[i]];
            }
        }
    }
    console.log(sortedMashList);
    document.getElementById("podium1").innerHTML = "score: " + sortedScoreList[0];
    document.getElementById("podium1img").src = sortedMashList[0];
    document.getElementById("podium2").innerHTML = "score: " + sortedScoreList[1];
    document.getElementById("podium2img").src = sortedMashList[1];
    document.getElementById("podium3").innerHTML = "score: " + sortedScoreList[2];
    document.getElementById("podium3img").src = sortedMashList[2];
}

async function saveScores() {
    for (let i = 0; i < mashList.length; i++) {
        await supabase
            .from('scores')
            .update({ score: scoreList[i] })
            .eq('image', mashList[i]);
    }
}