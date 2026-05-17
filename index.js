import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://cvoqnxxyqmqetkmqhxnb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2b3FueHh5cW1xZXRrbXFoeG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTAzNzQsImV4cCI6MjA5NDU4NjM3NH0.RuUSbQJ9M3g__WivRYHP-Zu14OykZRLVx-fX76D2kFc'
const supabase = createClient(supabaseUrl, supabaseKey)

const min = 1;
let max = 32;

class Card {
    constructor(image, score) {
        this.image = image;
        this.score = score;
    }
    present() {
        return mashList[this.image - min];
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

function getTwoUniqueCards() {
    let index1 = getRandomInt(min, max);
    let index2;
    do {
        index2 = getRandomInt(min, max);
    } while (index2 === index1);
    return [index1, index2];
}

let mashList = [];
let scoreList = [];

let newcard;
let newcard2;

async function loadScores() {
    const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('id');

    if (data) {
        mashList = data.map(row => row.image);
        scoreList = data.map(row => row.score);

    await supabase.from('visits').insert({ visited_at: new Date() });
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
    let [i1, i2] = getTwoUniqueCards();
    newcard = new Card(i1, 0);
    newcard2 = new Card(i2, 0);
    document.getElementById("card").src = newcard.present();
    document.getElementById("card2").src = newcard2.present();
    updateElo();
    saveScores();
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
    let [i1, i2] = getTwoUniqueCards(); // i1 and i2 are 1-32
    newcard = new Card(i1, 0);
    newcard2 = new Card(i2, 0);
    document.getElementById("card").src = newcard.present();
    document.getElementById("card2").src = newcard2.present();
    updateElo();
    saveScores();
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

document.getElementById("btn1").addEventListener("click", addscore);
document.getElementById("btn2").addEventListener("click", addscore2);