import { Character } from "./character.model";
import { Party } from "./party.model";




export enum CasillaType {
  FLOOR = 'floor',           // piso normal por donde se camina
  WALL = 'wall',             // pared/inaccesible
  DOOR = 'door',             // puerta (puede ser abierta o cerrada)
  TRAP = 'trap',             // trampa decorativa o funcional
  TREASURE = 'treasure',     // casilla con tesoro
  ENTRANCE = 'entrance',     // entrada al dungeon
  EXIT = 'exit',             // salida del dungeon
  WATER = 'water',           // agua (puede o no ser accesible)
  LAVA = 'lava',             // lava (decorativa o dañina)
  ALTAR = 'altar',           // punto especial para buffs o lore
  VOID = 'void',             // fuera del mapa (opcional)
}

export class Casilla {
    character?:Character|null;
    type:CasillaType;
    
  constructor(type: CasillaType, character?: Character | null) {
    this.type = type;
    this.character = character ?? null;
  }
}

export class Dungeon{
    enemyParties:Party;
    playerParty:Party;
    xDimension:number;
    yDimension:number;
    casillas:Casilla[][];

  constructor(x: number, y: number, playerParty: Party, enemyParties: Party) {
    this.xDimension = x;
    this.yDimension = y;
    this.playerParty = playerParty;
    this.enemyParties = enemyParties;
    this.casillas = Array.from({ length: y }, () =>
      Array.from({ length: x }, () => new Casilla(CasillaType.FLOOR))
    );
  }

   // Método para encontrar la posición (x,y) de un personaje
  getCharacterPosition(character: Character): {x:number, y:number} | null {
    for(let y=0; y<this.yDimension; y++){
      for(let x=0; x<this.xDimension; x++){
        if(this.casillas[y][x].character === character){
          return {x, y};
        }
      }
    }
    return null;
  }

  isValidMove(curX: number, curY: number, newX: number, newY: number, char: Character): boolean {
    // 1. Verificar límites del mapa
    if (newX < 0 || newX >= this.xDimension || newY < 0 || newY >= this.yDimension) {
      return false;
    }

    const casillaDestino = this.casillas[newY][newX];

    // 2. La casilla debe ser transitable
    if (casillaDestino.type === CasillaType.WALL) return false;
    if (casillaDestino.character) return false;

    // 3. Calcular distancia entre origen y destino (distancia de Chebyshev para movimiento libre en 8 direcciones)
    const dx = Math.abs(newX - curX);
    const dy = Math.abs(newY - curY);
    const distance = Math.max(dx, dy); // Movimiento diagonal incluido

    // 4. Verificar si está dentro del rango de movimiento del personaje
    if (distance <= char.moveTiles) {
      return true;
    }

    return false;
  }



  carveDungeon(grid: Casilla[][], startX: number, startY: number, steps: number) {
    let x = startX;
    let y = startY;

    grid[y][x] = new Casilla(CasillaType.ENTRANCE);

    let lastX = x;
    let lastY = y;

    const directions = [
      [0, -1], // arriba
      [1, 0],  // derecha
      [0, 1],  // abajo
      [-1, 0], // izquierda
    ];

    for (let i = 0; i < steps; i++) {
      const [dx, dy] = directions[Math.floor(Math.random() * 4)];
      const nx = Math.max(1, Math.min(grid[0].length - 2, x + dx));
      const ny = Math.max(1, Math.min(grid.length - 2, y + dy));

      if (grid[ny][nx].type === CasillaType.WALL) {
        grid[ny][nx] = new Casilla(CasillaType.FLOOR);
      }

      x = nx;
      y = ny;

      lastX = x;
      lastY = y;
    }

    // Forzar salida en la esquina opuesta de la entrada
    const exitX = grid[0].length - startX - 1;
    const exitY = grid.length - startY - 1;

    // Asegura un camino entre entrada y salida
    this.createCorridor(grid, lastX, lastY, exitX, exitY);

    grid[exitY][exitX] = new Casilla(CasillaType.EXIT);
  }

  private createCorridor(
    grid: Casilla[][],
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
  ): void {
    // Validación de límites para evitar errores
    const height = grid.length;
    const width = grid[0]?.length || 0;

    if (
      fromX < 0 || fromX >= width || toX < 0 || toX >= width ||
      fromY < 0 || fromY >= height || toY < 0 || toY >= height
    ) {
      console.warn('createCorridor: coordenadas fuera del rango del grid');
      return;
    }

    let x = fromX;
    let y = fromY;

    // Seguridad para evitar bucles infinitos
    const maxSteps = width * height;
    let steps = 0;

    // Primero mueve en X (horizontal), luego en Y (vertical)
    while (x !== toX && steps < maxSteps) {
      x += x < toX ? 1 : -1;
      grid[y][x] = new Casilla(CasillaType.FLOOR);
      steps++;
    }

    while (y !== toY && steps < maxSteps) {
      y += y < toY ? 1 : -1;
      grid[y][x] = new Casilla(CasillaType.FLOOR);
      steps++;
    }

    if (steps >= maxSteps) {
      console.warn('createCorridor: se alcanzó el número máximo de pasos');
    }
  }




  decorateDungeon(grid: Casilla[][], enemyParty: Party, playerParty: Party) {
    // Decorar el mapa con trampas, tesoros, agua, lava, etc
    for (let y = 1; y < grid.length - 1; y++) {
      for (let x = 1; x < grid[0].length - 1; x++) {
        if (grid[y][x].type === CasillaType.FLOOR) {
          const rand = Math.random();
          if (rand < 0.03) grid[y][x] = new Casilla(CasillaType.TRAP);
          else if (rand < 0.06) grid[y][x] = new Casilla(CasillaType.TREASURE);
          else if (rand < 0.08) grid[y][x] = new Casilla(CasillaType.WATER);
          else if (rand < 0.1) grid[y][x] = new Casilla(CasillaType.LAVA);
        }
      }
    }

    const maxY = grid.length;
    const maxX = grid[0].length;

    // 1. Colocar todos los personajes del enemyParty en casillas válidas (en todo el dungeon)
    for (const character of enemyParty.characters) {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 1000;

      while (!placed && attempts < maxAttempts) {
        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);
        if (grid[y][x].type === CasillaType.FLOOR && !grid[y][x].character) {
          grid[y][x].character = character;
          placed = true;
        }
        attempts++;
      }

      if (!placed) {
        console.warn("No se pudo colocar enemigo tras muchos intentos");
      }
    }


    // 2. Colocar todos los personajes del playerParty al principio del dungeon (filas superiores)
    const startAreaRows = 3; // filas cercanas a la entrada para el jugador, puedes ajustar

    for (const character of playerParty.characters) {
      let placed = false;
      while (!placed) {
        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * startAreaRows); // solo primeras filas
        if (grid[y][x].type === CasillaType.FLOOR && !grid[y][x].character) {
          grid[y][x].character = character;
          placed = true;
        }
      }
    }
  }

  canAttack(attacker: Character, target: Character): boolean {
    const attackerPos = this.getCharacterPosition(attacker);
    const targetPos = this.getCharacterPosition(target);

    if (!attackerPos || !targetPos) return false;

    // Comprobar que el objetivo es de la party enemiga
    const isEnemy =
      (this.playerParty.characters.includes(attacker) &&
        this.enemyParties.characters.includes(target)) ||
      (this.enemyParties.characters.includes(attacker) &&
        this.playerParty.characters.includes(target));

    if (!isEnemy) return false;

    // Calcular distancia Manhattan entre las posiciones
    const distance =
      Math.abs(attackerPos.x - targetPos.x) +
      Math.abs(attackerPos.y - targetPos.y);

    // Si está dentro del rango, es atacable
    return distance <= attacker.alcance;
  }


  isEnemyCharacter(char: Character): boolean {
    return this.enemyParties.characters.includes(char);
  }

  isAllyCharacter(char: Character): boolean {
    return this.playerParty.characters.includes(char);
  }

  static generateDungeon(width: number, height: number, enemyParty: Party, playerParty: Party): Dungeon {
    const dungeon = new Dungeon(width, height, playerParty, enemyParty);

    dungeon.casillas = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => new Casilla(CasillaType.WALL))
    );

    const startX = Math.floor(width / 4);
    const startY = Math.floor(height / 4);
    const steps = Math.floor(width * height * 0.5);

    dungeon.carveDungeon(dungeon.casillas, startX, startY, steps);
    dungeon.decorateDungeon(dungeon.casillas, enemyParty, playerParty);

    return dungeon;
  }



}

