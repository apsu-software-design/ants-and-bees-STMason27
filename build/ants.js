/**
 * This class is responsible for the bones of the insects within the game, both ants and bees. All groundwork for functionality occurs here for the ants and bees. 
 */

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardAnt = exports.ScubaAnt = exports.EaterAnt = exports.ThrowerAnt = exports.GrowerAnt = exports.Ant = exports.Bee = exports.Insect = void 0;
var game_1 = require("./game");
var Insect = (function () {
    function Insect(armor, place) {
        this.armor = armor;
        this.place = place;
    }
    Insect.prototype.getName = function () { return this.name; };
    Insect.prototype.getArmor = function () { return this.armor; };
    Insect.prototype.getPlace = function () { return this.place; };
    Insect.prototype.setPlace = function (place) { this.place = place; };
    Insect.prototype.reduceArmor = function (amount) {
        this.armor -= amount;
        if (this.armor <= 0) {
            console.log(this.toString() + ' ran out of armor and expired');
            this.place.removeInsect(this);
            return true;
        }
        return false;
    };
    Insect.prototype.toString = function () {
        return this.name + '(' + (this.place ? this.place.name : '') + ')';
    };
    return Insect;
}());
exports.Insect = Insect;
var Bee = (function (_super) {
    __extends(Bee, _super);
    function Bee(armor, damage, place) {
        var _this = _super.call(this, armor, place) || this;
        _this.damage = damage;
        _this.name = 'Bee';
        return _this;
    }
    Bee.prototype.sting = function (ant) {
        console.log(this + ' stings ' + ant + '!');
        return ant.reduceArmor(this.damage);
    };
    Bee.prototype.isBlocked = function () {
        return this.place.getAnt() !== undefined;
    };
    Bee.prototype.setStatus = function (status) { this.status = status; };
    Bee.prototype.act = function () {
        if (this.isBlocked()) {
            if (this.status !== 'cold') {
                this.sting(this.place.getAnt());
            }
        }
        else if (this.armor > 0) {
            if (this.status !== 'stuck') {
                this.place.exitBee(this);
            }
        }
        this.status = undefined;
    };
    return Bee;
}(Insect));
exports.Bee = Bee;
/**
 * This is the base class for the ants. Armor, foodCost, and place are determined here via constructor, getter and setter. 
 */
var Ant = (function (_super) {
    __extends(Ant, _super);
    function Ant(armor, foodCost, place) {
        if (foodCost === void 0) { foodCost = 0; }
        var _this = _super.call(this, armor, place) || this;
        _this.foodCost = foodCost;
        return _this;
    }
    Ant.prototype.getFoodCost = function () { return this.foodCost; };
    Ant.prototype.setBoost = function (boost) {
        this.boost = boost;
        console.log(this.toString() + ' is given a ' + boost);
    };
    return Ant;
}(Insect));
exports.Ant = Ant;
/**
 * The GrowerAnt. This class supersedes ant class. 
 */
var GrowerAnt = (function (_super) {
    __extends(GrowerAnt, _super);
    function GrowerAnt() {
        var _this = _super.call(this, 1, 1) || this;
        _this.name = "Grower";
        return _this;
    }
    GrowerAnt.prototype.act = function (colony) {
        var roll = Math.random();
        if (roll < 0.6) {
            colony.increaseFood(1);
        }
        else if (roll < 0.7) {
            colony.addBoost('FlyingLeaf');
        }
        else if (roll < 0.8) {
            colony.addBoost('StickyLeaf');
        }
        else if (roll < 0.9) {
            colony.addBoost('IcyLeaf');
        }
        else if (roll < 0.95) {
            colony.addBoost('BugSpray');
        }
    };
    return GrowerAnt;
}(Ant));
exports.GrowerAnt = GrowerAnt;
/**
 * The ThrowerAnt. This class supersedes ant class. 
 */
var ThrowerAnt = (function (_super) {
    __extends(ThrowerAnt, _super);
    function ThrowerAnt() {
        var _this = _super.call(this, 1, 4) || this;
        _this.name = "Thrower";
        _this.damage = 1;
        return _this;
    }
    ThrowerAnt.prototype.act = function () {
        if (this.boost !== 'BugSpray') {
            var target = void 0;
            if (this.boost === 'FlyingLeaf')
                target = this.place.getClosestBee(5);
            else
                target = this.place.getClosestBee(3);
            if (target) {
                console.log(this + ' throws a leaf at ' + target);
                target.reduceArmor(this.damage);
                if (this.boost === 'StickyLeaf') {
                    target.setStatus('stuck');
                    console.log(target + ' is stuck!');
                }
                if (this.boost === 'IcyLeaf') {
                    target.setStatus('cold');
                    console.log(target + ' is cold!');
                }
                this.boost = undefined;
            }
        }
        else {
            console.log(this + ' sprays bug repellant everywhere!');
            var target = this.place.getClosestBee(0);
            while (target) {
                target.reduceArmor(10);
                target = this.place.getClosestBee(0);
            }
            this.reduceArmor(10);
        }
    };
    return ThrowerAnt;
}(Ant));
exports.ThrowerAnt = ThrowerAnt;
/**
 * The EatherAnt. This class supersedes ant class. 
 */
var EaterAnt = (function (_super) {
    __extends(EaterAnt, _super);
    function EaterAnt() {
        var _this = _super.call(this, 2, 4) || this;
        _this.name = "Eater";
        _this.turnsEating = 0;
        _this.stomach = new game_1.Place('stomach');
        return _this;
    }
    EaterAnt.prototype.isFull = function () {
        return this.stomach.getBees().length > 0;
    };
    EaterAnt.prototype.act = function () {
        console.log("eating: " + this.turnsEating);
        if (this.turnsEating == 0) {
            console.log("try to eat");
            var target = this.place.getClosestBee(0);
            if (target) {
                console.log(this + ' eats ' + target + '!');
                this.place.removeBee(target);
                this.stomach.addBee(target);
                this.turnsEating = 1;
            }
        }
        else {
            if (this.turnsEating > 3) {
                this.stomach.removeBee(this.stomach.getBees()[0]);
                this.turnsEating = 0;
            }
            else
                this.turnsEating++;
        }
    };
    EaterAnt.prototype.reduceArmor = function (amount) {
        this.armor -= amount;
        console.log('armor reduced to: ' + this.armor);
        if (this.armor > 0) {
            if (this.turnsEating == 1) {
                var eaten = this.stomach.getBees()[0];
                this.stomach.removeBee(eaten);
                this.place.addBee(eaten);
                console.log(this + ' coughs up ' + eaten + '!');
                this.turnsEating = 3;
            }
        }
        else if (this.armor <= 0) {
            if (this.turnsEating > 0 && this.turnsEating <= 2) {
                var eaten = this.stomach.getBees()[0];
                this.stomach.removeBee(eaten);
                this.place.addBee(eaten);
                console.log(this + ' coughs up ' + eaten + '!');
            }
            return _super.prototype.reduceArmor.call(this, amount);
        }
        return false;
    };
    return EaterAnt;
}(Ant));
exports.EaterAnt = EaterAnt;
/**
 * The ScubaAnt. This class supersedes ant class. 
 */
var ScubaAnt = (function (_super) {
    __extends(ScubaAnt, _super);
    function ScubaAnt() {
        var _this = _super.call(this, 1, 5) || this;
        _this.name = "Scuba";
        _this.damage = 1;
        return _this;
    }
    ScubaAnt.prototype.act = function () {
        if (this.boost !== 'BugSpray') {
            var target = void 0;
            if (this.boost === 'FlyingLeaf')
                target = this.place.getClosestBee(5);
            else
                target = this.place.getClosestBee(3);
            if (target) {
                console.log(this + ' throws a leaf at ' + target);
                target.reduceArmor(this.damage);
                if (this.boost === 'StickyLeaf') {
                    target.setStatus('stuck');
                    console.log(target + ' is stuck!');
                }
                if (this.boost === 'IcyLeaf') {
                    target.setStatus('cold');
                    console.log(target + ' is cold!');
                }
                this.boost = undefined;
            }
        }
        else {
            console.log(this + ' sprays bug repellant everywhere!');
            var target = this.place.getClosestBee(0);
            while (target) {
                target.reduceArmor(10);
                target = this.place.getClosestBee(0);
            }
            this.reduceArmor(10);
        }
    };
    return ScubaAnt;
}(Ant));
exports.ScubaAnt = ScubaAnt;
/**
 * The GuardAnt. This class supersedes ant class. 
 */
var GuardAnt = (function (_super) {
    __extends(GuardAnt, _super);
    function GuardAnt() {
        var _this = _super.call(this, 2, 4) || this;
        _this.name = "Guard";
        return _this;
    }
    GuardAnt.prototype.getGuarded = function () {
        return this.place.getGuardedAnt();
    };
    GuardAnt.prototype.act = function () { };
    return GuardAnt;
}(Ant));
exports.GuardAnt = GuardAnt;
//# sourceMappingURL=ants.js.map