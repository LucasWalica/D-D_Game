import { Component } from '@angular/core';
import { Character, demonCharacters, humanoidCharacters, monsterCharacters } from '../../models/character.model';
import { Party } from '../../models/party.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PartyService } from '../../services/party.service';

@Component({
  selector: 'app-party-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './party-selection.component.html',
  styleUrl: './party-selection.component.css'
})
export class PartySelectionComponent {

  humanoidChars:Character[] = humanoidCharacters;
  demonChars:Character[] = demonCharacters;
  monstersChar:Character[] = monsterCharacters;


  numberOfChars:number = 0;
  minimunChars:number = 5;
  selectedParty:Party = new Party([], [], [], []);

  selectedPartyType:Character[] = [] as Character[];

  constructor(private router:Router,  private partyService:PartyService){

  }

  selectPartyType(chars:Character[]){
    console.log(chars)
    this.selectedPartyType = chars;
  }


  addCharacter(char:Character){

    this.selectedParty.addCharacter(char);
    this.numberOfChars++;
  }

  goToMap(){
    this.partyService.party = this.selectedParty;
    this.router.navigate(["map"])
  }




}
