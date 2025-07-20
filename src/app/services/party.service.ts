import { Injectable } from '@angular/core';
import { Party } from '../models/party.model';

@Injectable({
  providedIn: 'root'
})
export class PartyService {

  constructor() { }


  party:Party = {} as Party;

  
}
