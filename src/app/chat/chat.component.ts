import { Component, OnInit } from '@angular/core';
import { BaseballChatService } from '../services/baseball-chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: { text: string, sender: 'user' | 'bot' }[] = [];
  questionCount = 0;
  inputMessage: string = ''; // Add the 'inputMessage' property

  constructor(private chatService: BaseballChatService) { }

  sendMessage(message: string): void {
    this.messages.push({ text: message, sender: 'user' });
    this.questionCount++;
    console.log("GOOD", message);
    this.chatService.getAnswer(message, this.questionCount).then(answer => {
      this.messages.push({ text: answer, sender: 'bot' });
    });
  }

  ngOnInit(): void {
    this.messages.push({ text: 'Hello! How can I assist you today?', sender: 'bot' });
  }

}

// next steps
// use open api key
// configure the bot for better answers
// error proof it.
// explore if I can have it use our fantrax data
// make it look better
// review it
