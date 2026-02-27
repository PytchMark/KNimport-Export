import { useLocation } from 'react-router-dom';
import StepForm from '../components/StepForm';

export default function Reserve() {
  const { state } = useLocation();
  return <div className="p-4"><h1 className="mb-3 text-2xl font-bold">Reserve Next Shipment</h1><StepForm type="reserve" initialItems={state?.prefillItems || []} /></div>;
}
