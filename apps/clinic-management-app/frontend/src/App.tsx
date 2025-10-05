import { Button } from '@portfolio/ui-components';
import { formatDate } from '@portfolio/utils';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">clinic-management-app</h1>
        <p className="text-gray-600 mb-4">Created: {formatDate(new Date())}</p>
        <Button onClick={() => alert('Hello!')}>Click Me</Button>
      </div>
    </div>
  );
}

export default App;
