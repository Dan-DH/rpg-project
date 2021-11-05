//Use this script to generate your character
export class Clase {
    constructor(clase, weapon, name) {
        this.clase = clase;
        this.weapon = weapon;
        this.name = name;
        //Basic stats
        this.currentHealth = 0;
        this.maxHealth = 0;
        this.damage = 0;
        this.precision = 0;
        this.crit = 0;
        this.dodge = 0;
        this.deflect = 0;
        //Extra mile stats
        this.DmgInflicted = 0;
        this.DmgTaken = 0;
        this.DmgHealed = 0;
        //Char functions
        this.attack = function(){};
        this.heal = function(){};
        this.surrender = function(){};
    }
}

/* export class Assassin extends Person {
    constructor(clase, item, name) {
        super(clase, item, name)
        this.clase = clase;
        this.item = item;
        //Basic stats
        this.currenthealth = 50;
        this.maxHealth = 50;
        this.damage = 3;
        this.precision = 5;
        this.crit = 5;
        this.dodge = 4;
        this.deflect = -2;
    }
} */
