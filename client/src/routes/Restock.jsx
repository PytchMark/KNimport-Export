import { useLocation } from 'react-router-dom';
import StepForm from '../components/StepForm';

export default function Restock() {
  const { state } = useLocation();
  return (
    <div className="space-y-3 p-4">
      <h1 className="text-2xl font-bold">Need Produce Quickly?</h1>
      <p className="text-sm text-slate-300">Send your urgent quantity + delivery timing and K&N will coordinate the fastest route.</p>
      <StepForm type="restock" initialItems={state?.prefillItems || []} />
    </div>
  );
}
