import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { AdminGuard } from './core/admin.guard';
import { LocationComponent } from './location/location.component';
import { MenuComponent } from './menu/menu.component'
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'location', component: LocationComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard]},

  // nonexistent pages send back to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
