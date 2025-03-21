import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent {
  isOpen = false;
  selectedAdvisor: 'ai' | 'human' | null = null;
  messageText = '';
  messages: { type: 'ai' | 'user', content: string }[] = [];

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  selectAdvisor(type: 'ai' | 'human'): void {
    this.selectedAdvisor = type;
  }

  sendMessage(): void {
    if (this.messageText.trim()) {
      this.messages.push({ type: 'user', content: this.messageText });
      this.messageText = '';
    }
  }

}
