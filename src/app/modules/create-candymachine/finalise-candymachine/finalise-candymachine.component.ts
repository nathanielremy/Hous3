import { Component, Input, OnInit } from '@angular/core';
import { CandyMachine } from '@metaplex-foundation/js';

@Component({
  selector: 'app-finalise-candymachine',
  templateUrl: './finalise-candymachine.component.html',
  styleUrls: ['./finalise-candymachine.component.css']
})
export class FinaliseCandymachineComponent implements OnInit {
  @Input() candyMachine: CandyMachine | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
