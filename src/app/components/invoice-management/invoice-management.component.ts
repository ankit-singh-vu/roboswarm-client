import { Component, OnInit } from '@angular/core';
import { UserService, Invoice } from '../../services/user.service';
import * as moment from 'moment';


@Component({
  selector: 'app-invoice-management',
  templateUrl: './invoice-management.component.html',
  styleUrls: ['./invoice-management.component.css']
})
export class InvoiceManagementComponent implements OnInit {
  invoices: Invoice[] = [];
  working = true;

  constructor(private userService: UserService) { }

  async ngOnInit() {
    this.working = true;
    this.invoices = await this.userService.getInvoices();
    this.working = false;
  }

  getFormattedDate(dateTime: number): string {
    return moment.unix(dateTime).format('YYYY-MM-DD');
  }

  async payInvoice(id: string): Promise<void> {
    this.working = true;
    const updatedInvoice: Invoice = await this.userService.payInvoice(id);
    if (updatedInvoice) {
      const index: number = this.invoices.findIndex(i => i.id === id);
      this.invoices[index] = updatedInvoice;
    }
    this.userService.userChanged.emit('changed');
    this.working = false;
  }
}
