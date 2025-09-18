import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';



@Injectable({
  providedIn: 'root'
})



export class UserService {
  private apiUrl = 'http://localhost/api/get-user.php'; // PHP backend

  constructor(private http: HttpClient) { }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(this.apiUrl, { params: { username } });
  }
}