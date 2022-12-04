import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WorkSummaryComponent } from './components/work-summary/work-summary.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'work-summary', component: WorkSummaryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
