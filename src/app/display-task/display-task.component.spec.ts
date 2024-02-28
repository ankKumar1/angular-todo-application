import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { DisplayTaskComponent } from './display-task.component';
import { ToDoService } from '../to-do.service';
import { of } from 'rxjs';
import { ToDoFilterPipe } from '../pipes/to-do-filter.pipe';
import { ToDos } from '../to-dos';

describe('DisplayTaskComponent', () => {
  let component: DisplayTaskComponent;
  let fixture: ComponentFixture<DisplayTaskComponent>;
  let mockToDoService: jasmine.SpyObj<ToDoService>;

  beforeEach(() => {
    mockToDoService = jasmine.createSpyObj('ToDoService', [
      'getToDoData',
      'deleteToDoData',
      'pushToDoData',
      'updateToDoData'
    ]);

    TestBed.configureTestingModule({
      declarations: [DisplayTaskComponent, ToDoFilterPipe],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [{ provide: ToDoService, useValue: mockToDoService }]
    });

    fixture = TestBed.createComponent(DisplayTaskComponent);
    component = fixture.componentInstance;
    component.todo = new FormGroup({
        value: new FormControl(),
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize todos on ngOnInit', fakeAsync(() => {
    mockToDoService.getToDoData.and.returnValue(of([]));

    component.ngOnInit();
    tick();

    expect(component.todos).toEqual([]);
  }));

  it('should delete todo and update todos', () => {
    const idToDelete = 1;
    const mockData = { message: 'Successfully deleted' };
    const mockTodos = ['todo2', 'todo3'];

    // Mock the deleteToDoData method
    mockToDoService.deleteToDoData.and.returnValue(of(mockData));

    // Mock the getToDoData method
    mockToDoService.getToDoData.and.returnValue(of(mockTodos));

    // Call onDelete method
    component.onDelete(idToDelete);

    // Verify that deleteToDoData was called with the correct id
    expect(mockToDoService.deleteToDoData).toHaveBeenCalledWith(idToDelete);

    // Verify that getToDoData was called to update todos
    expect(mockToDoService.getToDoData).toHaveBeenCalled();

    // Verify that the todos property has been updated with the new data
    expect(component.todos).toEqual(mockTodos);
  });

  it('should set todo value, userToDo, and toggler on edit', () => {
    const todoToEdit = {
      userId: 1,
      id: 101,
      title: 'Sample Todo',
      completed: false,
    };

    // Call onEdit method
    component.onEdit(todoToEdit);

    // Verify that todo value has been set
    expect(component.todo.value.title).toBe(todoToEdit.title);

    // Verify that userToDo has been set
    expect(component.userToDo).toEqual(todoToEdit);

    // Verify that toggler is set to true
    expect(component.toggler).toBe(true);
  });

  it('should update todo, reset form, and update todos', () => {
    const newName = 'Updated Todo';
    component.toggler = false; // Set initial value
    component.userToDo = component.userToDo ?? { userId: 1, id: 1, title: '', completed: false };
    // Mock the updateToDoData method
    mockToDoService.updateToDoData.and.returnValue(of({ message: 'Successfully updated' }));

    // Mock the getToDoData method
    mockToDoService.getToDoData.and.returnValue(of([{ id: 1, title: 'Updated Todo', completed: false }]));

    // Call onUpdate method
    component.onUpdate(newName);

    // Verify that toggler is toggled
    expect(component.toggler).toBe(true);

    // Verify that userToDo title is updated
    expect(component.userToDo?.title).toBe(newName);

    // Verify that updateToDoData was called with the correct userToDo
    expect(mockToDoService.updateToDoData).toHaveBeenCalledWith(component.userToDo);

    // Verify that getToDoData was called to update todos
    expect(mockToDoService.getToDoData).toHaveBeenCalled();

    // Verify that the todos property has been updated with the new data
    expect(component.todos).toEqual([{ id: 1, title: 'Updated Todo', completed: false }]);

    // Verify that the form has been reset
    expect(component.todo.get('value')?.value).toBe(null);
  });

  it('should update todo, reset form, and update todos when userTodo is empty', () => {
    const newName = 'Updated Todo';
    component.toggler = false; 
    component.userToDo = undefined;
    // Mock the updateToDoData method
    mockToDoService.updateToDoData.and.returnValue(of({ message: 'Successfully updated' }));

    // Mock the getToDoData method
    mockToDoService.getToDoData.and.returnValue(of([{ id: 1, title: 'Updated Todo', completed: false }]));

    // Call onUpdate method
    component.onUpdate(newName);

    // Verify that toggler is toggled
    expect(component.toggler).toBe(true);

    // Verify that getToDoData was called to update todos
    expect(mockToDoService.getToDoData).toHaveBeenCalled();

    // Verify that the todos property has been updated with the new data
    expect(component.todos).toEqual([{ id: 1, title: 'Updated Todo', completed: false }]);

    // Verify that the form has been reset
    expect(component.todo.get('value')?.value).toBe(null);
  });
  
  it('should show alert for invalid title onSubmit', () => {
    spyOn(window, 'alert'); // Spy on the alert function

    // Set the title to an empty string
    component.todo.value.title = "";

    // Call onSubmit method
    component.onSubmit();

    // Verify that alert was called with the correct message
    expect(window.alert).toHaveBeenCalledWith('Title not valid');
  });

  it('should submit valid todo and update todos', () => {
    const mockUser = { userId: 1, id:2, title: 'New Todo', completed: false };
    const mockTodos = [{ id: 2, title: 'Existing Todo', completed: false }];
    component.todos = [{id: 1, title: 'Existing Todo', completed: false }]
    // Set the title to a valid value
    component.todo.value.title = "New Todo";

    // Mock the pushToDoData method
    mockToDoService.pushToDoData.and.returnValue(of({ message: 'Successfully pushed' }));

    // Mock the getToDoData method
    mockToDoService.getToDoData.and.returnValue(of(mockTodos));

    // Call onSubmit method
    component.onSubmit();

    // Verify that pushToDoData was called with the correct user
    expect(mockToDoService.pushToDoData).toHaveBeenCalledWith(mockUser);

    // Verify that getToDoData was called to update todos
    expect(mockToDoService.getToDoData).toHaveBeenCalled();

    // Verify that the todos property has been updated with the new data
    expect(component.todos).toEqual(mockTodos);

    // Verify that the form has been reset
    expect(component.todo.get('value')?.value).toBe(null);
  });
  it('should toggle todo completion status and update todos', () => {
    const mockTodo: ToDos = { userId: 1, id: 101, title: 'Sample Todo', completed: false };
    const mockTodos: ToDos[] = [{ userId: 1, id: 101, title: 'Sample Todo', completed: true }];

    // Set the initial value for userToDo
    component.userToDo = mockTodo;

    // Mock the updateToDoData method
    mockToDoService.updateToDoData.and.returnValue(of({ message: 'Successfully updated' }));

    // Mock the getToDoData method
    mockToDoService.getToDoData.and.returnValue(of(mockTodos));

    // Call toggleEditable method
    component.toggleEditable(mockTodo);

    // Verify that todo.completed is toggled
    expect(mockTodo.completed).toBe(true);

    // Verify that updateToDoData was called with the correct todo
    expect(mockToDoService.updateToDoData).toHaveBeenCalledWith(mockTodo);

    // Verify that getToDoData was called to update todos
    expect(mockToDoService.getToDoData).toHaveBeenCalled();

    // Verify that the todos property has been updated with the new data
    expect(component.todos).toEqual(mockTodos);
  });
});

describe('DisplayTaskComponent Service Not available', () => {
  let component: DisplayTaskComponent;
  let fixture: ComponentFixture<DisplayTaskComponent>;
  let mockToDoService: jasmine.SpyObj<ToDoService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayTaskComponent, ToDoFilterPipe],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [{ provide: ToDoService, useValue: mockToDoService }]
    });

    fixture = TestBed.createComponent(DisplayTaskComponent);
    component = fixture.componentInstance;
  });

  it('should set todos to an empty array when todoService is not available', () => {
    component.ngOnInit();
    expect(component.todos).toEqual([]);
  });
})