import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { ToolsComponent } from './modules/tools/tools.component';
import { CreateTokenComponent } from './modules/create-token/create-token.component';
import { CreateCandymachineComponent } from './modules/create-candymachine/create-candymachine.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'tools', component: ToolsComponent },
  { path: 'tools/create-token', component: CreateTokenComponent },
  { path: 'tools/create-candymachine', component: CreateCandymachineComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
