import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { LoginComponent } from './components/login/login.component';
import { ClientProfileComponent } from './components/client-profile/client-profile.component';
import { PageAdminComponent } from './components/page-admin/page-admin.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'client-profile', component: ClientProfileComponent },
  { path: 'page-admin', component: PageAdminComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
