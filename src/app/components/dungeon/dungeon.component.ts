import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CasillaType, Dungeon } from '../../models/dungeon.model';
import { Party } from '../../models/party.model';
import { Character, demonCharacters, humanoidCharacters, Spell } from '../../models/character.model';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game.model';

@Component({
  selector: 'app-dungeon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DungeonComponent implements OnInit {


  dungeon!: Dungeon;
  game:Game = new Game(this.dungeon);
  casillas: any[][] = [];
  selectedCharacter:Character = {} as Character;
  enemyCharacterToAttack:Character = {} as Character;
  selectedSpell:Spell = {} as Spell;
  showSpells = false;
  isAttacking:boolean = false;
  playerIsMoving:boolean =false;
  playerIsUsingSpell:boolean = false;
  validMovePositions: { row: number; col: number }[] = [];
 


  ngOnInit(): void {
    const playerParty = new Party(Party.generateRandomParty(humanoidCharacters, 5), [], []);
    const enemyParties = new Party(Party.generateRandomParty(demonCharacters, 10), [], []);

    // Generar el dungeon con tamaño moderado para pruebas y evitar freeze
    this.dungeon = Dungeon.generateDungeon(40, 25, enemyParties, playerParty);
    this.casillas = this.dungeon.casillas;
    this.game.dungeon = this.dungeon
  }

  pasarTurno(){
    this.game.pasarTurno();
  }

  getCasillaColor(type: CasillaType): string {
    switch (type) {
      case CasillaType.WALL: return 'bg-gray-800';
      case CasillaType.FLOOR: return 'bg-yellow-200';
      case CasillaType.ENTRANCE: return 'bg-green-500';
      case CasillaType.EXIT: return 'bg-red-600';
      case CasillaType.TRAP: return 'bg-purple-400';
      case CasillaType.TREASURE: return 'bg-yellow-500';
      case CasillaType.WATER: return 'bg-blue-400';
      case CasillaType.LAVA: return 'bg-orange-600';
      default: return 'bg-neutral-300';
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  isPlayerCharacter(character: Character | null): boolean {
    if (!character) return false;
    return this.dungeon.playerParty.characters.includes(character);
  }

  toggleSpells() {
    this.showSpells = !this.showSpells;
  }

  selectCharacter(char:Character){
    // seleccionar personaje a atacar
    if(this.selectedCharacter && this.isAttacking){
      this.enemyCharacterToAttack = char;
      return;
    }
    // seleccionar personaje
    if(this.dungeon.playerParty.characters.includes(char)){
      this.selectedCharacter = char;
      this.moveChar();
    }
    // seleccionar personaje enemigo 
    if(this.dungeon.enemyParties.characters.includes(char)){
      this.selectedCharacter = char;
    }
  }


  prepareAttack(char:Character) {
    this.isAttacking = true;
    alert("Selecciona a un enemigo dentro del alacance del personaje")
  }


  moveChar() {
    this.playerIsMoving = true;
    this.validMovePositions = [];

    const from = this.dungeon.getCharacterPosition(this.selectedCharacter);
    if (!from) return;

    for (let y = 0; y < this.dungeon.yDimension; y++) {
      for (let x = 0; x < this.dungeon.xDimension; x++) {
        if (this.dungeon.isValidMove(from.x, from.y, x, y, this.selectedCharacter)) {
          this.validMovePositions.push({ row: y, col: x });
        }
      }
    }

  }

  isValidMoveTile(row: number, col: number): boolean {
    return this.validMovePositions.some(pos => pos.row === row && pos.col === col);
  } 

  prepareSpell(spell:Spell){
    this.playerIsUsingSpell=true;
    this.selectedSpell = spell;
    alert("Usa un hechiso")
  }


  onCellClick(row: number, col: number): void {
    const clickedCell = this.dungeon.casillas[row][col];

    // 🔹 Movimiento
    if (this.playerIsMoving && this.selectedCharacter && !this.dungeon.casillas[row][col].character) {
      const from = this.dungeon.getCharacterPosition(this.selectedCharacter);
      if (!from) return;

      if (this.dungeon.isValidMove(from.x, from.y, col, row, this.selectedCharacter)) {
        this.dungeon.casillas[from.y][from.x].character = null;
        this.dungeon.casillas[row][col].character = this.selectedCharacter;
        this.selectedCharacter.moved = true;
        this.validMovePositions = [];
      } else {
        console.log('Movimiento inválido');
      }

      this.playerIsMoving = false;
      return;
    }

    // 🔹 Ataque
    if (this.isAttacking && this.selectedCharacter) {
      const target = clickedCell.character;
      if (
        target &&
        this.dungeon.isEnemyCharacter(target) &&
        this.dungeon.canAttack(this.selectedCharacter, target)
      ) {
        this.dungeon.playerParty.ataque(this.selectedCharacter, target);
        this.selectedCharacter.moved = true;
      } else {
        console.log('No es un objetivo válido para ataque.');
      }

      this.isAttacking = false;
      return;
    }

   // 🔹 Hechizo
    if (this.playerIsUsingSpell && this.selectedCharacter && this.selectedSpell) {
      const caster = this.selectedCharacter;
      const spell = this.selectedSpell;
      let targetChar = this.dungeon.casillas[row][col].character;
      if(!targetChar){
        return;
      }
      // Si el hechizo requiere objetivo (daño o curación o buff)
      if (spell.dmg > 0 || spell.buff_hp !== 0 || spell.buff_dmg !== 0) {
        const isTargetValid =
          (this.dungeon.isEnemyCharacter(targetChar) && spell.dmg > 0) || // daño a enemigo
          (targetChar === caster && spell.buff_hp !== 0) || // autocuración
          (this.dungeon.isAllyCharacter(targetChar) && (spell.buff_hp !== 0 || spell.buff_dmg !== 0)); // buff a aliado

        if (targetChar && isTargetValid) {
          const success = this.dungeon.playerParty.lanzarHechizo(caster, spell, targetChar);
          if (success) {
            caster.moved = true;
            console.log(`${spell.name} lanzado sobre ${targetChar.name}`);
          } else {
            console.log("No se pudo lanzar el hechizo", "\nlanzador:",caster, "spell:", spell, "target:",targetChar);
          }
        } else {
          console.log("Objetivo no válido para este hechizo.");
        }
      }

      this.playerIsUsingSpell = false;
      this.selectedSpell = {} as Spell;
      return;
    }
  }


}
