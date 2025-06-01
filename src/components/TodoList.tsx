
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X, List, ListCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

type FilterType = 'all' | 'active' | 'completed';
type SortType = 'newest' | 'oldest' | 'alphabetical';

const TodoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('newest');
  const [inputError, setInputError] = useState('');

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
  }, [tasks]);

  const validateTask = (text: string): string => {
    if (!text.trim()) {
      return 'Task cannot be empty';
    }
    if (text.trim().length < 2) {
      return 'Task must be at least 2 characters long';
    }
    if (text.trim().length > 100) {
      return 'Task cannot exceed 100 characters';
    }
    if (tasks.some(task => task.text.toLowerCase() === text.trim().toLowerCase())) {
      return 'This task already exists';
    }
    return '';
  };

  const addTask = () => {
    const trimmedText = inputValue.trim();
    const error = validateTask(trimmedText);
    
    if (error) {
      setInputError(error);
      return;
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: trimmedText,
      completed: false,
      createdAt: new Date()
    };

    setTasks(prev => [...prev, newTask]);
    setInputValue('');
    setInputError('');
    toast({
      title: "Task added",
      description: "Your task has been successfully added to the list.",
    });
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task removed",
      description: "The task has been deleted from your list.",
    });
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const clearCompleted = () => {
    const completedCount = tasks.filter(task => task.completed).length;
    setTasks(prev => prev.filter(task => !task.completed));
    if (completedCount > 0) {
      toast({
        title: "Completed tasks cleared",
        description: `${completedCount} completed task${completedCount > 1 ? 's' : ''} removed.`,
      });
    }
  };

  const getFilteredTasks = () => {
    let filtered = tasks;
    
    switch (filter) {
      case 'active':
        filtered = tasks.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = tasks.filter(task => task.completed);
        break;
      default:
        filtered = tasks;
    }

    switch (sort) {
      case 'oldest':
        return filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      case 'alphabetical':
        return filtered.sort((a, b) => a.text.localeCompare(b.text));
      default:
        return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (inputError) {
      setInputError('');
    }
  };

  const filteredTasks = getFilteredTasks();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <List className="w-6 h-6" />
            Todo List
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Task Input */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Add a new task..."
                className={`${inputError ? 'border-red-500' : ''}`}
              />
              {inputError && (
                <p className="text-red-500 text-sm mt-1">{inputError}</p>
              )}
            </div>
            <Button onClick={addTask} className="px-4">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm text-gray-600">
            <Badge variant="outline">Total: {totalTasks}</Badge>
            <Badge variant="outline">Active: {activeTasks}</Badge>
            <Badge variant="outline">Completed: {completedTasks}</Badge>
          </div>

          {/* Filters and Sorting */}
          {totalTasks > 0 && (
            <div className="flex gap-4 flex-wrap">
              <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={(value: SortType) => setSort(value)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>

              {completedTasks > 0 && (
                <Button variant="outline" size="sm" onClick={clearCompleted}>
                  Clear Completed
                </Button>
              )}
            </div>
          )}

          {/* Task List */}
          <div className="space-y-2">
            {filteredTasks.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {totalTasks === 0 
                  ? "No tasks yet. Add one above!" 
                  : "No tasks match the current filter."}
              </p>
            ) : (
              filteredTasks.map(task => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                    task.completed 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-white border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTask(task.id)}
                    className={`p-1 ${
                      task.completed 
                        ? 'text-green-600 hover:text-green-700' 
                        : 'text-gray-400 hover:text-green-600'
                    }`}
                  >
                    {task.completed ? <Check className="w-4 h-4" /> : <div className = "w-4 h-4 border rounded" />}
                  </Button>
                  
                  <span
                    className={`flex-1 ${
                      task.completed 
                        ? 'line-through text-gray-500' 
                        : 'text-gray-900'
                    }`}
                  >
                    {task.text}
                  </span>
                  
                  <span className="text-xs text-gray-400">
                    {task.createdAt.toLocaleDateString()}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTask(task.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoList;
