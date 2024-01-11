import { Component,Renderer2 } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ResetpasswordComponent } from '../../resetpassword/resetpassword.component';
import { LoginComponent } from '../../login/login.component';
import { KeeperEligibleService } from 'src/app/services/keeper-eligible.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private renderer: Renderer2, private modalService: BsModalService, private keeperService: KeeperEligibleService) { }

  ngOnInit(): void {
    const preloaderElement = document.getElementById('preloader');
    if (preloaderElement) {
      this.renderer.removeClass(preloaderElement, 'd-none')
    }

    // what is this for
    setTimeout(() => {
      this.renderer.addClass(preloaderElement, 'd-none');
    }, 100);// was 1000
  }

  curentsection: any = 'home';


  onSectionChange(event: any) {
    this.curentsection = event;
  }

  windowscroll() {
    const navbar = document.getElementById('navbar');
    if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
      navbar?.classList.add('nav-sticky');
      document.getElementById('back-to-top')!.style.display = 'block'
    }
    else {
      navbar?.classList.remove('nav-sticky');
      document.getElementById('back-to-top')!.style.display = 'none'
    }
  }

  toggleMenu() {
    document.getElementById('navbarSupportedContent')!.classList.toggle('show');
    this.keeperService.setNavbarState(document.getElementById('navbarSupportedContent')!.classList.contains('show'));
  }

  openResetPasswordModal() {
    this.modalService.show(ResetpasswordComponent);
  }

  openLoginModal() {
    this.modalService.show(LoginComponent);
  }

}
