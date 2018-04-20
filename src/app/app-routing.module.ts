import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './pages/register/register.component';

// import { BillingComponent } from './pages/billing/billing.component';
// import { DoneComponent } from './pages/done/done.component';
// import { HomeComponent } from './pages/home/home.component';
// import { LoginComponent } from './pages/login/login.component';
// import { LogoutComponent } from './pages/logout/logout.component';
// import { ReviewComponent } from './pages/review/review.component';
// import { SelectContactsComponent } from './pages/select-contacts/select-contacts.component';

const routes: Routes = [

    // Sharing flow routes
    // { path: '', component: HomeComponent },
    { path: 'register', component: RegisterComponent },

    // Authenticated routes
    // {
    //     path: 'admin', children: [
    //         { path: 'billing', component: BillingComponent },
    //         { path: 'logout', component: LogoutComponent },
    //     ]
    // }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
