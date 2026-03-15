'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';
import Link from 'next/link';

const CATEGORIES = ['Software', 'Hardware', 'Marketing', 'Travel', 'Office', 'Freelancer', 'Ads', 'Other'];
const INPUT = 'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition';
const BTN = 'px-5 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ amount: '', category: 'Other', date: new Date().toISOString().split('T')[0], description: '', vendor: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    apiClient.get('/invoices/expenses').then(r => setExpenses(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.amount || !form.date) return toast.error('Amount and date required');
    setCreating(true);
    try {
      const r = await apiClient.post('/invoices/expenses', { ...form, amount: parseFloat(form.amount) });
      setExpenses(ex => [r.data, ...ex]);
      setShowModal(false);
      setForm({ amount: '', category: 'Other', date: new Date().toISOString().split('T')[0], description: '', vendor: '' });
      toast.success('Expense added');
    } catch { toast.error('Failed to add expense'); } finally { setCreating(false); }
  }

  async function remove(id: string) {
    if (!confirm('Delete this expense?')) return;
    try { await apiClient.delete(`/invoices/expenses/${id}`); setExpenses(ex => ex.filter(e => e.id !== id)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  }

  const total = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-display font-bold text-white mb-4">New Expense</h3>
            <form onSubmit={create} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-400 block mb-1.5">Amount ($)</label>
                  <input type="number" min="0" step="0.01" className={INPUT} value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" required />
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-1.5">Date</label>
                  <input type="date" className={INPUT} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1.5">Category</label>
                <select className={INPUT} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1.5">Vendor / Paid to</label>
                <input className={INPUT} value={form.vendor} onChange={e => setForm(f => ({ ...f, vendor: e.target.value }))} placeholder="e.g. Adobe, AWS..." />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1.5">Description</label>
                <input className={INPUT} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What was this for?" />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={creating} className={BTN + ' flex-1'}>{creating ? 'Adding...' : 'Add Expense'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-5 py-2.5 border border-white/10 text-slate-400 rounded-xl text-sm hover:bg-white/5 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Expenses</h1>
          <p className="text-slate-400 text-sm mt-0.5">Total: <span className="text-white font-semibold">${total.toLocaleString('en', { minimumFractionDigits: 2 })}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/finance/invoices" className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-white/10 rounded-xl transition">Invoices</Link>
          <button onClick={() => setShowModal(true)} className={BTN}>+ Add Expense</button>
        </div>
      </div>

      <div className="bg-[#0f1117] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendor</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-4 bg-white/5 rounded animate-pulse" /></td></tr>
              ))
            ) : expenses.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-slate-500 text-sm">No expenses recorded yet</td></tr>
            ) : expenses.map(exp => (
              <tr key={exp.id} className="hover:bg-white/2 transition">
                <td className="px-5 py-3.5 text-sm text-slate-400">{new Date(exp.date).toLocaleDateString()}</td>
                <td className="px-5 py-3.5">
                  <span className="text-xs bg-white/5 text-slate-300 px-2 py-1 rounded-lg">{exp.category}</span>
                </td>
                <td className="px-5 py-3.5 text-sm text-white">{exp.description || '—'}</td>
                <td className="px-5 py-3.5 text-sm text-slate-400">{exp.vendor || '—'}</td>
                <td className="px-5 py-3.5 text-sm font-semibold text-white text-right">${parseFloat(exp.amount).toLocaleString('en', { minimumFractionDigits: 2 })}</td>
                <td className="px-5 py-3.5 text-right">
                  <button onClick={() => remove(exp.id)} className="text-xs text-red-400 hover:text-red-300 transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
