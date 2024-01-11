import { Component, OnInit } from '@angular/core';
import { PrizepicksService} from '../../services/prizepicks.service';

@Component({
  selector: 'app-prize-picks-web-scraper',
  templateUrl: './prize-picks-web-scraper.component.html',
  styleUrls: ['./prize-picks-web-scraper.component.scss']
})
export class PrizePicksWebScraperComponent implements OnInit {
constructor(private prizepicksService: PrizepicksService) {}

ngOnInit(): void {

}

}
