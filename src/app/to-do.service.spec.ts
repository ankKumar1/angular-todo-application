import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToDoService } from './to-do.service';
import { ToDos } from './to-dos';

describe('ToDoService', () => {
  let service: ToDoService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ToDoService]
    });

    // Inject the service (which imports the HttpClient) and the Test Controller
    service = TestBed.inject(ToDoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch todo data', () => {
    const dummyTodos: ToDos[] = [
      { id: 1, userId: 1, title: 'Task 1', completed: false },
      { id: 2, userId: 1, title: 'Task 2', completed: true }
    ];

    service.getToDoData().subscribe(todos => {
      expect(todos).toEqual(dummyTodos);
    });

    const req = httpTestingController.expectOne('http://localhost:3000/todos');
    expect(req.request.method).toBe('GET');
    req.flush(dummyTodos);
  });

  it('should delete todo data', () => {
    const todoId = 1;

    service.deleteToDoData(todoId).subscribe(() => {
    });

    const req = httpTestingController.expectOne(`http://localhost:3000/todos/${todoId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should push todo data', () => {
    const newTodo: ToDos = { id: 3, userId: 1, title: 'New Task', completed: false };

    service.pushToDoData(newTodo).subscribe(() => {
    });

    const req = httpTestingController.expectOne('http://localhost:3000/todos');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should update todo data', () => {
    const updatedTodo: ToDos = { id: 1, userId: 1, title: 'Updated Task', completed: true };

    service.updateToDoData(updatedTodo).subscribe(() => {
    });

    const req = httpTestingController.expectOne(`http://localhost:3000/todos/${updatedTodo.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });
});
