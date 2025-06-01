
import TodoList from '@/components/TodoList';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Task Manager
          </h1>
          <p className="text-lg text-gray-600">
            Stay organized and productive with your personal todo list
          </p>
        </div>
        <TodoList />
      </div>
    </div>
  );
};

export default Index;
