
import React, { useState, useEffect } from 'react';
import { CompanyConfig, Product } from '../types';
import { supabase } from '../lib/supabase';
import { LOGO_URL } from '../constants';

interface AdminPanelProps {
  onClose: () => void;
  config: CompanyConfig | null;
  products: Product[];
  onRefresh: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, config, products, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'config' | 'odoo' | 'orders'>('config');
  const [formData, setFormData] = useState<any>(config || {});
  const [orders, setOrders] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Asegurarse de que el formData se actualice cuando cargue el config
  useEffect(() => {
    if (config) setFormData(config);
  }, [config]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    setOrders(data || []);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('settings')
        .update({
          company_name: formData.company_name,
          logo_url: formData.logo_url,
          whatsapp_number: formData.whatsapp_number,
          facebook_url: formData.facebook_url,
          instagram_url: formData.instagram_url,
          odoo_host: formData.odoo_host,
          odoo_db: formData.odoo_db,
          odoo_username: formData.odoo_username,
          odoo_api_key: formData.odoo_api_key,
          banners: formData.banners
        })
        .eq('id', 1);

      if (error) throw error;
      alert("¡Configuración guardada en la base de datos!");
      onRefresh();
    } catch (error: any) {
      console.error(error);
      alert("Error al guardar: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col">
      {/* Header Admin */}
      <div className="bg-[#1a2b49] text-white p-6 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <img src={formData.logo_url || LOGO_URL} className="h-10 object-contain brightness-0 invert" alt="Logo" />
          <h2 className="text-xl font-black uppercase tracking-tighter">Administración GIOFARMA</h2>
        </div>
        <button onClick={onClose} className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest">
          Salir
        </button>
      </div>

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-gray-50 border-r border-gray-100 p-8 space-y-3">
          <button onClick={() => setActiveTab('config')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-4 ${activeTab === 'config' ? 'bg-[#e1127a] text-white shadow-lg' : 'text-gray-400'}`}>
            <i className="fas fa-cog"></i> General
          </button>
          <button onClick={() => setActiveTab('odoo')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-4 ${activeTab === 'odoo' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400'}`}>
            <i className="fas fa-plug"></i> Conexión Odoo
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-4 ${activeTab === 'orders' ? 'bg-[#a5cf4c] text-white shadow-lg' : 'text-gray-400'}`}>
            <i className="fas fa-list"></i> Pedidos
          </button>
        </aside>

        {/* Content */}
        <main className="flex-grow overflow-y-auto p-12">
          <form onSubmit={handleSaveConfig} className="max-w-3xl space-y-10">
            
            {activeTab === 'config' && (
              <div className="space-y-6">
                <h3 className="text-xl font-black text-[#1a2b49] uppercase italic border-b-2 border-pink-100 pb-2">Datos de la Farmacia</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Nombre de Empresa</label>
                    <input type="text" value={formData.company_name || ''} onChange={e => setFormData({...formData, company_name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-[#e1127a] outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">WhatsApp</label>
                    <input type="text" value={formData.whatsapp_number || ''} onChange={e => setFormData({...formData, whatsapp_number: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-[#e1127a] outline-none" />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">URL del Logo (ImgBB/Directo)</label>
                    <input type="text" value={formData.logo_url || ''} onChange={e => setFormData({...formData, logo_url: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-[#e1127a] outline-none text-xs text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">URL Facebook</label>
                    <input type="text" value={formData.facebook_url || ''} onChange={e => setFormData({...formData, facebook_url: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-[#e1127a] outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">URL Instagram</label>
                    <input type="text" value={formData.instagram_url || ''} onChange={e => setFormData({...formData, instagram_url: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-[#e1127a] outline-none" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'odoo' && (
              <div className="space-y-6">
                <h3 className="text-xl font-black text-[#1a2b49] uppercase italic border-b-2 border-blue-100 pb-2">Sincronización Odoo v17</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-8 rounded-3xl">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-blue-400 uppercase">Host / URL</label>
                    <input type="text" value={formData.odoo_host || ''} onChange={e => setFormData({...formData, odoo_host: e.target.value})} className="w-full p-4 rounded-xl font-bold outline-none" placeholder="ej. mi-erp.odoo.com" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-blue-400 uppercase">Base de Datos</label>
                    <input type="text" value={formData.odoo_db || ''} onChange={e => setFormData({...formData, odoo_db: e.target.value})} className="w-full p-4 rounded-xl font-bold outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-blue-400 uppercase">Usuario (Email)</label>
                    <input type="text" value={formData.odoo_username || ''} onChange={e => setFormData({...formData, odoo_username: e.target.value})} className="w-full p-4 rounded-xl font-bold outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-blue-400 uppercase">API Key / Password</label>
                    <input type="password" value={formData.odoo_api_key || ''} onChange={e => setFormData({...formData, odoo_api_key: e.target.value})} className="w-full p-4 rounded-xl font-bold outline-none" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="text-xl font-black text-[#1a2b49] uppercase italic border-b-2 border-green-100 pb-2">Pedidos Recibidos</h3>
                <div className="space-y-4">
                  {orders.length === 0 ? <p className="text-gray-300 font-bold uppercase text-center py-10">No hay pedidos registrados</p> : orders.map(order => (
                    <div key={order.id} className="p-6 bg-gray-50 rounded-2xl flex justify-between items-center border-2 border-transparent hover:border-pink-200 transition-all">
                      <div>
                        <p className="font-black text-[#1a2b49]">#{order.id.split('-')[0].toUpperCase()} - {order.customer_name}</p>
                        <p className="text-[10px] font-bold text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-[#e1127a]">S/ {parseFloat(order.total_amount).toFixed(2)}</p>
                        <a href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}`} target="_blank" className="text-[10px] font-black uppercase text-green-500 hover:underline">Chat WhatsApp</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab !== 'orders' && (
              <button 
                type="submit" 
                disabled={isSaving}
                className="bg-[#1a2b49] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#e1127a] transition-all disabled:opacity-50"
              >
                {isSaving ? 'Guardando...' : 'Actualizar Configuración'}
              </button>
            )}
          </form>
        </main>
      </div>
    </div>
  );
};
