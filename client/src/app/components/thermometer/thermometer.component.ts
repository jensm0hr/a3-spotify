import { Component, OnInit, Input } from '@angular/core';
import { Popularity } from 'src/app/data/popularity';

@Component({
    selector: 'app-thermometer',
    templateUrl: './thermometer.component.html',
    styleUrls: ['./thermometer.component.css'],
    standalone: false
})
export class ThermometerComponent implements OnInit {
  //Defines Input fields and bind them to the template.
  @Input() label:string = '';
  @Input() popularity:Popularity;

  constructor() { }

  ngOnInit() {
  }

}
