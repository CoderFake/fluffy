import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { AboutFluffyComponent } from './pages/about-fluffy/about-fluffy.component';
import { SalespolicyComponent } from './pages/salespolicy/salespolicy.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'product/:id',
    component: ProductDetailComponent
  },
  {
    path: 'product-page',
    component: ProductPageComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [authGuard]  
  },
  {
    path: 'account-settings',
    component: AccountSettingsComponent,
    canActivate: [authGuard] 
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'about-fluffy',
    component: AboutFluffyComponent
  },
  {
    path: 'salespolicy',
    component: SalespolicyComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];