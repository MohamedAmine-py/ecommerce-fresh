import { useState, useEffect } from "react";
import { getStats, getUsers, getOrders, getProducts, getCategories, createProduct, updateProduct, deleteProduct, updateOrderStatus, createUser, updateUser, deleteUser, deleteOrder, createCategory, updateCategory, deleteCategory } from "../api/client";

export default function AdminDashboard({ token, onToast }) {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [prodForm, setProdForm] = useState({ nom: "", prix: "", stock: "", categorie_id: "", description: "", image: "" });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [catForm, setCatForm] = useState({ nom: "", description: "" });

  const [showUserModal, setShowUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [userForm, setUserForm] = useState({ nom: "", email: "", mot_de_passe: "", role: "client" });

  const [actionLoading, setActionLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadData();
  }, [token]);

  async function loadData() {
    setLoading(true);
    try {
      const [s, u, o, p, c] = await Promise.all([getStats(token), getUsers(token), getOrders(token), getProducts(), getCategories()]);
      setStats(s); setUsers(Array.isArray(u) ? u : []); setOrders(Array.isArray(o) ? o : []);
      setProducts(p.data || []); setCategories(Array.isArray(c) ? c : []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  // --- PRODUCTS ---
  function openAddProduct() { setProdForm({ nom: "", prix: "", stock: "", categorie_id: categories[0]?.id || "", description: "", image: "" }); setEditProduct(null); setShowProductModal(true); }
  function openEditProduct(p) { setProdForm({ nom: p.nom, prix: p.prix, stock: p.stock, categorie_id: p.categorie_id, description: p.description || "", image: p.image || "" }); setEditProduct(p); setShowProductModal(true); }

  async function handleSaveProduct() {
    setActionLoading(true);
    const res = await (editProduct ? updateProduct(editProduct.id, prodForm, token) : createProduct(prodForm, token));
    setActionLoading(false);
    if (res.id) { setShowProductModal(false); loadData(); onToast(editProduct ? "Produit modifié ✓" : "Produit créé ✓"); }
    else onToast(res.message || "Erreur", "error");
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm("Supprimer ce produit ?")) return;
    setDeletingId(id); await deleteProduct(id, token); setDeletingId(null); loadData(); onToast("Produit supprimé");
  }

  // --- CATEGORIES ---
  function openAddCategory() { setCatForm({ nom: "", description: "" }); setEditCategory(null); setShowCategoryModal(true); }
  function openEditCategory(c) { setCatForm({ nom: c.nom, description: c.description || "" }); setEditCategory(c); setShowCategoryModal(true); }

  async function handleSaveCategory() {
    setActionLoading(true);
    const res = await (editCategory ? updateCategory(editCategory.id, catForm, token) : createCategory(catForm, token));
    setActionLoading(false);
    if (res.id) { setShowCategoryModal(false); loadData(); onToast(editCategory ? "Catégorie modifiée ✓" : "Catégorie créée ✓"); }
    else onToast(res.message || "Erreur", "error");
  }

  async function handleDeleteCategory(id) {
    if (!window.confirm("Supprimer cette catégorie ? (Attention, cela peut affecter les produits liés)")) return;
    setDeletingId(id); await deleteCategory(id, token); setDeletingId(null); loadData(); onToast("Catégorie supprimée");
  }

  // --- USERS ---
  function openAddUser() { setUserForm({ nom: "", email: "", mot_de_passe: "", role: "client" }); setEditUser(null); setShowUserModal(true); }
  function openEditUser(u) { setUserForm({ nom: u.nom, email: u.email, mot_de_passe: "", role: u.role }); setEditUser(u); setShowUserModal(true); }

  async function handleSaveUser() {
    setActionLoading(true);
    const dataToSend = { ...userForm };
    if (editUser && !dataToSend.mot_de_passe) delete dataToSend.mot_de_passe; // Don't update password if empty
    
    const res = await (editUser ? updateUser(editUser.id, dataToSend, token) : createUser(dataToSend, token));
    setActionLoading(false);
    if (res.id) { setShowUserModal(false); loadData(); onToast(editUser ? "Utilisateur modifié ✓" : "Utilisateur créé ✓"); }
    else onToast(res.message || "Erreur", "error");
  }

  async function handleDeleteUser(id) {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    setDeletingId(id); await deleteUser(id, token); setDeletingId(null); loadData(); onToast("Utilisateur supprimé");
  }

  // --- ORDERS ---
  async function handleOrderStatus(id, statut) {
    await updateOrderStatus(id, statut, token); loadData(); onToast("Statut mis à jour ✓");
  }

  async function handleDeleteOrder(id) {
    if (!window.confirm("Supprimer cette commande de façon permanente ?")) return;
    setDeletingId(id); await deleteOrder(id, token); setDeletingId(null); loadData(); onToast("Commande supprimée");
  }

  const statusColors = { en_cours: "#f59e0b", validee: "#22c55e", annulee: "#ef4444" };
  const statusLabels = { en_cours: "En cours", validee: "Validée", annulee: "Annulée" };

  if (loading && !stats) return <div style={{ padding: "60px 0", textAlign: "center", color: "#64748b" }}>Chargement du dashboard...</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: -1, color: "#0f172a", marginBottom: 4 }}>Admin Dashboard</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Gestion complète de la boutique TechElite</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { id: "overview", label: "Vue d'ensemble" },
            { id: "products", label: "Produits" },
            { id: "categories", label: "Catégories" },
            { id: "orders", label: "Commandes" },
            { id: "users", label: "Utilisateurs" }
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 18px", borderRadius: 10, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", background: tab === t.id ? "#ff4655" : "#f1f4f9", color: tab === t.id ? "#fff" : "#475569", transition: "all 0.2s" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {tab === "overview" && stats && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20, marginBottom: 36 }}>
            {[
              { label: "Clients", val: stats.total_users, icon: "👥", color: "#3b82f6" },
              { label: "Produits", val: stats.total_produits, icon: "📦", color: "#8b5cf6" },
              { label: "Commandes", val: stats.total_commandes, icon: "🛒", color: "#f59e0b" },
              { label: "En cours", val: stats.commandes_en_cours, icon: "⏳", color: "#ef4444" },
              { label: "Revenus", val: `${parseFloat(stats.revenus_total||0).toFixed(2)} €`, icon: "💰", color: "#22c55e" },
            ].map(c => (
              <div key={c.label} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "24px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{c.icon}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: c.color, marginBottom: 4, fontFamily: "JetBrains Mono,monospace" }}>{c.val}</div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{c.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, color: "#0f172a" }}>Dernières commandes</div>
            <AdminTable headers={["#","Client","Total","Statut","Date"]}>
              {(stats.recent_orders||[]).map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.user?.nom || "—"}</td>
                  <td style={{ fontFamily: "JetBrains Mono,monospace", fontWeight: 700 }}>{parseFloat(o.total).toFixed(2)} €</td>
                  <td><span style={{ padding: "4px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: statusColors[o.statut] + "20", color: statusColors[o.statut] }}>{statusLabels[o.statut]}</span></td>
                  <td style={{ color: "#94a3b8" }}>{new Date(o.created_at).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </AdminTable>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {tab === "products" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{products.length} produits</div>
            <button onClick={openAddProduct} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#ff4655", color: "#fff", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Nouveau produit</button>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <AdminTable headers={["Nom","Catégorie","Prix","Stock","Actions"]}>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: "#0f172a" }}>{p.nom}</td>
                  <td style={{ color: "#64748b" }}>{p.categorie?.nom || "—"}</td>
                  <td style={{ fontFamily: "JetBrains Mono,monospace", fontWeight: 700, color: "#ff4655" }}>{parseFloat(p.prix).toFixed(2)} €</td>
                  <td><span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700, background: p.stock === 0 ? "#fee2e2" : p.stock <= 5 ? "#fef3c7" : "#dcfce7", color: p.stock === 0 ? "#ef4444" : p.stock <= 5 ? "#f59e0b" : "#16a34a" }}>{p.stock}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEditProduct(p)} className="action-btn edit-btn">Modifier</button>
                      <button onClick={() => handleDeleteProduct(p.id)} disabled={deletingId === p.id} className="action-btn delete-btn">{deletingId === p.id ? "..." : "Supprimer"}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </AdminTable>
          </div>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {tab === "categories" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{categories.length} catégories</div>
            <button onClick={openAddCategory} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#ff4655", color: "#fff", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Nouvelle catégorie</button>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <AdminTable headers={["ID","Nom","Description","Actions"]}>
              {categories.map(c => (
                <tr key={c.id}>
                  <td style={{ color: "#94a3b8" }}>#{c.id}</td>
                  <td style={{ fontWeight: 600, color: "#0f172a" }}>{c.nom}</td>
                  <td style={{ color: "#64748b" }}>{c.description || "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEditCategory(c)} className="action-btn edit-btn">Modifier</button>
                      <button onClick={() => handleDeleteCategory(c.id)} disabled={deletingId === c.id} className="action-btn delete-btn">{deletingId === c.id ? "..." : "Supprimer"}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </AdminTable>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {tab === "orders" && (
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <AdminTable headers={["#","Client","Total","Articles","Statut","Date","Actions"]}>
            {orders.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 700, color: "#0f172a" }}>#{o.id}</td>
                <td>{o.user?.nom || "—"}<div style={{ fontSize: 11, color: "#94a3b8" }}>{o.user?.email}</div></td>
                <td style={{ fontFamily: "JetBrains Mono,monospace", fontWeight: 700 }}>{parseFloat(o.total).toFixed(2)} €</td>
                <td style={{ color: "#64748b" }}>{o.details?.length || 0} art.</td>
                <td>
                  <select value={o.statut} onChange={e => handleOrderStatus(o.id, e.target.value)}
                    style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", background: statusColors[o.statut] + "15", color: statusColors[o.statut], fontSize: 12, fontWeight: 700, cursor: "pointer", outline: "none" }}>
                    <option value="en_cours">En cours</option>
                    <option value="validee">Validée</option>
                    <option value="annulee">Annulée</option>
                  </select>
                </td>
                <td style={{ color: "#94a3b8", fontSize: 13 }}>{new Date(o.created_at).toLocaleDateString("fr-FR")}</td>
                <td>
                  <button onClick={() => handleDeleteOrder(o.id)} disabled={deletingId === o.id} className="action-btn delete-btn">{deletingId === o.id ? "..." : "Supprimer"}</button>
                </td>
              </tr>
            ))}
          </AdminTable>
        </div>
      )}

      {/* USERS TAB */}
      {tab === "users" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{users.length} utilisateurs</div>
            <button onClick={openAddUser} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#ff4655", color: "#fff", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Nouvel utilisateur</button>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <AdminTable headers={["Nom","Email","Rôle","Commandes","Inscrit le","Actions"]}>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600, color: "#0f172a" }}>{u.nom}</td>
                  <td style={{ color: "#64748b" }}>{u.email}</td>
                  <td><span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700, background: u.role === "admin" ? "#fee2e2" : "#f0fdf4", color: u.role === "admin" ? "#ef4444" : "#16a34a", textTransform: "uppercase" }}>{u.role}</span></td>
                  <td style={{ fontWeight: 700, fontFamily: "JetBrains Mono,monospace" }}>{u.commandes_count || 0}</td>
                  <td style={{ color: "#94a3b8", fontSize: 13 }}>{new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEditUser(u)} className="action-btn edit-btn">Modifier</button>
                      <button onClick={() => handleDeleteUser(u.id)} disabled={deletingId === u.id} className="action-btn delete-btn">{deletingId === u.id ? "..." : "Supprimer"}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </AdminTable>
          </div>
        </div>
      )}

      {/* --- MODALS --- */}
      
      {/* Product Modal */}
      {showProductModal && (
        <Modal title={editProduct ? "Modifier le produit" : "Nouveau produit"} onClose={() => setShowProductModal(false)} onSave={handleSaveProduct} loading={actionLoading} saveText={editProduct ? "Enregistrer" : "Créer le produit"}>
          {[
            { key: "nom", label: "Nom du produit", ph: "Ex: iPhone 16 Pro" },
            { key: "prix", label: "Prix (€)", ph: "Ex: 999.99", type: "number" },
            { key: "stock", label: "Stock", ph: "Ex: 50", type: "number" },
            { key: "image", label: "URL Image", ph: "https://..." },
            { key: "description", label: "Description", ph: "Description du produit...", isTextArea: true },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={labelStyle}>{f.label}</label>
              {f.isTextArea
                ? <textarea value={prodForm[f.key]} onChange={e => setProdForm({...prodForm,[f.key]:e.target.value})} placeholder={f.ph} rows={3} style={inputStyle} />
                : <input type={f.type||"text"} value={prodForm[f.key]} onChange={e => setProdForm({...prodForm,[f.key]:e.target.value})} placeholder={f.ph} style={inputStyle} />
              }
            </div>
          ))}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Catégorie</label>
            <select value={prodForm.categorie_id} onChange={e => setProdForm({...prodForm,categorie_id:e.target.value})} style={inputStyle}>
              <option value="">Sélectionnez une catégorie</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </div>
        </Modal>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <Modal title={editCategory ? "Modifier la catégorie" : "Nouvelle catégorie"} onClose={() => setShowCategoryModal(false)} onSave={handleSaveCategory} loading={actionLoading} saveText={editCategory ? "Enregistrer" : "Créer la catégorie"}>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Nom de la catégorie</label>
            <input type="text" value={catForm.nom} onChange={e => setCatForm({...catForm,nom:e.target.value})} placeholder="Ex: Smartphones" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Description</label>
            <textarea value={catForm.description} onChange={e => setCatForm({...catForm,description:e.target.value})} placeholder="Description de la catégorie..." rows={3} style={inputStyle} />
          </div>
        </Modal>
      )}

      {/* User Modal */}
      {showUserModal && (
        <Modal title={editUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"} onClose={() => setShowUserModal(false)} onSave={handleSaveUser} loading={actionLoading} saveText={editUser ? "Enregistrer" : "Créer l'utilisateur"}>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Nom complet</label>
            <input type="text" value={userForm.nom} onChange={e => setUserForm({...userForm,nom:e.target.value})} placeholder="Ex: Jean Dupont" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Email</label>
            <input type="email" value={userForm.email} onChange={e => setUserForm({...userForm,email:e.target.value})} placeholder="Ex: jean@example.com" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Mot de passe {editUser && <span style={{ textTransform: "none", fontWeight: "normal", color: "#64748b" }}>(Laisser vide pour ne pas modifier)</span>}</label>
            <input type="password" value={userForm.mot_de_passe} onChange={e => setUserForm({...userForm,mot_de_passe:e.target.value})} placeholder="••••••••" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Rôle</label>
            <select value={userForm.role} onChange={e => setUserForm({...userForm,role:e.target.value})} style={inputStyle}>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </Modal>
      )}
      
      {/* Styles inline for component specific things */}
      <style>{`
        .action-btn { padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: Inter,sans-serif; }
        .edit-btn { border: 1px solid #e2e8f0; background: #f8f9fc; color: #475569; }
        .edit-btn:hover { background: #e2e8f0; }
        .delete-btn { border: 1px solid #fecaca; background: #fee2e2; color: #ef4444; }
        .delete-btn:hover { background: #fca5a5; }
      `}</style>
    </div>
  );
}

// Reusable Components inside file
function AdminTable({ headers, children }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8f9fc" }}>
            {headers.map(h => <th key={h} style={{ padding: "12px 16px", textAlign: h==="Actions"?"right":"left", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {/* We wrap children rows to apply alignment for Actions column */}
          {React.Children.map(children, child => 
             React.cloneElement(child, {
               children: React.Children.map(child.props.children, (td, i) => {
                 if(i === headers.length - 1 && headers[headers.length - 1] === "Actions") {
                   return React.cloneElement(td, { style: { ...td.props.style, display: "flex", justifyContent: "flex-end" } });
                 }
                 return td;
               })
             })
          )}
        </tbody>
      </table>
    </div>
  );
}

// Reusable Modal
function Modal({ title, onClose, onSave, loading, saveText, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480, padding: 32, boxShadow: "0 24px 64px rgba(0,0,0,0.15)", animation: "scaleIn .2s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "#f1f4f9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "#64748b" }}>✕</button>
        </div>
        {children}
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 12, borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8f9fc", color: "#475569", fontFamily: "Inter,sans-serif", fontWeight: 700, cursor: "pointer" }}>Annuler</button>
          <button onClick={onSave} disabled={loading} style={{ flex: 2, padding: 12, borderRadius: 10, border: "none", background: "#ff4655", color: "#fff", fontFamily: "Inter,sans-serif", fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>{loading ? "Traitement..." : saveText}</button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 };
const inputStyle = { width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, fontFamily: "Inter,sans-serif", outline: "none", color: "#0f172a", boxSizing: "border-box", resize: "none" };
import React from 'react';
