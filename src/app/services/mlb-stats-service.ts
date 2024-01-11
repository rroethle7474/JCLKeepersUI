import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MlbStatsService {

  private playerDataBaseApi = environment.apiUrl + environment.playerData;

  constructor(private http: HttpClient) { }

  getStats(name: string, isHitter: boolean) {
    if(isHitter) {
      let url = `http://127.0.0.1:8000/playerdata/?name=${name}&position=p`;
      return this.http.get<any>(`${this.playerDataBaseApi} + name=${name}&position=p`);
    }
    let url = `http://127.0.0.1:8000/playerdata/?name=${name}&position=h`;
    return this.http.get<any>(`${this.playerDataBaseApi} + name=${name}&position=h`);
    // Replace '/your-endpoint' with the specific path for your data
  }

  async getPlayerEligibility(name: string, isHitter: boolean): Promise<any> {
    // Assuming that this.http.get() returns an Observable
    if(isHitter) {
      let url = `http://127.0.0.1:8000/playerdata/?name=${name}&position=p`;
      return await firstValueFrom(this.http.get<any>(url));
    }
    let url = `http://127.0.0.1:8000/playerdata/?name=${name}&position=h`;
    return await firstValueFrom(this.http.get<any>(url));
  }
}
