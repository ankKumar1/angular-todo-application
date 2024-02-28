import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { ToDoService } from '../to-do.service';
import { ToDos } from '../to-dos';


@Component({
  selector: 'app-display-task',
  templateUrl: './display-task.component.html',
  styleUrls: ['./display-task.component.scss']
})
export class DisplayTaskComponent implements OnInit {
  userToDo?:ToDos;
  todos?:any;
  title:string="";
  toggler?:boolean=false;
  todo = new FormGroup({
    title: new FormControl('',[Validators.required])
  })
  constructor( public todoService:ToDoService) {
   }

  ngOnInit(): void {
    if(this.todoService){
      this.todoService.getToDoData().subscribe((todos)=>{
        this.todos=todos;
      });
    }
    else{
      this.todos=[];
    }
  }
  // deleting based on ID
  onDelete(id:number){
    this.todoService.deleteToDoData(id).subscribe((data:any)=>{
      console.log(data);
      this.todoService.getToDoData().subscribe((todos)=>{
        this.todos=todos;
      });
    })
  }
  //Pushing the data
  onSubmit(){
    if(this.todo.value.title==""){
      alert("Title not valid")
    }
    else{
      let user={
        userId: 1,
        id: this.todos[this.todos.length-1].id+1,
        title: this.todo.value.title,
        completed: false
      };
      this.todoService.pushToDoData(user).subscribe((data)=>{
        this.todoService.getToDoData().subscribe((todos)=>{
          this.todos=todos;
        });
      });
      this.todo.reset();
    }
  }

  // on edit click this method will call and assign existing values to the user since todo.
  // title is two way binded so in onEdit change todo.title.value to latest so it will appear on input form 
  onEdit(todo:ToDos){
    this.todo.value.title=todo.title;
    this.userToDo={
      userId:todo.userId,
      id:todo.id,
      title:todo.title,
      completed:todo.completed,
    }
    this.toggler=true;
  }

  //OnUpdate it takes name and chenges title in user and send to updateToDoData to update that todo
  onUpdate(name:any){
    this.toggler=!this.toggler;
    if(this.userToDo){
      this.userToDo.title=name;
    }
    else{
      this.userToDo={};
    }
    console.log(this.userToDo);
    this.todoService.updateToDoData(this.userToDo).subscribe((data:any)=>{
      console.log(data);
      this.todoService.getToDoData().subscribe((todos)=>{
        this.todos=todos;
      });
    })
    this.todo.reset();
  }

  toggleEditable(todo:ToDos) { 
    todo.completed=!todo.completed,
    console.log(this.userToDo)
    this.todoService.updateToDoData(todo).subscribe((data:any)=>{
      console.log(data);
      this.todoService.getToDoData().subscribe((todos)=>{
        this.todos=todos;
      });
    });
  }

}
