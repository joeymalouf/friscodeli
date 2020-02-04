import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../core/auth.service';
import { Observable } from 'rxjs';
import { Item } from '../models/item.model';
import { Category } from '../models/category.model';
import { User } from '../models/user.model';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<any[]>;

  categoriesCollection: AngularFirestoreCollection<Category>;
  categories: Observable<any[]>;

  user: User;

  constructor(public afs: AngularFirestore, public auth: AuthService) { }

  ngOnInit() {
    this.itemsCollection = this.afs.collection('items');
    this.items = this.itemsCollection.valueChanges();

    this.auth.user.subscribe(user => this.user = user)
  }

  editPost() {

  }
}
