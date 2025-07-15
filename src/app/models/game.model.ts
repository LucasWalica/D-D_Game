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
        if (!this.dungeon.isValidMove(curX, curY, newX, newY, character)) return false;
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
        this.dungeon.enemyParties.characters.forEach(char => this.accionNPC(char, this.dungeon.playerParty));
        this.turno++;
    }


    accionNPC(npc: Character, playerParty: Party): void {
        const posNPC = this.dungeon.getCharacterPosition(npc);
        if (!posNPC) return;

        const hechizosListos = Array.isArray(npc.spell)
            ? npc.spell.filter(spell =>
                spell &&
                typeof spell.turn_start_spell === 'number' &&
                typeof spell.cooldown_turns_spell === 'number' &&
                this.turno >= spell.turn_start_spell + spell.cooldown_turns_spell
            )
            : [];

        const enemigosVivos = playerParty.characters.filter(e => e.hp > 0);
        const enemigosConPos = enemigosVivos
            .map(e => ({ char: e, pos: this.dungeon.getCharacterPosition(e) }))
            .filter(ep => ep.pos !== null) as { char: Character; pos: { x: number; y: number } }[];

        // Ordenar por distancia para decidir prioridades (más cercanos primero)
        enemigosConPos.sort((a, b) => {
            const distA = Math.max(Math.abs(a.pos.x - posNPC.x), Math.abs(a.pos.y - posNPC.y));
            const distB = Math.max(Math.abs(b.pos.x - posNPC.x), Math.abs(b.pos.y - posNPC.y));
            return distA - distB;
        });

        // Intentar lanzar hechizo si hay alguno listo y el objetivo está en alcance
        for (const spell of hechizosListos) {
            for (const enemigo of enemigosConPos) {
            const distX = Math.abs(enemigo.pos.x - posNPC.x);
            const distY = Math.abs(enemigo.pos.y - posNPC.y);
            const distancia = Math.max(distX, distY); // Alcance con diagonales

            if (distancia <= npc.alcance) {
                playerParty.lanzarHechizo(npc, spell, enemigo.char);
                this.handleGameDeath(enemigo.char)
                console.log(`${npc.name} lanza hechizo ${spell.name} a ${enemigo.char.name} ${distancia} lanzado`);
                spell.turn_start_spell = this.turno;
                return;
                }
            }
        }

        // Intentar ataque físico si hay un enemigo en alcance
        for (const enemigo of enemigosConPos) {
            if (this.dungeon.canAttack(npc, enemigo.char)) {
            playerParty.ataque(npc, enemigo.char);
            this.handleGameDeath(enemigo.char);
            console.log(`${npc.name} ataca a ${enemigo.char.name}`);
            return;
            }
        }

        // Si no puede atacar ni lanzar hechizo, moverse hacia el enemigo más cercano
        if (enemigosConPos.length > 0 && npc.moveTiles > 0) {
            const objetivo = enemigosConPos[0];
            const deltaX = objetivo.pos.x - posNPC.x;
            const deltaY = objetivo.pos.y - posNPC.y;

            // Normalizar dirección (1, 0, -1)
            const dirX = deltaX !== 0 ? deltaX / Math.abs(deltaX) : 0;
            const dirY = deltaY !== 0 ? deltaY / Math.abs(deltaY) : 0;

            // Calcular siguiente paso dentro de rango de movimiento
            for (let i = 1; i <= npc.moveTiles; i++) {
            const stepX = posNPC.x + dirX * i;
            const stepY = posNPC.y + dirY * i;

            if (this.dungeon.isValidMove(posNPC.x, posNPC.y, stepX, stepY, npc)) {
                this.moverPersonaje(npc, stepX, stepY);
                console.log(`${npc.name} se mueve hacia ${objetivo.char.name}`);
                return;
                }
            }
        }
    }


    handleGameDeath(char:Character){
        if(this.dungeon.playerParty.handleDeath(char)){
            const  pos = this.dungeon.getCharacterPosition(char)
            if(pos){
                this.dungeon.casillas[pos.x][pos.y].character = null;
            }
        }
    }


    
}