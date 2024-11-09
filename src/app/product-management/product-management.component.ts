import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { PRODUCTS_DATA } from './products.data';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CardModule } from 'primeng/card';
import { CHART_OPTIONS } from '../shared/constant/constant';
import { DataManagementService } from '../shared/services/data-management.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule,TableModule,ButtonModule,DialogModule,InputTextModule,ReactiveFormsModule,NgxChartsModule,CardModule],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProductManagementComponent implements OnInit{
  displayColumn:any[]=PRODUCTS_DATA
  productsChartOptions:any=CHART_OPTIONS
  isVisibleDialogue=false
  isSubmitted=false
  type:'add'|'edit'='add'
  productsForm= new FormGroup({
    name: new FormControl('',Validators.required),
    price: new FormControl('',[Validators.required,Validators.pattern('^[0-9]*$')]),
    category: new FormControl('',Validators.required)
  })

  productsChartData:any[] = [];
  productsDataList:any[]=[];

  constructor(private dataManagementService:DataManagementService,private cdr:ChangeDetectorRef){

  }


  get fc(): any {
    return this.productsForm.controls;
  }

  ngOnInit(): void {
    const getProductData = this.dataManagementService.getData('productList');
    this.productsDataList= getProductData ? JSON.parse(getProductData) : [];
    this.mapChartData()
    this.cdr.markForCheck()

  }

  onClickAdd(){
    this.type='add'
    this.isVisibleDialogue=true
    this.cdr.markForCheck()
  }

  /**
   * onClickSave - When add products then first check the  validation and if valid then store the data in local storage
   */
  onClickSave(){
    this.isSubmitted=true
    if (this.productsForm.valid) {
      const getProductData = this.dataManagementService.getData('productList');
      this.productsDataList= getProductData ? JSON.parse(getProductData) : [];
      if (this.type==='add') {
        this.productsDataList.push(this.productsForm.value)
      }else{
        const getIndex=this.productsDataList.findIndex((element:any)=>element?.name===this.productsForm.get('name')?.value)
        if (getIndex!==-1) {
          this.productsDataList[getIndex]=this.productsForm.value
        }
      }
      this.dataManagementService.setLocalStorageData('productList',JSON.stringify(this.productsDataList))
      this.mapChartData()
      this.isVisibleDialogue=false
      this.cdr.markForCheck()
      
    }
    
  }

  /**
   * modalClose - When modal close then reset the flag and reset the form
   */
  modalClose(){
    this.isSubmitted=false
    this.productsForm.reset()
    this.cdr.markForCheck()
  }

  /**
   * onClickEdit - When click on product edit button then this function patch value and open the modal
   */
  onClickEdit(product:any){
    this.productsForm.patchValue(product)
     this.type='edit'
    this.isVisibleDialogue=true
    this.cdr.markForCheck()
  }

  /**
   * onClickRemoveProduct - When click on the delete products then this function remove specific element from the array and update the localstorage
   * @param index 

   */
  onClickRemoveProduct(index:any){
    this.productsDataList.splice(index,1)
    this.dataManagementService.setLocalStorageData('productList',JSON.stringify(this.productsDataList))
    this.mapChartData()
    this.cdr.markForCheck()
  }

  /**
   * mapChartData - This function map the product name and price and update the chart data
   */
  mapChartData(){
    this.productsChartData=this.productsDataList.map((element:any)=>{
      // console.log('element?.price',element?.price);
      return {name:element?.name,value:Number(element?.price)}
    })
    console.log(this.productsChartData);
    
    this.cdr.markForCheck()
  }
}
