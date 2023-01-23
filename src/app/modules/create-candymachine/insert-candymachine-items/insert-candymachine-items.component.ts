import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CandyMachine } from '@metaplex-foundation/js';

@Component({
  selector: 'app-insert-candymachine-items',
  templateUrl: './insert-candymachine-items.component.html',
  styleUrls: ['./insert-candymachine-items.component.css']
})
export class InsertCandymachineItemsComponent implements OnInit {
  @Input() candyMachine: CandyMachine | null = null;
  @Output() candyMachineEmitter = new EventEmitter<CandyMachine>();

  constructor() { }

  ngOnInit(): void {
  }

}
