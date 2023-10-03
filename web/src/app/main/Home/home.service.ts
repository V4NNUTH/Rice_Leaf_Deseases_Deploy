import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'environments/environment';
import { Observable, catchError } from 'rxjs';
import { from } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  // Fetch disease information based on disease name
  

    
  private _apiUrl = env.apiUrl;

  public httpOptions = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  public httpOptionsFormData = {
    headers: new HttpHeaders().set('Content-Type', 'multipart/form-data'),
  };
    constructor(private _http: HttpClient) {}

    getDiseaseInfo(diseaseName: string): Observable<any> {
      return this._http.get(`${this._apiUrl}/get_disease_info/${diseaseName}`, this.httpOptions);
    }
  
  





  
  getData(file: any): Observable<any> {
    const formData = new FormData();
    formData.append('imagefile', file.file);

    return from(
      axios
        .post(`${this._apiUrl}`, formData, {
            headers:{ 'Content-Type': 'multipart/form-data' ,}
        })
        .then((response) => response.data)
    );
  }

}
