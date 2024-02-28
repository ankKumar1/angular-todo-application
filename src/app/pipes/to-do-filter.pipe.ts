import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toDoFilter'
})
export class ToDoFilterPipe implements PipeTransform {

  transform(value:any,filterString:any){
    if(value==undefined || value.length==0){return []}
    if(filterString==""){
      return value
    }
    let todos=value.filter( (title:any) => title.title.toLowerCase().includes(filterString.toLowerCase()));
    return todos;
  }

}