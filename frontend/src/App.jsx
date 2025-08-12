import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import Router from './Router';
import { AppContextProvider } from './context/AppContextProvider';

function App() {

  const queryClient = new QueryClient();
 
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <Router />
      </AppContextProvider>
    </QueryClientProvider>
  )
}

export default App
