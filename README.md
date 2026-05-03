# 📦 StockPro

> Sistema de inventario completo — productos, ventas, proveedores, clientes y reportes con stock en tiempo real.

[![Deploy](https://github.com/Juanmaya25/stockpro-inventory-system/actions/workflows/deploy.yml/badge.svg)](https://github.com/Juanmaya25/stockpro-inventory-system/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-3.0-00d4aa.svg)](#)

## 🚀 Demo en vivo

**[https://juanmaya25.github.io/stockpro-inventory-system](https://juanmaya25.github.io/stockpro-inventory-system)**

## 📸 Screenshots

> _Pendiente — sube capturas a `public/screenshots/`._

## ✨ Características

- 📊 **Dashboard** con KPIs de productos, valor de inventario, ventas y stock crítico
- 📦 **Inventario** con SKU, código de barras, stock con barra de progreso y margen automático
- 💰 **Punto de venta** que descuenta del inventario en tiempo real y valida stock
- 🏭 **Proveedores** con rating de estrellas y estado activo/inactivo
- 👥 **Clientes** con histórico de compras y total gastado
- 📈 **Reportes** con tendencia de ventas, entradas/salidas y top 5 productos por ingresos
- 🔍 **Búsqueda y ordenamiento** por nombre, SKU, stock o precio (asc/desc)
- 🌗 **Modo claro/oscuro** con paleta verde-azul
- 🔔 **Notificaciones automáticas** de stock agotado y stock bajo
- 📥 **Exportación CSV** de inventario, ventas y top productos

## 🛠️ Stack tecnológico

- **React 18** — hooks, `useMemo`, `useCallback`
- **Vite 5** — bundler con HMR
- **Recharts** — Bar, Line, Pie, Area
- **CSS-in-JS** — estilos inline temáticos
- **GitHub Actions + GitHub Pages** — CI/CD

## 💻 Instalación local

```bash
git clone https://github.com/Juanmaya25/stockpro-inventory-system.git
cd stockpro-inventory-system
npm install
npm run dev
```

Abre [http://localhost:5173/stockpro-inventory-system/](http://localhost:5173/stockpro-inventory-system/).

## 📁 Estructura

```
stockpro-inventory-system/
├── .github/workflows/deploy.yml
├── src/
│   ├── App.jsx          # Componente principal (6 secciones, modales, tema)
│   ├── main.jsx         # Entry point
│   └── index.css        # Reset y estilos globales
├── index.html
├── vite.config.js
└── package.json
```

## 👨‍💻 Autor

**Juan José Maya** — devMaya
Full Stack Developer · San Pedro, Antioquia, Colombia

- 🌐 Portafolio: [juanmaya25.github.io](https://juanmaya25.github.io)
- 💼 GitHub: [@Juanmaya25](https://github.com/Juanmaya25)
- 📱 WhatsApp: [+57 301 439 4180](https://wa.me/573014394180)
- ✉️ Email: [juanjosemorales2510@gmail.com](mailto:juanjosemorales2510@gmail.com)

## 📄 Licencia

MIT © Juan José Maya
