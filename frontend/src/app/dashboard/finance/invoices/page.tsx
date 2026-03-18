'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-white/5 text-slate-400',
  sent: 'bg-blue-500/10 text-blue-400',
  paid: 'bg-green-500/10 text-green-400',
  overdue: 'bg-red-500/10 text-red-400',
  cancelled: 'bg-white/5 text-slate-500',
};

const INPUT = 'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition';
const BTN = 'px-5 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50';

interface LineItem { description: string; quantity: number; unitPrice: number; }

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    clientId: '', notes: '', dueDate: '', taxRate: 0, discount: 0,
    lineItems: [{ description: '', quantity: 1, unitPrice: 0 }] as LineItem[],
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiClient.get('/invoices').then(r => setInvoices(r.data?.invoices || r.data || [])).catch(() => {}),
      apiClient.get('/clients').then(r => setClients(r.data || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? invoices : invoices.filter(i => i.status === filter);

  function addLineItem() { setForm(f => ({ ...f, lineItems: [...f.lineItems, { description: '', quantity: 1, unitPrice: 0 }] })); }
  function updateLine(i: number, field: keyof LineItem, value: string | number) {
    setForm(f => { const items = [...f.lineItems]; items[i] = { ...items[i], [field]: field === 'description' ? value : +value }; return { ...f, lineItems: items }; });
  }
  function removeLine(i: number) { setForm(f => ({ ...f, lineItems: f.lineItems.filter((_, idx) => idx !== i) })); }

  const subtotal = form.lineItems.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const tax = subtotal * (form.taxRate / 100);
  const total = subtotal + tax - form.discount;

  async function createInvoice(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clientId) return toast.error('Select a client');
    setCreating(true);
    try {
      const r = await apiClient.post('/invoices', { clientId: form.clientId, notes: form.notes, dueDate: form.dueDate, lineItems: form.lineItems, subtotal, taxAmount: tax, discountAmount: form.discount, total });
      setInvoices(inv => [r.data, ...inv]);
      setShowModal(false);
      setForm({ clientId: '', notes: '', dueDate: '', taxRate: 0, discount: 0, lineItems: [{ description: '', quantity: 1, unitPrice: 0 }] });
      toast.success(`Invoice ${r.data.invoice_number} created`);
    } catch { toast.error('Failed to create invoice'); } finally { setCreating(false); }
  }

  async function markPaid(id: string) {
    try {
      const r = await apiClient.post(`/invoices/${id}/mark-paid`, {});
      setInvoices(inv => inv.map(i => i.id === id ? { ...i, status: 'paid' } : i));
      toast.success('Marked as paid');
    } catch { toast.error('Failed'); }
  }

  async function remove(id: string) {
    if (!confirm('Delete this invoice?')) return;
    try { await apiClient.delete(`/invoices/${id}`); setInvoices(inv => inv.filter(i => i.id !== id)); toast.success('Deleted'); }
    catch { toast.error('Can only delete draft invoices'); }
  }

  const STATUS_TABS = ['all','draft','sent','paid','overdue'];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-display font-bold text-white mb-4">New Invoice</h3>
            <form onSubmit={createInvoice} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-slate-400 block mb-1.5">Client</label>
                  <select className={INPUT} value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))}>
                    <option value="">Select client...</option>
                    {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div><label className="text-sm text-slate-400 block mb-1.5">Due Date</label><input type="date" className={INPUT} value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} /></div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-slate-400">Line Items</label>
                  <button type="button" onClick={addLineItem} className="text-xs text-blue-400 hover:text-blue-300">+ Add Item</button>
                </div>
                <div className="space-y-2">
                  {form.lineItems.map((line, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center">
                      <input className={INPUT + ' col-span-6'} placeholder="Description" value={line.description} onChange={e => updateLine(i, 'description', e.target.value)} />
                      <input type="number" min="1" className={INPUT + ' col-span-2'} placeholder="Qty" value={line.quantity} onChange={e => updateLine(i, 'quantity', e.target.value)} />
                      <input type="number" min="0" step="0.01" className={INPUT + ' col-span-3'} placeholder="Price" value={line.unitPrice} onChange={e => updateLine(i, 'unitPrice', e.target.value)} />
                      <button type="button" onClick={() => removeLine(i)} className="text-slate-500 hover:text-red-400 transition text-lg col-span-1">×</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-slate-400 block mb-1.5">Tax Rate (%)</label><input type="number" min="0" max="100" step="0.01" className={INPUT} value={form.taxRate} onChange={e => setForm(f => ({ ...f, taxRate: +e.target.value }))} /></div>
                <div><label className="text-sm text-slate-400 block mb-1.5">Discount ($)</label><input type="number" min="0" step="0.01" className={INPUT} value={form.discount} onChange={e => setForm(f => ({ ...f, discount: +e.target.value }))} /></div>
              </div>
              <div><label className="text-sm text-slate-400 block mb-1.5">Notes</label><textarea className={INPUT + ' h-16 resize-none'} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
              <div className="border-t border-white/5 pt-3 space-y-1 text-sm">
                <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                {form.taxRate > 0 && <div className="flex justify-between text-slate-400"><span>Tax ({form.taxRate}%)</span><span>${tax.toFixed(2)}</span></div>}
                {form.discount > 0 && <div className="flex justify-between text-slate-400"><span>Discount</span><span>-${form.discount.toFixed(2)}</span></div>}
                <div className="flex justify-between font-bold text-white text-base"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={creating} className={BTN + ' flex-1'}>{creating ? 'Creating...' : 'Create Invoice'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-5 py-2.5 border border-white/10 text-slate-400 rounded-xl text-sm hover:bg-white/5 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Invoices</h1>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/finance/expenses" className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-white/10 rounded-xl transition">Expenses</Link>
          <button onClick={() => setShowModal(true)} className={BTN}>+ New Invoice</button>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {STATUS_TABS.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition ${filter === s ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      <div className="bg-[#0f1117] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Due</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-4 bg-white/5 rounded animate-pulse" /></td></tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-slate-500 text-sm">No invoices found</td></tr>
            ) : filtered.map(inv => (
              <tr key={inv.id} className="hover:bg-white/2 transition">
                <td className="px-5 py-3.5"><p className="text-sm font-mono text-white">{inv.invoice_number}</p></td>
                <td className="px-5 py-3.5"><p className="text-sm text-white">{inv.client_name || '—'}</p></td>
                <td className="px-5 py-3.5"><p className="text-sm font-semibold text-white">${Number(inv.total_amount).toLocaleString()}</p></td>
                <td className="px-5 py-3.5"><span className={`text-xs px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[inv.status] || 'bg-white/5 text-slate-400'}`}>{inv.status}</span></td>
                <td className="px-5 py-3.5"><p className="text-sm text-slate-400">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '—'}</p></td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2 justify-end">
                    {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                      <button onClick={() => markPaid(inv.id)} className="text-xs text-green-400 hover:text-green-300 border border-green-500/20 rounded-lg px-2 py-1">Mark Paid</button>
                    )}
                    {inv.status === 'draft' && (
                      <button onClick={() => remove(inv.id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
