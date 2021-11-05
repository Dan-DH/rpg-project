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
        hp: 75,
        maxHealth : 75,
        damage : 6,
        precision : 3,
        crit : 2,
        dodge : 2,
        deflect : 2
    },
    monk: {
        hp: 50,
        maxHealth : 50,
        damage : 2,
        precision : 6,
        crit : 0,
        dodge : 1,
        deflect : 6
    },
}

function newClase(p) {
    var cs = p.clase
    p.hp = stats[cs].hp
    p.maxHealth = stats[cs].maxHealth
    p.currentHealth = stats[cs].maxHealth
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
}

//didn't use these in the end
var inputClass;
var inputWeapon;
var inputName;

//settings vars for player selection
var p1
var p2
var p1done = false
var p2done = false

//hidding health bars until game starts
document.querySelectorAll("progress").forEach(bar => bar.style.visibility = "hidden")

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
    popChar();
    document.getElementById("infoPop").style.display = "inherit";
    document.getElementById("closeForm").addEventListener("click",() => {
        var pClass = document.getElementById("classDrop").options[document.getElementById("classDrop").selectedIndex].value;
        var pNam = document.getElementById("itemDrop").options[document.getElementById("itemDrop").selectedIndex].value;
        var pWep = document.getElementById("name").value;
        if (p1done == false) {
            p1 = new Clase(pClass, pNam, pWep)
            newClase(p1)
            p1done = true;
            document.getElementById("charSelfImg").classList.add("player2")
        } else {
            p2 = new Clase(pClass, pNam, pWep)
            newClase(p2)
            p2done = true;
        }
        document.getElementById("infoPop").style.display = "none";
        p2done == true ? startGame() : setTimeout(charSelect, 500)
    });
}

charSelect()

function startGame() {
    //add player characters and health bars
    document.querySelector(".player1").src = portraits[p1.clase]
    document.querySelector(".player2").src = portraits[p2.clase]
    document.querySelectorAll("progress").forEach(bar => bar.style.visibility = "visible");
    document.getElementById("p1name").innerHTML = p1.name;
    document.getElementById("p2name").innerHTML = p2.name;
    //start first turn
    playerTurn();
}

function playerTurn() {
//animate the transform
}

