import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../core/auth.service';
import { Observable } from 'rxjs';
import { Item } from '../models/item.model';
import { Category } from '../models/category.model';
import { User } from '../models/user.model';

import { switchMap } from 'rxjs/operators';
import { CategoryItems } from '../models/categoryitems.model';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  categories: CategoryItems[] = [];
  items: Item[] = [];

  user: User;

  constructor(public afs: AngularFirestore, public auth: AuthService) { }

  ngOnInit() {
    // this.afs.collection('categories', ref => ref.orderBy('order')).snapshotChanges().subscribe(data => {
    //   data.forEach(cat => {
    //     let category:any = cat.payload.doc.data();
    //     category.id = cat.payload.doc.id;
    //     this.categories.push(category)
    //   });
    // });

    // this.afs.collection('items', ref => ref.orderBy('category')).snapshotChanges().subscribe(data => {
    //   data.forEach(i => {
    //     let item:any = i.payload.doc.data();
    //     item.id = i.payload.doc.id;
    //     this.items.push(item)
    //   });
    // });


    this.afs.collection('categories', ref => ref.orderBy('order')).snapshotChanges().subscribe(data => {
      data.forEach(cat => {
        let category:any = cat.payload.doc.data();
        category.id = cat.payload.doc.id;
        let exists = this.categories.find(obj => obj.id == category.id)
        if (exists) {
          console.log(exists.id + ": category already exists")
          exists = Object.assign(exists, category)
        }
        else {
          this.categories.push(category)
          exists = this.categories.find(obj => obj.id == category.id)
          category.items = []
        }
        this.afs.collection('items', ref => ref.where('category', '==', category.name.toLowerCase())).snapshotChanges().subscribe(data => {
          data.forEach(i => {
            let item:any = i.payload.doc.data();
            item.id = i.payload.doc.id;
            let itemExists = exists.items.find(obj => obj.id == item.id)
            if (itemExists) {
              console.log(itemExists.id + ": item already exists")
              itemExists = Object.assign(itemExists, item)
            }
            else {
              this.categories.find(obj => obj.id == category.id).items.push(item)
            }

          });
        });
      });
    });



    // this.categoriesCollection = this.afs.collection('categories', ref => ref.orderBy('order'));
    // this.categories = this.categoriesCollection.valueChanges()

    this.auth.user.subscribe(user => this.user = user)


    // let x  = this.afs.collection('items', ref => ref.where('category', '==', "dessert"));
    //     x.snapshotChanges().subscribe(item => {
    //       this.itemsTest = item.map(f => {
    //         console.log(f.payload.doc.data())
    //         return {
    //         key: f.payload.doc.id,
    //       } as Item
    //       })
    //     })
    //     console.log(this.itemsTest)

  }

  // getItems(e) {
  //   let itemsTest: Item[];
  //   let x: AngularFirestoreCollection<Item>;
  //   x = this.afs.collection('items', ref => ref.where('category', '==', e.payload.doc.data().name.toLowerCase()));
  //   x.snapshotChanges().subscribe(item => {
  //     itemsTest = item.map(f => {
  //       return {
  //         key: f.payload.doc.id,
  //         ...f.payload.doc.data()
  //       } as Item;
  //     });
  //   });
  // }


  editPost() {

  }

  test(id) {
    console.log(id)
  }
}
