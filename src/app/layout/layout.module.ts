import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

// Scroll To
// import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { ScrollspyDirective } from '../scrollspy.directive';

// Bootstrap Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsModalService } from 'ngx-bootstrap/modal';

// component
import { LayoutComponent } from './layout.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from '../login/login.component';
import { ResetpasswordComponent } from '../resetpassword/resetpassword.component';
import { KeeperEligibleService } from '../services/keeper-eligible.service';

@NgModule({
  declarations: [
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    ScrollspyDirective,
    LoginComponent,
    ResetpasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    GoogleSigninButtonModule,
    // ScrollToModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  providers: [BsModalService, KeeperEligibleService]
})
export class LayoutModule { }
