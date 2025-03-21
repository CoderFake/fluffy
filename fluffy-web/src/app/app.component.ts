import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { CartService } from '../services/cart.service';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { CartComponent } from './components/cart/cart.component'; // Thêm import này

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent,
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    ChatboxComponent,
    CartComponent // Thêm CartComponent vào imports
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [CartService]
})
export class AppComponent {
  title = 'fluffy-web';
}