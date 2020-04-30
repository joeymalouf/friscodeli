import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../core/auth.service';
import { Observable } from 'rxjs';
import { Item } from '../models/item.model';
import { Category } from '../models/category.model';
import { User } from '../models/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { switchMap } from 'rxjs/operators';
import { CategoryItems } from '../models/categoryitems.model';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  closeResult: string;
  categories: CategoryItems[] = [];
  editItemFormGroup: FormGroup;
  editCategoryFormGroup: FormGroup;
  editItem: Item;
  editCategory: CategoryItems;
  user: User;

  constructor(public afs: AngularFirestore, public auth: AuthService, private modalService: NgbModal, private formBuilder: FormBuilder) { }

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


    this.getData()



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


    this.editItemFormGroup = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      order: [0, Validators.required],
    });

    this.editCategoryFormGroup = this.formBuilder.group({
      id: [''],
      name: [''],
      description: ['', Validators.required],
      order: [0, Validators.required],
      items: [],
    })
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

  updateItem(content, item) {
    console.log(item)
    this.editItemFormGroup.setValue(item)
    this.modalService.open(content, { centered: true })
    console.log(this.editItemFormGroup)
    this.editItem = item
  }

  addItem(content, category) {
    console.log(category)
    var length = this.categories.find(obj => obj.name == category).items.length + 1
    let item: Item = {
      id: "add",
      name: "",
      description: "",
      price: "",
      category: category,
      order: length,
    }
    this.editItemFormGroup.setValue(item)
    this.modalService.open(content, { centered: true })
    this.editItem = item
  }

  deleteItemModal(content, item) {
    this.editItemFormGroup.setValue(item)
    this.modalService.open(content, { centered: true })
    console.log(this.editItemFormGroup)
    this.editItem = item
  }

  addCategoryModal(content) {
    this.modalService.open(content, { centered: true })
  }

  async addCategory() {
    this.afs.collection(`categories`).add({
      name: this.editCategoryFormGroup.value.name,
      description: this.editCategoryFormGroup.value.description,
      order: this.categories.length + 1,
    })

    this.modalService.dismissAll()

  }

  deleteCategoryModal(content, category) {
    this.editCategoryFormGroup.setValue(category)
    this.modalService.open(content, { centered: true })
    console.log(this.editCategoryFormGroup)
    this.editCategory = category
  }

  editCategoryModal(content, category) {

  }

  async deleteCategory() {
    var currentCategory = this.categories.find(obj => obj.id == this.editCategoryFormGroup.value.id)
    currentCategory.items.forEach(item => {
      this.afs.doc(`items/${item.id}`).delete()
        .then(_ => { }, reject => {
          console.log('error')
        }).catch(reject => {
          console.log(reject)
        })
    })
    this.afs.doc(`categories/${this.editCategoryFormGroup.value.id}`).delete()
      .then(_ => {
        var removeIndex = this.categories.indexOf(currentCategory)
        this.categories.splice(removeIndex, 1)
        console.log("deleted")
      }, reject => {
        console.log('error')
      }).catch(reject => {
        console.log(reject)
      })
    this.modalService.dismissAll()

  }

  async saveNewItem() {
    this.afs.collection(`items`).add({
      name: this.editItemFormGroup.value.name,
      description: this.editItemFormGroup.value.description,
      price: this.editItemFormGroup.value.price,
      category: this.editItemFormGroup.value.category,
      order: this.editItemFormGroup.value.order,
    })

    this.modalService.dismissAll()
  }

  async saveItem() {
    this.afs.doc(`items/${this.editItemFormGroup.value.id}`).update({
      name: this.editItemFormGroup.value.name,
      description: this.editItemFormGroup.value.description,
      price: this.editItemFormGroup.value.price,
      category: this.editItemFormGroup.value.category,
      order: this.editItemFormGroup.value.order,
    }).then(_ => {
      if (this.editItem.category != this.editItemFormGroup.value.category) {
        var currentItems = this.categories.find(obj => obj.name == this.editItem.category).items
        var removeIndex = currentItems.indexOf(this.editItem)
        currentItems.splice(removeIndex, 1)

      }

    })

    this.modalService.dismissAll()
  }



  async deleteItem() {
    this.afs.doc(`items/${this.editItemFormGroup.value.id}`).delete()
      .then(_ => {
        var currentItems = this.categories.find(obj => obj.name == this.editItemFormGroup.value.category[0]).items
        var removeIndex = currentItems.indexOf(this.editItem)
        currentItems.splice(removeIndex, 1)
        console.log("deleted")
      }, reject => {
        console.log('error')
      }).catch(reject => {
        console.log(reject)
      })
    this.modalService.dismissAll()

  }

  getData() {
    this.afs.collection('categories', ref => ref.orderBy('order')).snapshotChanges().subscribe(data => {
      data.forEach(cat => {
        let category: any = cat.payload.doc.data();
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
        this.afs.collection('items', ref => ref.where('category', '==', category.name)).snapshotChanges().subscribe(data => {
          data.forEach(i => {
            let item: any = i.payload.doc.data();
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
  }
}
