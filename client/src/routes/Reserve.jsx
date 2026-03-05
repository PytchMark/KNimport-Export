import { useLocation } from 'react-router-dom';
import StepForm from '../components/StepForm';

export default function Reserve() {
  const { state } = useLocation();
  return (
    <div className="space-y-3 p-4">
      <h1 className="text-2xl font-bold">Reserve Produce From the Next Shipment</h1>
      <p className="text-sm text-slate-300">Secure fresh produce before it arrives to ensure consistent supply for your business.</p>
      <StepForm type="reserve" initialItems={state?.prefillItems || []} />
    </div>
  );
}
