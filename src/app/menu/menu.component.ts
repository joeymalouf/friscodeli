import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.css']
})
export class MenuComponent {
  data = [];
  constructor(private http: HttpClient) {
    this.http.get('');
  }
}
