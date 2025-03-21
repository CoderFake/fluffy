import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl,FormGroup } from '@angular/forms';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit{
  currentIndex = 0;
  slides = [
    'https://theme.hstatic.net/200000856317/1001220433/14/slide_1_mb.jpg?v=324',
    'assets/img/sale 55 Banner (1).png',
    'assets/img/3.png'
  ];

  benefits = [
    { icon: 'https://img.icons8.com/?size=100&id=pxWwSVIqQ14n&format=png&color=EB5265', title: 'KHUYẾN MÃI LIÊN TỤC', description: 'Có rất nhiều deal hot, voucher, mã giảm giá' },
    { icon: 'https://img.icons8.com/?size=100&id=Cgu81kzSlCZy&format=png&color=EB5265', title: 'TƯ VẤN TRỰC TUYẾN', description: 'Được tư vấn kỹ càng, tận tình và nhanh chóng' },
    { icon: 'https://img.icons8.com/?size=100&id=487&format=png&color=EB5265', title: 'GIAO HÀNG NHANH', description: 'Giao hàng nhanh chóng, đóng gói cẩn thận' },
    { icon: 'https://img.icons8.com/?size=100&id=2i2jDnoEm4ER&format=png&color=EB5265', title: 'SẢN PHẨM THIẾT KẾ ĐỘC QUYỀN', description: 'Các loại thú bông độc quyền chỉ có tại nhà FLUFFY' }
  ];

  ngOnInit() {
    setInterval(() => {
      this.changeSlide(1);
    }, 4000);
  }

  // Phương thức thay đổi slide
  changeSlide(step: number) {
    this.currentIndex = (this.currentIndex + step + this.slides.length) % this.slides.length;
  }

  // Phương thức xử lý sự kiện khi nhấp vào chấm
  currentSlide(index: number) {
    this.currentIndex = index - 1;  // Điều chỉnh để index bắt đầu từ 0
  }

  setSlide(index: number) {
    this.currentIndex = index;
  }
}
