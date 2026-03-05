import { useParams } from 'react-router-dom';

export default function Thanks() {
  const { referenceId } = useParams();
  const msg = encodeURIComponent(`Hi K&N, I just submitted request ${referenceId}.`);

  return (
    <div className="space-y-3 p-4">
      <h1 className="text-2xl font-bold">Thank you.</h1>
      <p>Your request has been received.</p>
      <p className="text-sm text-slate-300">Reference ID: {referenceId}</p>
      <p className="text-sm text-slate-300">Our team will confirm availability and next steps within 24 hours.</p>
      <a className="inline-block rounded bg-emerald-500 px-3 py-2 text-slate-950" href={`https://wa.me/18760000000?text=${msg}`}>Send WhatsApp with reference</a>
    </div>
  );
}
