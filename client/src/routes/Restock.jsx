import { useLocation } from 'react-router-dom';
import StepForm from '../components/StepForm';

export default function Restock() {
  const { state } = useLocation();
  return <div className="p-4"><h1 className="mb-3 text-2xl font-bold">Quick Restock Request</h1><StepForm type="restock" initialItems={state?.prefillItems || []} /></div>;
}
