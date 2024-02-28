import { ToDoFilterPipe } from './to-do-filter.pipe';

describe('ToDoFilterPipe', () => {
    let pipe: ToDoFilterPipe;
  
    beforeEach(() => {
      pipe = new ToDoFilterPipe();
    });
  
    it('should create an instance of ToDoFilterPipe', () => {
      expect(pipe).toBeTruthy();
    });
  
    it('should return an empty array if input value is undefined', () => {
      const result = pipe.transform(undefined, 'searchTerm');
      expect(result).toEqual([]);
    });
  
    it('should return an empty array if input value is an empty array', () => {
      const result = pipe.transform([], 'searchTerm');
      expect(result).toEqual([]);
    });
  
    it('should return the original array if filterString is an empty string', () => {
      const todos = [
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' },
        { id: 3, title: 'Task 3' }
      ];
  
      const result = pipe.transform(todos, '');
      expect(result).toEqual(todos);
    });
  
    it('should filter todos based on the filterString', () => {
      const todos = [
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' },
        { id: 3, title: 'Another Task' }
      ];
  
      const result = pipe.transform(todos, 'task');
      expect(result).toEqual([
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' },
        { id: 3, title: 'Another Task' }
      ]);
    });
  
    it('should be case-insensitive when filtering', () => {
      const todos = [
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' },
        { id: 3, title: 'Another Task' }
      ];
  
      const result = pipe.transform(todos, 'TASK');
      expect(result).toEqual([
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' },
        { id: 3, title: 'Another Task' }
      ]);
    });
});