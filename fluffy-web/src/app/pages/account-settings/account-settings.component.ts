import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Sửa lại import của Validators
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  profileForm!: FormGroup;
  isEditing: boolean = false;
  activeTab: string = 'personal';

  socialConnections = {
    facebook: false,
    google: true
  };

  menuItems = [
    { id: 'personal', label: 'Thông tin cá nhân', icon: 'fas fa-user' },
    { id: 'address', label: 'Quản lý địa chỉ', icon: 'fas fa-map-marker-alt' },
    { id: 'password', label: 'Thay đổi mật khẩu', icon: 'fas fa-lock' },
    { id: 'orders', label: 'Quản lý đơn hàng', icon: 'fas fa-shopping-bag' },
    { id: 'favorites', label: 'Danh sách yêu thích', icon: 'fas fa-heart' },
    { id: 'vouchers', label: 'Kho voucher', icon: 'fas fa-ticket-alt' },
    { id: 'logout', label: 'Đăng xuất', icon: 'fas fa-sign-out-alt' }
  ];

  days = Array.from({ length: 31 }, (_, i) => i + 1);
  months = [
    { value: 1, label: 'Tháng 1' },
    { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' },
    { value: 6, label: 'Tháng 6 ' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' }
  ];
  years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();  // Gọi phương thức khởi tạo form
  }

  initializeForm() {
    this.profileForm = this.fb.group({
      fullName: [{ value: '', disabled: !this.isEditing }, [Validators.required]],  // Đặt giá trị mặc định là chuỗi rỗng
      day: ['1', [Validators.required]],
      month: ['1', [Validators.required]],
      year: [new Date().getFullYear(), [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  

  toggleEdit(inputElement: HTMLInputElement, controlName: string) {
    this.isEditing = true; 
    const control = this.profileForm.get(controlName);

    if (control) {
      control.enable();  // Kích hoạt trường form để chỉnh sửa
      setTimeout(() => inputElement.focus(), 0);  // Tự động focus vào trường nhập
    }
  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  resetForm() {
    this.profileForm.reset();
    this.isEditing = false;
    this.initializeForm();
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
      alert('Lưu thành công!');  // Thông báo lưu thành công
      this.isEditing = false;  // Tắt chế độ chỉnh sửa
    } else {
      alert('Vui lòng điền đầy đủ thông tin và kiểm tra lại lỗi!');  // Thông báo nếu form không hợp lệ
    }
  }

  onMenuItemClick(item: string) {
    console.log(`Menu item clicked: ${item}`);
    this.setActiveTab(item);  // Thay đổi tab hiện tại
  }

  updateFacebook() {
    this.socialConnections.facebook = !this.socialConnections.facebook;
    console.log('Facebook connection updated:', this.socialConnections.facebook);
  }

  updateGoogle() {
    this.socialConnections.google = !this.socialConnections.google;
    console.log('Google connection updated:', this.socialConnections.google);
  }
}
