import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../core/auth.service';
import { Observable } from 'rxjs';
import { Item } from '../models/item.model';
import { Category } from '../models/category.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<any[]>;

  categoriesCollection: AngularFirestoreCollection<Category>;
  categories: Observable<any[]>;

  user: User;

  constructor(public afs: AngularFirestore, public auth: AuthService) {
  }

  getItems() {
    this.itemsCollection = this.afs.collection('items');
    return this.items = this.itemsCollection.valueChanges();
  }
}
