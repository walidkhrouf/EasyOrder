import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { LoginComponent } from './components/login/login.component';
import { ClientProfileComponent } from './components/client-profile/client-profile.component';
import { PageAdminComponent } from './components/page-admin/page-admin.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { VoirProfilComponent } from './components/voir-profil/voir-profil.component';
import { CommandeListComponent } from './components/commande-list/commande-list.component';
import {AdminGuard} from "./auth/admin.guard";



const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'client-profile', component: ClientProfileComponent },
  {
    path: 'page-admin',
    component: PageAdminComponent,
    canActivate: [AdminGuard] // Apply the AdminGuard
  },
  { path: 'accueil', component: AccueilComponent },
  { path: 'voir-profil', component: VoirProfilComponent },
  { path: 'commandes', component: CommandeListComponent },
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
