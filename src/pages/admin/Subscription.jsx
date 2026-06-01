import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Users, Plus, Edit2, Trash2, CheckCircle2, Loader2, X, Save } from "lucide-react";
import { SectionHeading, Badge } from "../../components/ui/index.jsx";
import { Panel, IconTile } from "../../components/dashboard/shared.jsx";
import { subscriptionApi } from "../../services/api";
import { USE_MOCK } from "../../services/api";
import { pricingPlans } from "../../data/mockData";

function usePlans() {
  const [plans, setPlans]     = useState([]);
  const [loading, setLoading] = useState(!USE_MOCK);

  const load = async () => {
    if (USE_MOCK) { setPlans(pricingPlans || []); return; }
    try {
      const r = await subscriptionApi.getPlans();
      setPlans(r.results || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  return { plans, loading, reload: load };
}

const EMPTY_PLAN = { name: "", slug: "", plan_type: "pro", price_usd: "", price_uzs: "", billing_cycle: "monthly",
  ai_essay_checks_per_month: -1, is_active: true, is_popular: false };

export default function AdminSubscription() {
  const { plans, loading, reload } = usePlans();
  const [modal, setModal]   = useState(null); // null | 'create' | 'edit'
  const [form, setForm]     = useState(EMPTY_PLAN);
  const [saving, setSaving] = useState(false);
  const [grantModal, setGrantModal] = useState(false);
  const [grant, setGrant]   = useState({ user_id: "", plan_id: "", days: 30 });

  const openCreate = () => { setForm(EMPTY_PLAN); setModal("create"); };
  const openEdit   = (p)  => {
    setForm({ name: p.name, slug: p.slug, plan_type: p.plan_type,
      price_usd: p.price_usd, price_uzs: p.price_uzs,
      billing_cycle: p.billing_cycle, ai_essay_checks_per_month: p.ai_essay_checks_per_month,
      is_active: p.is_active, is_popular: p.is_popular, _id: p.id });
    setModal("edit");
  };

  const save = async () => {
    setSaving(true);
    try {
      if (modal === "create") await subscriptionApi.adminCreate(form);
      else await subscriptionApi.adminUpdate(form._id, form);
      setModal(null); reload();
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const deletePlan = async (id) => {
    if (!confirm("O'chirilsinmi?")) return;
    try { await subscriptionApi.adminDelete(id); reload(); }
    catch (e) { alert(e.message); }
  };

  const grantSub = async () => {
    setSaving(true);
    try {
      await subscriptionApi.adminGrant({ user_id: parseInt(grant.user_id), plan_id: parseInt(grant.plan_id), days: parseInt(grant.days) });
      setGrantModal(false); setGrant({ user_id: "", plan_id: "", days: 30 });
      alert("Obuna berildi!");
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary-400" /></div>;

  const ModalInput = ({ label, field, type = "text", ...rest }) => (
    <div>
      <label className="text-xs text-white/50 mb-1 block">{label}</label>
      <input type={type} value={form[field] ?? ""} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-primary-500/50" {...rest} />
    </div>
  );

  return (
    <div className="space-y-7">
      <SectionHeading title="Tarif rejalari" subtitle="Subscription planlarni boshqarish"
        action={
          <div className="flex gap-2">
            <button onClick={() => setGrantModal(true)}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 hover:text-white flex items-center gap-2">
              <Users className="h-4 w-4" /> Obuna berish
            </button>
            <button onClick={openCreate} className="btn-primary text-sm">
              <Plus className="h-4 w-4" /> Yangi plan
            </button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p, i) => (
          <motion.div key={p.id || i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass rounded-2xl p-6 relative">
            {p.is_popular && <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-primary-500 px-3 py-0.5 text-[10px] font-medium text-white">Mashhur</div>}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white text-lg">{p.name}</h3>
                <div className="text-xs text-white/40 mt-0.5">{p.plan_type} · {p.billing_cycle}</div>
              </div>
              <Badge color={p.is_active ? "green" : "gray"}>{p.is_active ? "Faol" : "Nofaol"}</Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              ${p.price_usd || "0"}
              <span className="text-sm font-normal text-white/40">/{p.billing_cycle === "forever" ? "abadiy" : "oy"}</span>
            </div>
            {p.price_uzs && <div className="text-xs text-white/40 mb-4">{parseInt(p.price_uzs).toLocaleString()} UZS</div>}
            <div className="text-sm text-white/60 mb-4">
              AI insho: {p.ai_essay_checks_per_month === -1 ? "Cheksiz" : p.ai_essay_checks_per_month} ta/oy
            </div>
            {!USE_MOCK && (
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)}
                  className="flex-1 rounded-xl border border-white/10 py-2 text-xs text-white/60 hover:text-white flex items-center justify-center gap-1">
                  <Edit2 className="h-3.5 w-3.5" /> Tahrirlash
                </button>
                <button onClick={() => deletePlan(p.id)}
                  className="rounded-xl border border-rose-500/20 py-2 px-3 text-xs text-rose-400 hover:bg-rose-500/10">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Create/Edit modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium text-white">{modal === "create" ? "Yangi plan" : "Tahrirlash"}</h3>
              <button onClick={() => setModal(null)} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <ModalInput label="Nomi" field="name" />
              <ModalInput label="Slug" field="slug" />
              <div>
                <label className="text-xs text-white/50 mb-1 block">Plan turi</label>
                <select value={form.plan_type} onChange={(e) => setForm({ ...form, plan_type: e.target.value })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none bg-[#0D1117]">
                  {["starter","pro","academy"].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ModalInput label="Narx (USD)" field="price_usd" type="number" />
                <ModalInput label="Narx (UZS)" field="price_uzs" type="number" />
              </div>
              <ModalInput label="AI insho/oy (-1=cheksiz)" field="ai_essay_checks_per_month" type="number" />
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                  Faol
                </label>
                <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                  <input type="checkbox" checked={form.is_popular} onChange={(e) => setForm({ ...form, is_popular: e.target.checked })} />
                  Mashhur
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setModal(null)} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/60">Bekor</button>
              <button onClick={save} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Saqlash</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Grant subscription modal */}
      {grantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass w-full max-w-sm rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium text-white">Foydalanuvchiga obuna berish</h3>
              <button onClick={() => setGrantModal(false)} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/50 mb-1 block">Foydalanuvchi ID</label>
                <input type="number" value={grant.user_id} onChange={(e) => setGrant({ ...grant, user_id: e.target.value })}
                  placeholder="Masalan: 5"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-primary-500/50" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Plan</label>
                <select value={grant.plan_id} onChange={(e) => setGrant({ ...grant, plan_id: e.target.value })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none bg-[#0D1117]">
                  <option value="">Plan tanlang</option>
                  {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Kunlar soni</label>
                <input type="number" value={grant.days} onChange={(e) => setGrant({ ...grant, days: e.target.value })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-primary-500/50" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setGrantModal(false)} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/60">Bekor</button>
              <button onClick={grantSub} disabled={saving || !grant.user_id || !grant.plan_id}
                className="btn-primary flex-1 disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="h-4 w-4" /> Berish</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
