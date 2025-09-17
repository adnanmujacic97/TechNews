import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  ime: string;
  prezime: string;
  username: string;
  password: string;  
  email: string;
}

@Injectable({
  providedIn: 'root'
})



export class UserService {
  private apiUrl = 'http://localhost/technews/api/get-user.php'; // PHP backend

  constructor(private http: HttpClient) { }

  getUser(): Observable<{ success: boolean; data?: User; message?: string }> {
    return this.http.get<{ success: boolean; data?: User; message?: string }>(this.apiUrl);
  }
}