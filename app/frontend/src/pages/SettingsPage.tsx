import { useEffect, useState } from 'react';
import { settings as settingsApi } from '../services/api';
import { Save } from 'lucide-react';

const SETTING_KEYS = [
  { key: 'company_name', label: 'Company Name', type: 'text' },
  { key: 'currency', label: 'Currency', type: 'text' },
  { key: 'late_fee_rate', label: 'Late Fee Rate (%)', type: 'number' },
  { key: 'grace_period_days', label: 'Grace Period (days)', type: 'number' },
  { key: 'daily_penalty_rate', label: 'Daily Penalty Rate (%)', type: 'number' },
];

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const results = await Promise.allSettled(SETTING_KEYS.map((s) => settingsApi.get(s.key)));
      const map: Record<string, string> = {};
      results.forEach((r, i) => {
        if (r.status === 'fulfilled' && r.value.success) {
          map[SETTING_KEYS[i].key] = r.value.data.value ?? '';
        }
      });
      setValues(map);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(key: string) {
    setSaving(key);
    try {
      await settingsApi.set(key, values[key]);
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } finally { setSaving(null); }
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Loading…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-xl">
        <div className="space-y-5">
          {SETTING_KEYS.map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <div className="flex gap-2">
                <input
                  type={type}
                  value={values[key] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={() => handleSave(key)}
                  disabled={saving === key}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    saved === key
                      ? 'bg-green-50 text-green-600 border border-green-200'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  } disabled:opacity-60`}
                >
                  <Save size={14} /> {saved === key ? 'Saved!' : saving === key ? '…' : 'Save'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
