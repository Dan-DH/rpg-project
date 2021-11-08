import { Clase } from "./character.js"

const portraits = {
    assassin: "./assets/images/assassin.webp",
    automaton: "./assets/images/automaton.webp",
    berserker: "./assets/images/berserker.webp",
    monk: "./assets/images/monk.webp"
}

const stats = {
    assassin: {
        hp: 50,
        maxHealth : 50,
        damage : 3,
        precision : 5,
        crit : 5,
        dodge : 4,
        deflect : -2
    },
    automaton: {
        hp: 60,
        maxHealth : 60,
        damage : 4,
        precision : 6,
        crit : 1,
        dodge : 2,
        deflect : 2
    },
    berserker: {
        hp: 70,
        maxHealth : 70,
        damage : 5,
        precision : 3,
        crit : 2,
        dodge : 2,
        deflect : 2
    },
    monk: {
        hp: 50,
        maxHealth : 50,
        damage : 3,
        precision : 6,
        crit : 0,
        dodge : 1,
        deflect : 6
    },
}

//setting vars for player selection
var p1
var p2
var p1done = false
var p2done = false

//declaring gameLog and hiding it until game starts
var gameLog = document.querySelector(".gameLog");
gameLog.classList.add("invisible");

//health bar variables
var hp1 = document.getElementById("HPplayer1")
var hp2 = document.getElementById("HPplayer2")

//hidding health bars and buttons until game starts
document.querySelectorAll("progress").forEach(bar => bar.classList.add("invisible"))
document.querySelectorAll(".btnRow").forEach(btn => btn.classList.add("invisible"))

//hidding gameover popup until gameover
document.getElementById("goPop").classList.add("invisible")

//class creation function
function newClase(p) {
    var cs = p.clase
    p.hp = stats[cs].hp
    p.maxHealth = stats[cs].maxHealth
    p.currentHealth = stats[cs].hp
    p.damage = stats[cs].damage
    p.precision = stats[cs].precision
    p.crit = stats[cs].crit
    p.dodge = stats[cs].dodge
    p.deflect = stats[cs].deflect
    if (p.weapon === "axe") {
        p.crit += 2;
    } else if (p.weapon === "daggers") {
        p.dodge += 2;
    } else if (p.weapon === "helm") {
        p.precision += 2;
    } else {
        p.deflect += 2;
    }
    document.getElementById("HP" + p.player).value = p.currentHealth
    document.getElementById("HP" + p.player).max = p.maxHealth
}

//random number generator for the rolls
function dieRoll() {
    return Math.floor(Math.random()*12+1);
}

//CHARACTER ACTIONS
//attack
function attack(atk, def) {
    //assigning atk and def vars
    var atkClass = "attack" + atk.player;
    var hitClass = "hit" + def.player;
    var dodgeClass = "dodge" + def.player;
    var deflectClass = "attack" + def.player;
    var deflectHitClass = "hit" + atk.player;
    var dmg = atk.damage;
    var gotHit = false;
    var crit = false;
    //attack rolls
    var p = dieRoll() + atk.precision; //precision roll
    var c = dieRoll() + atk.crit >= 15 ? true : false //crit roll
    var d = dieRoll() + def.dodge > p ? true : false //dodge roll
    var f = c == false && d == false ? dieRoll() + def.deflect >= 15 ? true : false : false//deflect roll

    if (f == true) {
        gameLog.innerHTML = gameLog.innerHTML + `${def.name} deflects the attack doing ${Math.round(dmg/2)} damage to ${atk.name} !<br>`
        gameLog.scrollTop = gameLog.scrollHeight;
        atk.currentHealth -=2;
        document.getElementById(def.player).classList.add(deflectClass);
        document.getElementById(atk.player).classList.add(deflectHitClass)
    } else if (d == true) {
        gameLog.innerHTML = gameLog.innerHTML + `${def.name} dodges the attack ! ${atk.name} is furious !<br>`
        gameLog.scrollTop = gameLog.scrollHeight;
        document.getElementById(atk.player).classList.add(atkClass);
        document.getElementById(def.player).classList.add(dodgeClass);
    } else if (c == true) {
        gameLog.innerHTML = gameLog.innerHTML + `${atk.name} lands a critical hit ! ${Math.round(dmg * 1.5)} damage !<br>`;
        gameLog.scrollTop = gameLog.scrollHeight;
        def.currentHealth -= Math.round(dmg * 1.5)
        document.getElementById(atk.player).classList.add(atkClass);
        document.getElementById(def.player).classList.add(hitClass);
    } else {
        gameLog.innerHTML = gameLog.innerHTML + `${atk.name} hits ${def.name} for ${dmg} damage !<br>`;
        gameLog.scrollTop = gameLog.scrollHeight;
        document.getElementById(atk.player).classList.add(atkClass);
        document.getElementById(def.player).classList.add(hitClass);
        def.currentHealth -= dmg
    }

    if (def.currentHealth <= 0) {
        gameOver(atk, def);
    } else if (atk.currentHealth <= 0) {
        gameOver(def, atk);
    }
    //adjusting health bars
    hp1.value = p1.currentHealth
    hp2.value = p2.currentHealth
    //removing classes
    setTimeout(() => rmvClass(atkClass, hitClass, dodgeClass, deflectClass, deflectHitClass), 1000)
}

function heal(player) {
    if (player.currentHealth < player.maxHealth) {
        var heals = Math.round(Math.random()*10+1)
        player.currentHealth += heals //heals for a random amount between 1 and 10
        if (player.currentHealth >= player.maxHealth) {
            player.currentHealth = player.maxHealth;//avoiding overhealing
            gameLog.innerHTML = gameLog.innerHTML + `${player.name} is back at full health !<br>`
        } else {
        gameLog.innerHTML = gameLog.innerHTML + `${player.name} heals for ${heals} !<br>`;
        }
    } else {
        gameLog.innerHTML = gameLog.innerHTML + `${player.name} cowardly tries to heal at full health ! Nothing happens !<br>`;
    }
    gameLog.scrollTop = gameLog.scrollHeight; 
    hp1.value = p1.currentHealth
    hp2.value = p2.currentHealth
}

function surrender(loser, winner) {
    gameLog.innerHTML = gameLog.innerHTML + `${loser.name} runs away !<br>`;
    gameLog.scrollTop = gameLog.scrollHeight;
    gameOver (winner, loser)
}

function gameOver(winner, loser) {
    document.getElementById(loser.player).classList.add("lost");
    setTimeout(() => {
        document.getElementById(loser.player).classList.add("invisible");
        document.getElementById("winnerTag").innerHTML = `${winner.name} wins !`
        document.getElementById("winnerImg").src = winner.portrait
        document.getElementById("goPop").classList.remove("invisible")
    }, 1500)

    document.querySelectorAll(".goBtn").forEach(btn =>
        btn.addEventListener("click", () => {
            btn.id == "rematch" ? window.location.reload() : document.getElementById("goPop").classList.add("invisible");
        })
    );
}

//refresh char selection info function
function popChar() {
    var e = document.getElementById("classDrop");
    var eValue = e.options[e.selectedIndex].value;
    document.getElementById("charSelfImg").src = portraits[eValue]
    document.getElementById("hp").innerHTML = stats[eValue].hp;
    document.getElementById("dam").innerHTML = stats[eValue].damage;
    document.getElementById("pre").innerHTML = stats[eValue].precision;
    document.getElementById("cri").innerHTML = stats[eValue].crit;
    document.getElementById("dod").innerHTML = stats[eValue].dodge;
    document.getElementById("def").innerHTML = stats[eValue].deflect;
}

//refresh info after selecting a class in the dropdown
document.getElementById("classDrop").addEventListener("change",() => {
    popChar();
});

//submitting the info for player 1
function charSelect() {
    document.getElementById("closeForm").addEventListener("click",() => {
        var inputClass = document.getElementById("classDrop").options[document.getElementById("classDrop").selectedIndex].value;
        var inputWeapon = document.getElementById("itemDrop").options[document.getElementById("itemDrop").selectedIndex].value;
        var inputName = document.getElementById("name").value;
        var portrait = portraits[inputClass];
        if (p1done == false) {
            inputName = inputName == "" ? "Player 1" : inputName;
            p1 = new Clase(inputClass, inputWeapon, inputName, "player1", portrait)
            newClase(p1)
            p1done = true;
            document.getElementById("charSelfImg").classList.add("player2")
        } else {
            inputName = inputName == "" ? "Player 2" : inputName;
            p2 = new Clase(inputClass, inputWeapon, inputName, "player2", portrait)
            newClase(p2)
            p2done = true;
            document.getElementById("infoPop").style.display = "none";
            startGame()
        }
    });
}

function startGame() {
    //display player characters, health bars and game log
    document.querySelector(".player1").src = portraits[p1.clase]
    document.querySelector(".player2").src = portraits[p2.clase]
    document.querySelectorAll("progress").forEach(bar => bar.classList.remove("invisible"));
    document.querySelectorAll(".btnRow").forEach(btn => btn.classList.remove("invisible"))
    document.getElementById("p1name").innerHTML = p1.name;
    document.getElementById("p2name").innerHTML = p2.name;
    takeTurns("activeTurn", "inactiveTurn");
    gameLog.classList.remove("invisible");
    gameLog.innerHTML = `The battle between ${p1.name} the ${p1.clase} and ${p2.name} the ${p2.clase} begins!<br>` 
}

//active player switch
var activeP = 1;
//switch animation function
function takeTurns(add, remove) {
    document.getElementById(`player${activeP}`).classList.add(add);
    document.getElementById(`player${activeP}`).classList.remove(remove);
}
//remove class function
function rmvClass(...params) {
    params.forEach(p => {
        document.getElementById(`player${activeP}`).classList.remove(p);
        activeP == 1 ?
            document.getElementById(`player${activeP + 1}`).classList.remove(p) :
            document.getElementById(`player${activeP - 1}`).classList.remove(p)
    })
}

//listener for actions
document.querySelectorAll(".click").forEach(btn =>
    btn.addEventListener("click", () => {
        if (btn.classList.contains("atkBtn")) {
            activeP == 1 ? attack(p1, p2) : attack(p2, p1);
        } else if (btn.classList.contains("hlBtn")) {
            activeP == 1 ? heal(p1) : heal(p2);
        } else if (btn.classList.contains("gOver")){
            activeP == 1 ? surrender(p1, p2) : surrender(p2, p1);               
        }
    setTimeout(() => {
        takeTurns("inactiveTurn", "activeTurn");
        activeP == 1 ? //is this necessary?
            document.querySelector("." + p1.player).style.animation = ""
            : document.querySelector("." + p2.player).style.animation = ""
        activeP = activeP == 1 ? 2 : 1;
        takeTurns("activeTurn", "inactiveTurn");
        }, 1000)
    })
);

popChar();
charSelect();