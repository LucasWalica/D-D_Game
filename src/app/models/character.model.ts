
export class Spell {
    name:string;
    dmg:number;
    img:string;
    buff_hp:number;
    buff_dmg:number;
    turn_start_spell:number;
    cooldown_turns_spell:number;
    duration:number;
    
    constructor(
        name:string, dmg:number, img:string, 
        buff_hp:number,buff_dmg:number , 
        turn_start_spell:number,cooldown_turns_spell:number,
        duration:number
    ){
        this.name= name;
        this.dmg = dmg;
        this.img = img;
        this.buff_hp = buff_hp;
        this.buff_dmg = buff_dmg;
        this.turn_start_spell = turn_start_spell;
        this.cooldown_turns_spell = cooldown_turns_spell;
        this.duration = duration;
    }


}


export const allSpell:Spell[]= [
    new Spell("Orbe celestial", 30, "Mythril Age Icons 2/double-ringed-orb_4.png", 40, 20, 0, 6, 4),
    new Spell("Orbe luminoso", 10, "Mythril Age Icons 2/double-ringed-orb.png", 20, 0, 0, 5, 4),
    new Spell("Daga sigilosa",  150, "Mythril Age Icons 2/dripping-knife_1.png", 0, 0, 0, 5, 0),
    new Spell("Veneno curador", 0, "Mythril Age Icons 2/dripping-knife_2.png", 20, 5, 0, 5, 3),
    new Spell("Veneno maestro", 0, "Mythril Age Icons 2/dripping-knife_3.png", 0, 80, 0, 10, 3),
    new Spell("Veneno barato", 0, "Mythril Age Icons 2/dripping-knife_4.png", 0, 40, 0, 3, 3),
    new Spell("Estallido de oscuridad", 40, "Mythril Age Icons 2/expanded-rays_2.png", 0, 20, 0, 10, 3),
    new Spell("Frio Invernal", 20, "Mythril Age Icons 2/expanded-rays_3.png", 0, 20, 0, 20, 10),
    new Spell("Magia de sangre", 30, "Mythril Age Icons 2/explosion-rays_4.png", 0, 10, 0, 5, 2),
    new Spell("Curación demoniaca", 1, "Mythril Age Icons 2/expanded-rays.png", 20, 5, 0, 5, 1),
    new Spell("Luz de druida", 5, "Mythril Age Icons 2/explosion-rays_2.png", 10, 5, 0, 5, 3),
    new Spell("Plasma imperial", 40, "Mythril Age Icons 2/explosion-rays_3.png",  0, 0, 0, 5, 1),
    new Spell("Luz de luna", 20, "Mythril Age Icons 2/explosion-rays_4.png", 10, 20, 0, 5, 10),
    new Spell("Luz Solar", 0, "Mythril Age Icons 2/explosion-rays.png", 5, 5, 0, 5, 3),
    new Spell("Super curación en area", 0 , "Mythril Age Icons 2/heart-wings_2.png", 30, 0, 0, 5, 1),
    new Spell("Curación simple", 0 , "Mythril Age Icons 2/heart-wings_3.png", 20, 0, 0, 2, 0),
    new Spell("curación en area por turnos", 0, "Mythril Age Icons 2/heart-wings_4.png", 10, 0, 0, 1, 4),
    new Spell("Curación única", 0, "Mythril Age Icons 2/heart-wings.png", 40, 0, 0 ,3, 1),
    new Spell("Magia de rayo", 40, "Mythril Age Icons 2/spell-cast-bolt.png", 0, 0, 0 , 3, 1),
    new Spell("Magia de fuego", 30, "Mythril Age Icons 2/spell-cast-fire.png", 0, 0, 0, 1, 1),
    new Spell("Magia de hielo", 10, "Mythril Age Icons 2/spell-cast-ice.png", 0, 5, 0, 4, 3),
    new Spell("Magia de bosque", 20, "Mythril Age Icons 2/spell-cast-plant.png", 0, 0, 0 , 1, 1),
    new Spell("Capa de plumas", 0, "Mythril Age Icons 2/wing-cloak.png", 20, 20, 0, 10, 5),
]

export class Character {
  // Id para diferenciar personajes iguales
    id:number= {} as number;
    name:string;
    img:string;
    lvl:number;
    hp:number;
    dmg:number;
    alcance:number;
    spell:Spell[];
    moved:boolean; 
    moveTiles:number;
    // add position

    constructor(
        name:string, img:string, lvl:number, 
        hp:number, dmg:number, alcance:number, 
        spell:Spell[], moved:boolean, moveTiles:number
    ){
        this.name = name; 
        this.img = img;
        this.lvl = lvl;
        this.hp = hp;
        this.dmg = dmg; 
        this.alcance = alcance;
        this.spell = spell;
        this.moved = moved;
        this.moveTiles = moveTiles;
    }


}

export const demonCharacters: Character[] = [
  new Character("Demonio cornudo", "assets/basic_demon_animations/antlered rascal/AntleredRascal.gif", 1, 150, 25, 1, [
    allSpell.find(s => s.name === "Magia de fuego")!
  ], false, 3),

  new Character("Demonio con garras", "assets/basic_demon_animations/clawed abomination/ClawedAbomination.gif", 1, 120, 38, 1, [], false, 3),

  new Character("Diablillo", "assets/basic_demon_animations/crimson imp/CrimsonImp.gif", 1, 60, 20, 1, [
    allSpell.find(s => s.name === "Veneno maestro")!,
    allSpell.find(s => s.name === "Veneno barato")!
  ], false, 3),

  new Character("Demonio de Acero", "assets/basic_demon_animations/Depraved Blackguard/DepravedBlackguard.gif", 1, 240, 30, 1, [], false, 3),

  new Character("Diablillo negro", "assets/basic_demon_animations/fledgling demon/FledglingDemon.gif", 1, 100, 30, 2, [
    allSpell.find(s => s.name === "Magia de oscuridad")!,
  ], false, 3),

  new Character("Ojo volador", "assets/basic_demon_animations/floating eye/FloatingEye.gif", 1, 130, 25, 3, [
    allSpell.find(s => s.name === "Estallido de oscuridad")!,
    allSpell.find(s => s.name === "Magia de rayo")!
  ], false, 3),

  new Character("Minotauro", "assets/basic_demon_animations/foul gouger/FoulGouger.gif", 1, 300, 22, 1, [], false, 3),

  new Character("Demonio negro", "assets/basic_demon_animations/pointed demonspawn/PointedDemonspawn.gif", 1, 130, 25, 1, [
    allSpell.find(s => s.name === "Daga sigilosa")!
  ], false, 3),

  new Character("Fantasma de la niebla", "assets/basic_demon_animations/skewering stalker/SkeweringStalker.gif", 1, 100, 20, 2, [
    allSpell.find(s => s.name === "Curación demoniaca")!,
    allSpell.find(s => s.name === "Magia de sangre")!
  ], false, 3),

  new Character("Demonio molesto", "assets/basic_demon_animations/tainted scoundrel/TaintedScoundrel.gif", 1, 110, 24, 2, [
    allSpell.find(s => s.name === "Veneno curador")!
  ], false, 3),

  new Character("Calavera espectral", "assets/basic_demon_animations/warp skull/WarpSkull.gif", 1, 170, 35, 3, [
    allSpell.find(s => s.name === "Luz de luna")!
  ], false, 3),
];

export const humanoidCharacters: Character[] = [
  new Character("Lizardfolk bestial", "assets/Basic Humanoid Animations/bestial lizardfolk/BestialLizardfolk.gif", 1, 160, 26, 1, [], false, 3),
  new Character("Jinete goblin", "assets/Basic Humanoid Animations/goblin wolf rider/GoblinWolfRider.gif", 1, 100, 24, 2, [findSpell("Magia de bosque")], false, 3),
  new Character("Arquero goblin", "assets/Basic Humanoid Animations/goblin archer/GoblinArcher.gif", 1, 65, 34, 3, [], false, 3),
  new Character("Fanático goblin", "assets/Basic Humanoid Animations/goblin fanatic/GoblinFanatic.gif", 1, 80, 28, 2, [findSpell("Magia de sangre")], false, 3),
  new Character("Luchador goblin", "assets/Basic Humanoid Animations/goblin fighter/GoblinFighter.gif", 1, 120, 26, 1, [], false, 3),
  new Character("Ocultista goblin", "assets/Basic Humanoid Animations/goblin occultist/GoblinOccultist.gif", 1, 80, 20, 3, [findSpell("Orbe celestial"), findSpell("Estallido de oscuridad")], false, 3),

  new Character("Asesino halfling", "assets/Basic Humanoid Animations/halfling assassin/HalflingAssassin.gif", 1, 70, 34, 1, [findSpell("Daga sigilosa"), findSpell("Veneno maestro")], false, 3),
  new Character("Bardo halfling", "assets/Basic Humanoid Animations/halfling bard/HalflingBard.gif", 1, 80, 22, 2, [findSpell("Luz de druida"), findSpell("curación en area por turnos")], false, 3),
  new Character("Explorador halfling", "assets/Basic Humanoid Animations/halfling ranger/HalflingRanger.gif", 1, 95, 24, 3, [findSpell("Luz de luna")], false, 3),
  new Character("Pícaro halfling", "assets/Basic Humanoid Animations/halfling rogue/HalflingRogue.gif", 1, 70, 28, 1, [findSpell("Veneno curador")], false, 3),
  new Character("Lancero halfling", "assets/Basic Humanoid Animations/halfling slinger/HalflingSlinger.gif", 1, 80, 25, 3, [], false, 3),

  new Character("Arquero lizardfolk", "assets/Basic Humanoid Animations/lizardfolk archer/LizardfolkArcher.gif", 1, 100, 30, 3, [], false, 3),
  new Character("Gladiador lizardfolk", "assets/Basic Humanoid Animations/lizardfolk gladiator/LizardfolkGladiator.gif", 1, 180, 30, 1, [], false, 3),
  new Character("Explorador lizardfolk", "assets/Basic Humanoid Animations/lizardfolk scout/LizardfolkScout.gif", 1, 110, 20, 2, [findSpell("Luz solar")], false, 3),
  new Character("Lancero lizardfolk", "assets/Basic Humanoid Animations/lizardfolk spearman/LizardfolkSpearman.gif", 1, 120, 24, 2, [findSpell("Veneno barato")], false, 3),
];


export const monsterCharacters: Character[] = [
  new Character("Grimlock ciego", "assets/Basic Monster Animations/Blinded Grimlock/BlindedGrimlock.gif", 1, 160, 26, 1, [findSpell("Estallido de oscuridad")], false, 3),
  new Character("Cíclope aplastante", "assets/Basic Monster Animations/Crushing Cyclops/CrushingCyclops.gif", 1, 350, 32, 1, [], false, 3),
  new Character("Slaad turbio", "assets/Basic Monster Animations/Murky Slaad/MurkySlaad.gif", 1, 220, 28, 1, [findSpell("Veneno barato")], false, 3),
  new Character("Hongo chillón", "assets/Basic Monster Animations/Shrieker Mushroom/ShriekerMushroom.gif", 1, 110, 22, 1, [findSpell("Luz de druida")], false, 3),

  new Character("Ojo inyectado en sangre", "assets/Basic Monster Animations/Bloodshot Eye/BloodshotEye.gif", 1, 90, 38, 3, [findSpell("Orbe celestial")], false, 3),
  new Character("Baba de la muerte", "assets/Basic Monster Animations/Death Slime/DeathSlime.gif", 1, 170, 24, 1, [], false, 3),
  new Character("Gelatina ocre", "assets/Basic Monster Animations/Ochre Jelly/OchreJelly.gif", 1, 180, 20, 1, [findSpell("Magia de sangre")], false, 3),
  new Character("Trol de piedra", "assets/Basic Monster Animations/Stone Troll/StoneTroll.gif", 1, 300, 30, 1, [findSpell("curación en area por turnos")], false, 3),

  new Character("Ogro musculoso", "assets/Basic Monster Animations/Brawny Ogre/BrawnyOgre.gif", 1, 250, 27, 1, [], false, 3),
  new Character("Miconido fúngico", "assets/Basic Monster Animations/Fungal Myconid/FungalMyconid.gif", 1, 140, 26, 1, [findSpell("Luz de luna")], false, 3),
  new Character("Vigilante ocular", "assets/Basic Monster Animations/Ocular Watcher/OcularWatcher.gif", 1, 110, 32, 3, [findSpell("Orbe celestial")], false, 3),
  new Character("Trol del pantano", "assets/Basic Monster Animations/Swamp Troll/SwampTroll.gif", 1, 250, 28, 1, [findSpell("Veneno barato")], false, 3),

  new Character("Slaad carmesí", "assets/Basic Monster Animations/Crimson Slaad/CrimsonSlaad.gif", 1, 190, 32, 1, [findSpell("Magia de sangre")], false, 3),
  new Character("Ettin gigantesco", "assets/Basic Monster Animations/Humongous Ettin/HumongousEttin.gif", 1, 370, 36, 1, [], false, 3),
  new Character("Gorro rojo", "assets/Basic Monster Animations/Red Cap/RedCap.gif", 1, 120, 28, 2, [findSpell("Veneno barato")], false, 3),
];


function findSpell(name: string): Spell {
  return allSpell.find(s => s.name === name)!;
}


