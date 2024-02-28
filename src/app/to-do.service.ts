import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { ToDos } from './to-dos';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {
  todos?:ToDos;
  constructor(private http:HttpClient) { }
  readonly APIurl="http://localhost:3000/todos";
  getToDoData(){
    return this.http.get(this.APIurl);
  }
  deleteToDoData(id:any){
    return this.http.delete("http://localhost:3000/todos/"+id);
  }
  pushToDoData(todo:ToDos){
    return this.http.post(this.APIurl,todo);
  }
  updateToDoData(todo:ToDos){
    return this.http.put(this.APIurl+"/"+todo.id,todo);
  }
}
