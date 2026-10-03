import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Bot,
  ClipboardList,
  LayoutDashboard,
  LogIn,
  LogOut,
  MessageCircle,
  CircleUserRound,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  Utensils,
  X,
} from 'lucide-react';
import './styles.css';

const demoCategories = ['All', 'Starters', 'Mains', 'Drinks', 'Desserts'];
const demoCategoryRecords = [
  { id: 1, name: 'Starters' },
  { id: 2, name: 'Mains' },
  { id: 3, name: 'Drinks' },
  { id: 4, name: 'Desserts' },
];
const demoMenu = [
  { id: 1, name: 'Crispy Spring Rolls', categoryName: 'Starters', description: 'Vegetable rolls with sweet chilli sauce.', price: 8.5, spiceLevel: 'mild' },
  { id: 2, name: 'Grilled Chicken Bowl', categoryName: 'Mains', description: 'Chicken, rice, salad, and house sauce.', price: 16.9, spiceLevel: 'medium' },
  { id: 3, name: 'Vegetable Pasta', categoryName: 'Mains', description: 'Pasta with seasonal vegetables and tomato basil sauce.', price: 14.5, spiceLevel: 'none' },
  { id: 4, name: 'Fresh Lemonade', categoryName: 'Drinks', description: 'House-made lemonade served chilled.', price: 4.5, spiceLevel: 'none' },
  { id: 5, name: 'Chocolate Brownie', categoryName: 'Desserts', description: 'Warm brownie with chocolate sauce.', price: 7, spiceLevel: 'none' },
];

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Request failed.');
  }

  return response.json();
}

function App() {
  const [activePage, setActivePage] = useState('menu');
  const [currentUser, setCurrentUser] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState(demoCategories);
  const [categoryRecords, setCategoryRecords] = useState(demoCategoryRecords);
  const [menuItems, setMenuItems] = useState(demoMenu);
  const [apiReady, setApiReady] = useState(false);
  const [notice, setNotice] = useState('Using demo menu until the API is connected.');
  const [toast, setToast] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [theme, setTheme] = useState(() => window.localStorage.getItem('smartdine-theme') || 'light');
  const [chatMessages, setChatMessages] = useState([
    { from: 'assistant', text: 'Hi, I am SmartDine Assistant. Ask me about menu items, ordering, spice level, or order status.' },
  ]);

  const isAdmin = currentUser?.role === 'admin';
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    loadCurrentUser();
    loadMenuData();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('smartdine-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (apiReady) return undefined;
    const retry = window.setInterval(loadMenuData, 3000);
    return () => window.clearInterval(retry);
  }, [apiReady]);

  useEffect(() => {
    if (currentUser) {
      loadOrders();
    } else {
      setOrders([]);
    }
  }, [currentUser]);

  useEffect(() => {
    setToast('');
  }, [activePage]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 5000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  async function loadCurrentUser() {
    try {
      const result = await apiRequest('/auth/me');
      setCurrentUser(result.user);
    } catch (error) {
      setCurrentUser(null);
    }
  }

  async function loadMenuData() {
    try {
      const [categoryData, menuData] = await Promise.all([
        apiRequest('/menu/categories'),
        apiRequest('/menu/items?limit=50'),
      ]);
      setCategoryRecords(categoryData.categories);
      setCategories(['All', ...categoryData.categories.map((item) => item.name)]);
      setMenuItems(menuData.items.map(normalizeMenuItem));
      setApiReady(true);
      setNotice('');
    } catch (error) {
      setApiReady(false);
      setNotice('Menu is running in offline preview mode. Start the backend and MySQL to use live menu data.');
    }
  }

  async function loadOrders() {
    try {
      const result = await apiRequest('/orders');
      setOrders(result.orders || []);
    } catch (error) {
      setOrders([]);
    }
  }

  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = category === 'All' || item.categoryName === category;
      const text = `${item.name} ${item.description || ''} ${item.categoryName}`.toLowerCase();
      return matchesCategory && text.includes(query.toLowerCase());
    });
  }, [category, menuItems, query]);

  const cartTotal = cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

  function addToCart(menuItem) {
    if (isAdmin) {
      setToast('Admins manage menu and orders only. Please use a customer account to place food orders.');
      return;
    }
    playAddSound();
    setCart((items) => {
      const existing = items.find((item) => item.id === menuItem.id);
      if (existing) {
        return items.map((item) => item.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...items, { ...menuItem, quantity: 1 }];
    });
    setToast(`${menuItem.name} added. Open Orders to review your cart.`);
  }

  function updateQuantity(id, delta) {
    setCart((items) => items
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0));
  }

  async function submitOrder() {
    if (!currentUser) {
      setActivePage('auth');
      setToast('Please login before submitting an order.');
      return;
    }
    if (isAdmin) {
      setToast('Admin accounts cannot create customer orders.');
      return;
    }
    if (cart.length === 0) {
      setToast('Add at least one item before submitting an order.');
      return;
    }
    try {
      const result = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: cart.map((item) => ({ menuItemId: item.id, quantity: item.quantity })),
        }),
      });
      setCart([]);
      setToast(`Order ${result.orderNumber} submitted successfully.`);
      await loadOrders();
      setActivePage('orders');
    } catch (error) {
      setToast(error.message);
    }
  }

  async function login(credentials) {
    try {
      const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      setCurrentUser(result.user);
      setToast(`Welcome, ${result.user.fullName}.`);
      setActivePage(result.user.role === 'admin' ? 'admin' : 'menu');
    } catch (error) {
      setToast(error.message);
    }
  }

  async function register(payload) {
    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setToast('Registration successful. You can login now.');
    } catch (error) {
      setToast(error.message);
    }
  }

  async function logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      // The local session is cleared even if the request has already expired.
    }
    setCurrentUser(null);
    setCart([]);
    setOrders([]);
    setActivePage('menu');
    setToast('Logged out.');
  }

  async function createMenuItem(payload) {
    try {
      await apiRequest('/menu/items', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setToast('Menu item saved.');
      await loadMenuData();
    } catch (error) {
      setToast(error.message);
    }
  }

  async function updateOrderStatus(orderId, status) {
    try {
      await apiRequest(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setToast('Order status updated.');
      await loadOrders();
    } catch (error) {
      setToast(error.message);
    }
  }

  async function askAssistant(event) {
    event.preventDefault();
    await submitAssistantMessage(chatInput);
  }

  async function submitAssistantMessage(message) {
    const text = message.trim();
    if (!text) return;

    setChatInput('');
    setChatMessages((messages) => [...messages, { from: 'user', text }]);

    try {
      const result = await apiRequest('/chatbot/message', {
        method: 'POST',
        body: JSON.stringify({ message: text }),
      });
      setChatMessages((messages) => [
        ...messages,
        { from: 'assistant', options: result.options || [], text: result.reply },
      ]);
    } catch (error) {
      setChatMessages((messages) => [
        ...messages,
        { from: 'assistant', text: createAssistantReply(text) },
      ]);
    }
  }

  function sendQuickAssistantMessage(text) {
    submitAssistantMessage(text);
  }

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} setActivePage={setActivePage} currentUser={currentUser} logout={logout} cartCount={cartCount} />
      <main className="main-panel">
        <Header currentUser={currentUser} theme={theme} toggleTheme={toggleTheme} />
        {toast && <div className="toast" onClick={() => setToast('')}>{toast}</div>}
        {activePage === 'menu' && <MenuPage query={query} setQuery={setQuery} category={category} setCategory={setCategory} categories={categories} filteredMenu={filteredMenu} addToCart={addToCart} notice={notice} isAdmin={isAdmin} />}
        {activePage === 'orders' && <OrdersPage cart={cart} cartTotal={cartTotal} orders={orders} currentUser={currentUser} submitOrder={submitOrder} updateQuantity={updateQuantity} updateOrderStatus={updateOrderStatus} isAdmin={isAdmin} />}
        {activePage === 'admin' && (isAdmin ? <AdminPage categories={categoryRecords} orders={orders} menuItems={menuItems} createMenuItem={createMenuItem} updateOrderStatus={updateOrderStatus} /> : <AccessPanel setActivePage={setActivePage} />)}
        {activePage === 'auth' && <AuthPage login={login} register={register} currentUser={currentUser} logout={logout} />}
      </main>
      <ChatbotPopup chatOpen={chatOpen} setChatOpen={setChatOpen} chatMessages={chatMessages} chatInput={chatInput} setChatInput={setChatInput} askAssistant={askAssistant} sendQuickAssistantMessage={sendQuickAssistantMessage} />
    </div>
  );
}

function Sidebar({ activePage, setActivePage, currentUser, logout, cartCount }) {
  const links = [
    { id: 'menu', label: 'Menu', icon: Utensils, show: true },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, show: currentUser?.role !== 'admin' },
    { id: 'admin', label: 'Admin', icon: LayoutDashboard, show: currentUser?.role === 'admin' },
    { id: 'auth', label: currentUser ? 'Account' : 'Login', icon: currentUser ? CircleUserRound : LogIn, show: true },
  ].filter((link) => link.show);
  return (
    <aside className="sidebar">
      <div className="brand-lockup"><img className="brand-mark" src="/logo.svg" alt="SmartDine logo" /><div><strong>SmartDine</strong><small>Restaurant system</small></div></div>
      <nav className="side-nav" aria-label="Application navigation">
        {links.map((link) => { const Icon = link.icon; return <button className={activePage === link.id ? 'active' : ''} key={link.id} onClick={() => setActivePage(link.id)} type="button"><Icon size={18} /><span>{link.label}</span>{link.id === 'orders' && cartCount > 0 && <strong className="nav-badge">{cartCount}</strong>}</button>; })}
        {currentUser && <button onClick={logout} type="button"><LogOut size={18} /><span>Logout</span></button>}
      </nav>
    </aside>
  );
}

function Header({ currentUser, theme, toggleTheme }) {
  const ThemeIcon = theme === 'dark' ? Sun : Moon;
  return (
    <section className="topbar">
      <div>
        <h1>SmartDine Restaurant Management</h1>
        <p className="header-copy">Browse the menu, place food orders, and manage kitchen status from one simple workspace.</p>
      </div>
      <div className="topbar-actions">
        <button className="theme-toggle" onClick={toggleTheme} type="button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
          <ThemeIcon size={18} />
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
        {currentUser && <div className="status-pill"><span>{currentUser.fullName}</span><strong>{currentUser.role}</strong></div>}
      </div>
    </section>
  );
}

function MenuPage({ query, setQuery, category, setCategory, categories, filteredMenu, addToCart, notice, isAdmin }) {
  return <section className="workspace">{notice && <div className="notice-bar">{notice}</div>}{isAdmin && <div className="notice-bar">Admin mode: menu items can be viewed here, but only customers can place orders.</div>}<div className="toolbar"><label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search menu items" /></label><div className="segmented" aria-label="Menu category filter">{categories.map((item) => <button className={category === item ? 'selected' : ''} key={item} onClick={() => setCategory(item)} type="button">{item}</button>)}</div></div><div className="menu-grid">{filteredMenu.map((item) => <article className="menu-card" key={item.id}><div><span className="category-chip">{item.categoryName}</span><h2>{item.name}</h2><p>{item.description}</p></div><div className="card-footer"><strong>${Number(item.price).toFixed(2)}</strong><span>{item.spiceLevel} spice</span><button className={isAdmin ? 'ghost-action' : ''} onClick={() => addToCart(item)} type="button">{isAdmin ? 'Customer only' : 'Add'}</button></div></article>)}</div></section>;
}

function OrdersPage({ cart, cartTotal, orders, currentUser, submitOrder, updateQuantity, updateOrderStatus, isAdmin }) {
  return <section className="workspace two-column"><div className="panel"><h2>Current Order</h2>{isAdmin && <p className="muted">Admin accounts cannot create customer orders.</p>}{cart.length === 0 ? <p className="muted">No items added yet. Add food from the menu.</p> : <div className="order-list">{cart.map((item) => <div className="order-row" key={item.id}><span>{item.name}</span><strong>{item.quantity} x ${Number(item.price).toFixed(2)}</strong><div className="stepper"><button onClick={() => updateQuantity(item.id, -1)} type="button">-</button><button onClick={() => updateQuantity(item.id, 1)} type="button">+</button></div></div>)}<div className="order-total"><span>Total</span><strong>${cartTotal.toFixed(2)}</strong></div></div>}<button className="primary-action" onClick={submitOrder} type="button">{!currentUser ? 'Login to submit order' : isAdmin ? 'Customer orders only' : 'Submit order'}</button></div><div className="panel"><h2>{isAdmin ? 'All Orders' : 'My Orders'}</h2>{!currentUser ? <p className="muted">Login to view orders.</p> : orders.length === 0 ? <p className="muted">No orders found.</p> : orders.map((order) => <div className="status-row" key={order.id}><ClipboardList size={18} /><div><strong>{order.orderNumber}</strong><p>{order.customerName || 'Customer'} - ${Number(order.totalAmount).toFixed(2)}</p></div>{isAdmin ? <select value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value)}><option value="pending">pending</option><option value="preparing">preparing</option><option value="ready">ready</option><option value="completed">completed</option><option value="cancelled">cancelled</option></select> : <span className={`status ${order.status}`}>{order.status}</span>}</div>)}</div></section>;
}

function AdminPage({ categories, orders, menuItems, createMenuItem, updateOrderStatus }) {
  const [form, setForm] = useState({ name: '', categoryId: '', price: '', description: '', spiceLevel: 'none' });
  function submit(event) { event.preventDefault(); createMenuItem({ ...form, categoryId: Number(form.categoryId), price: Number(form.price), isAvailable: true }); setForm({ name: '', categoryId: '', price: '', description: '', spiceLevel: 'none' }); }
  return <section className="workspace two-column"><div className="panel"><h2>Admin Dashboard</h2><div className="metrics-grid"><Metric label="Menu items" value={menuItems.length} /><Metric label="Orders" value={orders.length} /><Metric label="Pending" value={orders.filter((order) => order.status === 'pending').length} /><Metric label="Completed" value={orders.filter((order) => order.status === 'completed').length} /></div><h2 className="subheading">Order Management</h2>{orders.map((order) => <div className="status-row" key={order.id}><span>{order.orderNumber}</span><select value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value)}><option value="pending">pending</option><option value="preparing">preparing</option><option value="ready">ready</option><option value="completed">completed</option><option value="cancelled">cancelled</option></select></div>)}</div><div className="panel"><h2>Menu Management</h2><form className="stacked-form" onSubmit={submit}><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Food name" /><select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}><option value="">Select category</option>{categories.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><input value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="Price" type="number" step="0.01" /><input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" /><select value={form.spiceLevel} onChange={(event) => setForm({ ...form, spiceLevel: event.target.value })}><option value="none">No spice</option><option value="mild">Mild</option><option value="medium">Medium</option><option value="hot">Hot</option></select><button className="primary-action" type="submit">Save menu item</button></form></div></section>;
}

function AccessPanel({ setActivePage }) {
  return <section className="workspace"><div className="panel"><h2>Admin access required</h2><p className="muted">Login with an admin account to manage menu items and order statuses.</p><button className="primary-action" type="button" onClick={() => setActivePage('auth')}>Go to login</button></div></section>;
}

function Metric({ label, value }) { return <div className="metric"><strong>{value}</strong><span>{label}</span></div>; }

function AuthPage({ login, register, currentUser, logout }) {
  const [mode, setMode] = useState('role-choice');
  const [adminForm, setAdminForm] = useState({ email: 'admin@smartdine.test', password: 'Admin@123' });
  const [customerForm, setCustomerForm] = useState({ email: 'customer@smartdine.test', password: 'Customer@123' });
  const [registerForm, setRegisterForm] = useState({ fullName: '', email: '', password: '' });
  if (currentUser) { return <section className="workspace"><div className="panel"><h2>Account</h2><p>Logged in as <strong>{currentUser.fullName}</strong> ({currentUser.role}).</p><button className="primary-action" type="button" onClick={logout}>Logout</button></div></section>; }
  return (
    <section className="workspace auth-layout">
      <div className="panel auth-panel">
        {mode === 'role-choice' && (
          <>
            <h2>Choose access type</h2>
            <p className="muted">Select the account type you want to use.</p>
            <div className="role-choice">
              <button type="button" onClick={() => setMode('customer-login')}>
                <ShoppingBag size={22} />
                <span>Customer</span>
                <small>Login or sign up to place food orders.</small>
              </button>
              <button type="button" onClick={() => setMode('admin-login')}>
                <LayoutDashboard size={22} />
                <span>Admin</span>
                <small>Manage menu items and update order status.</small>
              </button>
            </div>
          </>
        )}

        {(mode === 'customer-login' || mode === 'customer-signup') && (
          <div className="auth-toggle two-tabs">
            <button className={mode === 'customer-login' ? 'selected' : ''} type="button" onClick={() => setMode('customer-login')}>Customer login</button>
            <button className={mode === 'customer-signup' ? 'selected' : ''} type="button" onClick={() => setMode('customer-signup')}>Customer sign up</button>
          </div>
        )}

        {mode === 'admin-login' && (
          <>
            <h2>Admin login</h2>
            <p className="muted">Admin accounts manage menu items and order status. They cannot place customer orders.</p>
            <div className="demo-grid one-column"><button type="button" onClick={() => setAdminForm({ email: 'admin@smartdine.test', password: 'Admin@123' })}>Use admin demo</button></div>
            <form className="stacked-form" onSubmit={(event) => { event.preventDefault(); login(adminForm); }}>
              <input value={adminForm.email} onChange={(event) => setAdminForm({ ...adminForm, email: event.target.value })} placeholder="Admin email address" type="email" />
              <input value={adminForm.password} onChange={(event) => setAdminForm({ ...adminForm, password: event.target.value })} placeholder="Admin password" type="password" />
              <button className="primary-action" type="submit">Login as admin</button>
            </form>
            <button className="text-action" type="button" onClick={() => setMode('role-choice')}>Choose customer access instead</button>
          </>
        )}

        {mode === 'customer-login' && (
          <>
            <h2>Customer login</h2>
            <p className="muted">Customers can browse the menu, add items to cart, and place food orders.</p>
            <div className="demo-grid one-column"><button type="button" onClick={() => setCustomerForm({ email: 'customer@smartdine.test', password: 'Customer@123' })}>Use customer demo</button></div>
            <form className="stacked-form" onSubmit={(event) => { event.preventDefault(); login(customerForm); }}>
              <input value={customerForm.email} onChange={(event) => setCustomerForm({ ...customerForm, email: event.target.value })} placeholder="Customer email address" type="email" />
              <input value={customerForm.password} onChange={(event) => setCustomerForm({ ...customerForm, password: event.target.value })} placeholder="Customer password" type="password" />
              <button className="primary-action" type="submit">Login as customer</button>
            </form>
            <button className="text-action" type="button" onClick={() => setMode('role-choice')}>Choose admin access instead</button>
          </>
        )}

        {mode === 'customer-signup' && (
          <>
            <h2>Create customer account</h2>
            <p className="muted">Sign up is only for customers. Admin accounts are created by the project team.</p>
            <form className="stacked-form" onSubmit={(event) => { event.preventDefault(); register(registerForm); setMode('customer-login'); }}>
              <input value={registerForm.fullName} onChange={(event) => setRegisterForm({ ...registerForm, fullName: event.target.value })} placeholder="Full name" />
              <input value={registerForm.email} onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })} placeholder="Email address" type="email" />
              <input value={registerForm.password} onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })} placeholder="Password" type="password" />
              <button className="primary-action" type="submit">Create customer account</button>
            </form>
            <button className="text-action" type="button" onClick={() => setMode('role-choice')}>Choose admin access instead</button>
          </>
        )}
      </div>
    </section>
  );
}

function ChatbotPopup({ chatOpen, setChatOpen, chatMessages, chatInput, setChatInput, askAssistant, sendQuickAssistantMessage }) {
  const widgetRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!chatOpen) return undefined;
    function handlePointerDown(event) {
      if (!widgetRef.current?.contains(event.target)) {
        setChatOpen(false);
      }
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [chatOpen, setChatOpen]);

  useEffect(() => {
    if (chatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [chatMessages, chatOpen]);

  return <div className="chatbot-widget" ref={widgetRef}><button className="chatbot-toggle" type="button" onClick={() => setChatOpen(!chatOpen)} aria-label="Open SmartDine Assistant">{chatOpen ? <X size={22} /> : <MessageCircle size={24} />}</button>{chatOpen && <div className="chatbot-panel"><div className="chatbot-header"><Bot size={18} /><div><strong>SmartDine Assistant</strong><small>Tap a question or type your own.</small></div></div><div className="quick-prompts"><button type="button" onClick={() => sendQuickAssistantMessage('Recommend food')}>Recommend food</button><button type="button" onClick={() => sendQuickAssistantMessage('How can I check my order status?')}>Order status</button><button type="button" onClick={() => sendQuickAssistantMessage('Which items are spicy?')}>Spice help</button></div><div className="chat-window compact" aria-live="polite">{chatMessages.map((message, index) => <div className={`chat-message ${message.from}`} key={`${message.from}-${index}`}><button type="button" onClick={() => message.from === 'assistant' && setChatInput(message.text)}>{message.text}</button>{message.options?.length > 0 && <div className="chat-options">{message.options.map((option) => <button key={option} type="button" onClick={() => sendQuickAssistantMessage(option)}>{option}</button>)}</div>}</div>)}<span ref={chatEndRef} /></div><form className="chat-form" onSubmit={askAssistant}><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Ask about menu or orders" /><button type="submit">Send</button></form></div>}</div>;
}

function normalizeMenuItem(item) { return { ...item, price: Number(item.price) }; }

function createAssistantReply(question) {
  const text = question.toLowerCase();
  if (text.includes('not spicy') || text.includes('non spicy') || text.includes('non-spicy') || text.includes('no spice') || text.includes('not hot')) return 'Look for menu items marked as no spice or mild spice.';
  if (text.includes('spicy') || text.includes('hot')) return 'Spice levels are shown on each menu item. You can choose none, mild, medium, or hot items.';
  if (text.includes('order') && text.includes('status')) return 'Logged-in users can open the Orders page to check whether an order is pending, preparing, ready, completed, or cancelled.';
  if (text.includes('menu') || text.includes('food') || text.includes('dish')) return 'Use the Menu page to search food by name and filter items by category.';
  if (text.includes('admin')) return 'Admins can manage menu items and update order status from the admin dashboard.';
  return 'I can help with menu search, ordering steps, order status, spice levels, and admin support.';
}
function playAddSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1320, context.currentTime + 0.08);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.16);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.17);
  } catch (error) {
    // Audio feedback is optional and may be blocked by browser settings.
  }
}
createRoot(document.getElementById('root')).render(<App />);
