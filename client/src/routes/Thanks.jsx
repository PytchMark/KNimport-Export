import { useParams } from 'react-router-dom';

export default function Thanks() {
  const { referenceId } = useParams();
  const msg = encodeURIComponent(`Hi K&N, I just submitted request ${referenceId}.`);
  return <div className="p-4"><h1 className="text-2xl font-bold">Request received ✅</h1><p className="mt-2">Reference ID: {referenceId}</p><a className="mt-3 inline-block rounded bg-emerald-500 px-3 py-2" href={`https://wa.me/18760000000?text=${msg}`}>Send WhatsApp with reference</a></div>;
}
