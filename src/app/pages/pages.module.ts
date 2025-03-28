import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Swiper
import { SlickCarouselModule } from 'ngx-slick-carousel';

// Page Route
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';


// Component
import { IndexComponent } from './index/index.component';
import { Index2Component } from './index2/index2.component';
import { Index3Component } from './index3/index3.component';
import { Index4Component } from './index4/index4.component';
import { Index5Component } from './index5/index5.component';
import { Index6Component } from './index6/index6.component';
import { BloglistComponent } from './bloglist/bloglist.component';
import { BlogdetailsComponent } from './blogdetails/blogdetails.component';
import { JclKeeperUploaderComponent } from './jcl-file-keeper/jcl-keeper-uploader.component';
import { ChatComponent } from '../chat/chat.component';
import { PrizePicksWebScraperComponent } from './prize-picks-web-scraper/prize-picks-web-scraper.component';
// import { LoginComponent } from '../login/login.component';



@NgModule({
  declarations: [
    ChatComponent,
    IndexComponent,
    Index2Component,
    Index3Component,
    Index4Component,
    Index5Component,
    Index6Component,
    BloglistComponent,
    BlogdetailsComponent,
    JclKeeperUploaderComponent,
    PrizePicksWebScraperComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PagesRoutingModule,
    SharedModule,
    SlickCarouselModule
  ]
})
export class PagesModule { }
