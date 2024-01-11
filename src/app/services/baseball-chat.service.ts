import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseballChatService {

  //private chatAPI = environment.apiUrl + environment.playerData;

  constructor(private http: HttpClient) { }

  getAnswer(question: string, questionCount: number): Promise<string> {
    if(questionCount <=5) {
      let url = `http://127.0.0.1:5000/ask`;
      const response = this.http.post<{answer: string}>(url, { question }).pipe(
        map(res => res.answer)
      );
      return firstValueFrom(response);
    }
    return Promise.resolve("I am tired. Please stop asking me questions");
  }
}
