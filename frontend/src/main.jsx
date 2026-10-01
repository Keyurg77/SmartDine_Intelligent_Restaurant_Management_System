import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Bot,
  ClipboardList,
  LayoutDashboard,
  LogIn,
  Menu as MenuIcon,
  Search,
  ShoppingBag,
  ShieldCheck,
  Utensils,
} from 'lucide-react';
import './styles.css';

const demoCategories = ['All', 'Starters', 'Mains', 'Drinks', 'Desserts'];

const demoMenu = [
  {
    id: 1,
    name: 'Crispy Spring Rolls',
    categoryName: 'Starters',
    description: 'Vegetable rolls with sweet chilli sauce.',
    price: 8.5,
    spiceLevel: 'mild',
  },
  {
    id: 2,
    name: 'Grilled Chicken Bowl',
    categoryName: 'Mains',
    description: 'Chicken, rice, salad, and house sauce.',
    price: 16.9,
    spiceLevel: 'medium',
  },
  {
    id: 3,
    name: 'Vegetable Pasta',
    categoryName: 'Mains',
    description: 'Pasta with seasonal vegetables and tomato basil sauce.',
    price: 14.5,
    spiceLevel: 'none',
  },
  {
    id: 4,
    name: 'Fresh Lemonade',
    categoryName: 'Drinks',
    description: 'House-made lemonade served chilled.',
    price: 4.5,
    spiceLevel: 'none',
  },
  {
    id: 5,
    name: 'Chocolate Brownie',
    categoryName: 'Desserts',
    description: 'Warm brownie with chocolate sauce.',
    price: 7,
    spiceLevel: 'none',
  },
];

const demoOrders = [
  { id: 1001, status: 'pending', total: 25.4, items: 'Spring Rolls, Grilled Chicken Bowl' },
  { id: 1002, status: 'completed', total: 13, items: 'Garlic Bread, Chocolate Brownie' },
];

async function apiRequest(path, options = {}) {
  const response = await fetch(`/api${path}`, {
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
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState(demoCategories);
  const [menuItems, setMenuItems] = useState(demoMenu);
  const [notice, setNotice] = useState('Using demo menu until the API is connected.');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      from: 'assistant',
      text: 'Hi, I am SmartDine Assistant. Ask me about menu items, ordering, spice level, or order status.',
    },
  ]);

  useEffect(() => {
    async function loadMenuData() {
      try {
        const [categoryData, menuData] = await Promise.all([
          apiRequest('/menu/categories'),
          apiRequest('/menu/items?limit=50'),
        ]);

        const categoryNames = categoryData.categories.map((item) => item.name);
        setCategories(['All', ...categoryNames]);
        setMenuItems(menuData.items);
        setNotice('Live menu loaded from SmartDine API.');
      } catch (error) {
        setNotice('Showing demo menu because the API/database is not available yet.');
      }
    }

    loadMenuData();
  }, []);

  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = category === 'All' || item.categoryName === category;
      const text = `${item.name} ${item.description} ${item.categoryName}`.toLowerCase();
      return matchesCategory && text.includes(query.toLowerCase());
    });
  }, [category, menuItems, query]);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  function addToCart(menuItem) {
    setCart((items) => {
      const existing = items.find((item) => item.id === menuItem.id);
      if (existing) {
        return items.map((item) =>
          item.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...items, { ...menuItem, quantity: 1 }];
    });
  }

  function askAssistant(event) {
    event.preventDefault();
    const text = chatInput.trim();
    if (!text) return;

    setChatMessages((messages) => [
      ...messages,
      { from: 'user', text },
      { from: 'assistant', text: createAssistantReply(text) },
    ]);
    setChatInput('');
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-panel">
        <Header />
        {activePage === 'menu' && (
          <MenuPage
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            categories={categories}
            filteredMenu={filteredMenu}
            addToCart={addToCart}
            notice={notice}
          />
        )}
        {activePage === 'orders' && <OrdersPage cart={cart} cartTotal={cartTotal} />}
        {activePage === 'admin' && <AdminPage />}
        {activePage === 'auth' && <AuthPage />}
        {activePage === 'assistant' && (
          <AssistantPage
            chatMessages={chatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            askAssistant={askAssistant}
          />
        )}
      </main>
    </div>
  );
}

function Sidebar({ activePage, setActivePage }) {
  const links = [
    { id: 'menu', label: 'Menu', icon: Utensils },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'admin', label: 'Admin', icon: LayoutDashboard },
    { id: 'assistant', label: 'Assistant', icon: Bot },
    { id: 'auth', label: 'Login', icon: LogIn },
  ];

  return (
    <aside className="sidebar">
      <div className="brand-lockup">
        <span className="brand-mark">SD</span>
        <div>
          <strong>SmartDine</strong>
          <small>Restaurant system</small>
        </div>
      </div>
      <nav className="side-nav" aria-label="Application navigation">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <button
              className={activePage === link.id ? 'active' : ''}
              key={link.id}
              onClick={() => setActivePage(link.id)}
              type="button"
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function Header() {
  return (
    <section className="topbar">
      <div>
        <p className="eyebrow">ICT203 full-stack project</p>
        <h1>SmartDine Restaurant Management</h1>
      </div>
      <div className="status-pill">
        <ShieldCheck size={17} />
        <span>Admin and customer roles</span>
      </div>
    </section>
  );
}

function MenuPage({
  query,
  setQuery,
  category,
  setCategory,
  categories,
  filteredMenu,
  addToCart,
  notice,
}) {
  return (
    <section className="workspace">
      <div className="notice-bar">{notice}</div>
      <div className="toolbar">
        <label className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search menu items"
          />
        </label>
        <div className="segmented" aria-label="Menu category filter">
          {categories.map((item) => (
            <button
              className={category === item ? 'selected' : ''}
              key={item}
              onClick={() => setCategory(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="menu-grid">
        {filteredMenu.map((item) => (
          <article className="menu-card" key={item.id}>
            <div>
              <span className="category-chip">{item.categoryName}</span>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
            </div>
            <div className="card-footer">
              <strong>${item.price.toFixed(2)}</strong>
              <span>{item.spiceLevel} spice</span>
              <button onClick={() => addToCart(item)} type="button">
                Add
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function OrdersPage({ cart, cartTotal }) {
  return (
    <section className="workspace two-column">
      <div className="panel">
        <h2>Current Order</h2>
        {cart.length === 0 ? (
          <p className="muted">No items added yet. Add food from the menu.</p>
        ) : (
          <div className="order-list">
            {cart.map((item) => (
              <div className="order-row" key={item.id}>
                <span>{item.name}</span>
                <strong>
                  {item.quantity} x ${item.price.toFixed(2)}
                </strong>
              </div>
            ))}
            <div className="order-total">
              <span>Total</span>
              <strong>${cartTotal.toFixed(2)}</strong>
            </div>
          </div>
        )}
        <button className="primary-action" type="button">
          Submit order
        </button>
      </div>
      <div className="panel">
        <h2>Order Status</h2>
        {demoOrders.map((order) => (
          <div className="status-row" key={order.id}>
            <ClipboardList size={18} />
            <div>
              <strong>SD-{order.id}</strong>
              <p>{order.items}</p>
            </div>
            <span className={`status ${order.status}`}>{order.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AdminPage() {
  return (
    <section className="workspace two-column">
      <div className="panel">
        <h2>Admin Dashboard</h2>
        <div className="metrics-grid">
          <Metric label="Menu items" value="8" />
          <Metric label="Pending orders" value="1" />
          <Metric label="Completed" value="1" />
          <Metric label="Active users" value="2" />
        </div>
      </div>
      <div className="panel">
        <h2>Menu Management</h2>
        <form className="stacked-form">
          <input placeholder="Food name" />
          <input placeholder="Category" />
          <input placeholder="Price" />
          <select defaultValue="available">
            <option value="available">Available</option>
            <option value="hidden">Hidden</option>
          </select>
          <button className="primary-action" type="button">
            Save menu item
          </button>
        </form>
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function AuthPage() {
  return (
    <section className="workspace two-column">
      <div className="panel">
        <h2>Login</h2>
        <form className="stacked-form">
          <input placeholder="Email address" type="email" />
          <input placeholder="Password" type="password" />
          <button className="primary-action" type="button">
            Login
          </button>
        </form>
      </div>
      <div className="panel">
        <h2>Create Customer Account</h2>
        <form className="stacked-form">
          <input placeholder="Full name" />
          <input placeholder="Email address" type="email" />
          <input placeholder="Password" type="password" />
          <button className="primary-action" type="button">
            Register
          </button>
        </form>
      </div>
    </section>
  );
}

function AssistantPage({ chatMessages, chatInput, setChatInput, askAssistant }) {
  return (
    <section className="workspace assistant-layout">
      <div className="panel assistant-panel">
        <h2>SmartDine Assistant</h2>
        <div className="chat-window" aria-live="polite">
          {chatMessages.map((message, index) => (
            <div className={`chat-message ${message.from}`} key={`${message.from}-${index}`}>
              {message.text}
            </div>
          ))}
        </div>
        <form className="chat-form" onSubmit={askAssistant}>
          <input
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            placeholder="Ask about menu, ordering, or order status"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </section>
  );
}

function createAssistantReply(question) {
  const text = question.toLowerCase();
  if (text.includes('spicy') || text.includes('hot')) {
    return 'Spice levels are shown on each menu item. You can choose none, mild, medium, or hot items.';
  }
  if (text.includes('order') && text.includes('status')) {
    return 'Logged-in users can open the Orders page to check whether an order is pending, preparing, ready, completed, or cancelled.';
  }
  if (text.includes('menu') || text.includes('food') || text.includes('dish')) {
    return 'Use the Menu page to search food by name and filter items by category.';
  }
  if (text.includes('admin')) {
    return 'Admins can manage menu items and update order status from the admin dashboard.';
  }
  return 'I can help with menu search, ordering steps, order status, spice levels, and admin support.';
}

createRoot(document.getElementById('root')).render(<App />);
