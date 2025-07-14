import { Character } from "./character.model";
import { Dungeon } from "./dungeon.model";
import { Party } from "./party.model";

export class Game{
    dungeon:Dungeon;
    turno:number=0;


    constructor(dungeon:Dungeon){
        this.dungeon = dungeon;
    }



   moverPersonaje(character: Character, newX: number, newY: number): boolean {
    // Buscar casilla actual donde está el personaje
    const pos = this.dungeon.getCharacterPosition(character);

    if (pos !== null) {
        const { x: curX, y: curY } = pos;
        if (!this.dungeon.isValidMove(curX, curY, newX, newY)) return false;
            // Actualizar casillas: sacar personaje de la vieja casilla y poner en la nueva
            this.dungeon.casillas[curY][curX].character = null;
            this.dungeon.casillas[newY][newX].character = character;
            return true;
        } else {
            // el personaje no está en el mapa, manejar error o caso especial
            return false;
        }
    }


    pasarTurno(){
        this.dungeon.playerParty.characters.forEach(char => char.moved=false);
        this.dungeon.enemyParties.characters.forEach(char => char.moved = false);
        this.dungeon.enemyParties.characters.forEach(char => this.accionNPC(char, this.dungeon.enemyParties));
        this.turno++;
    }



    accionNPC(npc: Character, enemigoParty: Party): void {
    const posNPC = this.dungeon.getCharacterPosition(npc);
    if (!posNPC) return;

    // 1. Filtrar hechizos que están listos para usar (cooldown terminado)
    const hechizosListos = npc.spell.filter(spell => 
        this.turno >= spell.turn_start_spell + spell.cooldown_turns_spell
    );

    // 2. Buscar enemigos vivos y sus posiciones
    const enemigosVivos = enemigoParty.characters.filter(e => e.hp > 0);
    const enemigosConPos = enemigosVivos
        .map(e => ({ char: e, pos: this.dungeon.getCharacterPosition(e) }))
        .filter(ep => ep.pos !== null) as { char: Character; pos: { x:number; y:number } }[];

    // 3. Si hay hechizos listos, elegir uno aleatoriamente y un objetivo válido (puedes agregar lógica más compleja)
    if (hechizosListos.length > 0 && enemigosConPos.length > 0) {
        const spell = hechizosListos[Math.floor(Math.random() * hechizosListos.length)];
        
        // Para simplificar, eliges un objetivo aleatorio
        const objetivoHechizo = enemigosConPos[Math.floor(Math.random() * enemigosConPos.length)].char;
        
        enemigoParty.lanzarHechizo(npc, spell, objetivoHechizo);
        // Actualiza el turno del último uso del hechizo
        spell.turn_start_spell = this.turno;

        return; // solo una acción
    }

    // 4. Intentar atacar enemigo cercano
    for (const enemigo of enemigosConPos) {
        const distX = Math.abs(enemigo.pos.x - posNPC.x);
        const distY = Math.abs(enemigo.pos.y - posNPC.y);
        const distancia = distX + distY;

        if (distancia <= npc.alcance) {
        enemigoParty.ataque(npc, enemigo.char);
        return; // acción hecha, fin turno NPC
        }
    }

    // 5. Moverse hacia enemigo más cercano (si no pudo atacar ni lanzar hechizo)
    if (enemigosConPos.length > 0) {
        // Buscar enemigo más cercano
        let objetivoMover = enemigosConPos[0];
        let minDist = Math.abs(objetivoMover.pos.x - posNPC.x) + Math.abs(objetivoMover.pos.y - posNPC.y);

        for (const enemigo of enemigosConPos) {
        const distX = Math.abs(enemigo.pos.x - posNPC.x);
        const distY = Math.abs(enemigo.pos.y - posNPC.y);
        const distancia = distX + distY;
        if (distancia < minDist) {
            minDist = distancia;
            objetivoMover = enemigo;
        }
        }

        // Calcular movimiento de un paso hacia el objetivo
        let stepX = posNPC.x;
        let stepY = posNPC.y;

        if (objetivoMover.pos.x > posNPC.x) stepX++;
        else if (objetivoMover.pos.x < posNPC.x) stepX--;

        if (objetivoMover.pos.y > posNPC.y) stepY++;
        else if (objetivoMover.pos.y < posNPC.y) stepY--;

        if (this.dungeon.isValidMove(posNPC.x, posNPC.y, stepX, stepY)) {
        this.moverPersonaje(npc, stepX, stepY);
        }
    }
}





    


}