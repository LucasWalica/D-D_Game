import { Character, Spell } from "./character.model";

export class Party {
  characters: Character[];
  deadCharacters: Character[];
  activeEffects: any[];

  constructor(characters: Character[], deadCharacters: Character[], activeEffects: any[]) {
    this.characters = characters;
    this.deadCharacters = deadCharacters;
    this.activeEffects = activeEffects;
  }

  isAlive(character: Character): boolean {
    return character.hp > 0;
  }

  handleDeath(character: Character):boolean {
    if (character.hp <= 0) {
      character.hp = 0;
      // Remover de vivos
      this.characters = this.characters.filter(c => c !== character);
      // Agregar a muertos
      this.deadCharacters.push(character);
      return true;
      // Aquí puedes limpiar efectos activos relacionados con este personaje
    }
    return false;
  }

  ataque(atacante: Character, objetivo: Character): boolean {
    if(atacante.moved){
        return false;
    }
    objetivo.hp -= atacante.dmg;
    this.handleDeath(objetivo);
    return true;
  }

  lanzarHechizo(lanzador: Character, hechizo: Spell, objetivo: Character | null): boolean {
    if(lanzador.moved){
        return false;
    }
    if (hechizo.dmg > 0 && objetivo) {
      objetivo.hp -= hechizo.dmg;
      this.handleDeath(objetivo);
    }
    if (hechizo.buff_hp !== 0 && objetivo) {
      objetivo.hp += hechizo.buff_hp;
      // Opcional: limitar hp máximo
    }
    if (hechizo.buff_dmg !== 0 && objetivo) {
      objetivo.dmg += hechizo.buff_dmg;
    }

    return true;
  }


    // funcion que asigna personajes aleatorios a la party
    // usado para parties de enemigos en mazmorras
    static generateRandomParty(charArray:Character[], numberOfCharacters:number):Character[]{
        let charactersToParty:Character[] = [] as Character[];
        for(let i=0; i<numberOfCharacters; i++){
            charactersToParty.push(charArray[Math.floor(Math.random()*charArray.length)])
            charactersToParty[i].id = i;
        }
        return charactersToParty;
    }
}
