import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataManagementService {

  constructor() { }

  /**Set local storage data */
  setLocalStorageData(key:any,value:any){
    localStorage.setItem(key,value)
  }

  /**Get local storage data */
  getData(key:any){
    return localStorage.getItem(key)
  }

  /**Remove data from local storage */
  removeData(key:any){
    localStorage.removeItem((key))
  }
  
}
