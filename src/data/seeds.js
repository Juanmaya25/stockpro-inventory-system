// Demo dataset — StockPro runs fully client-side, so this seed data
// plays the role of the API layer. Swapping it for real endpoints only
// requires changing the initial state in src/hooks/useInventory.js.

export const CURRENT_MONTH = '2026-04';

export const INIT_PRODUCTS = [
  { id:1, name:'Laptop Dell XPS 13',   sku:'EL-0041', category:'Electrónica',    price:1299, cost:950, stock:36,  minStock:5,  supplier:'TechSupply S.A.', barcode:'7701234567001' },
  { id:2, name:'Mouse Logitech MX3',   sku:'EL-0088', category:'Electrónica',    price:89,   cost:55,  stock:8,   minStock:10, supplier:'TechSupply S.A.', barcode:'7701234567002' },
  { id:3, name:'Monitor LG 27"',       sku:'EL-0112', category:'Electrónica',    price:349,  cost:240, stock:22,  minStock:3,  supplier:'LG Colombia',     barcode:'7701234567003' },
  { id:4, name:'Teclado Mecánico K2',  sku:'HW-0034', category:'Hardware',       price:149,  cost:90,  stock:0,   minStock:5,  supplier:'KeyMasters',      barcode:'7701234567004' },
  { id:5, name:'Cable HDMI 2m',        sku:'AC-0201', category:'Accesorios',     price:12,   cost:5,   stock:145, minStock:20, supplier:'AccesoriosCol',   barcode:'7701234567005' },
  { id:6, name:'SSD Samsung 1TB',      sku:'ST-0055', category:'Almacenamiento', price:120,  cost:80,  stock:14,  minStock:5,  supplier:'Samsung Dist.',   barcode:'7701234567006' },
  { id:7, name:'Auriculares Sony XM5', sku:'AU-0019', category:'Audio',          price:279,  cost:190, stock:7,   minStock:3,  supplier:'Sony Colombia',   barcode:'7701234567007' },
  { id:8, name:'Webcam Logitech C922', sku:'CA-0033', category:'Electrónica',    price:99,   cost:65,  stock:18,  minStock:5,  supplier:'TechSupply S.A.', barcode:'7701234567008' },
];

export const INIT_SALES = [
  { id:1, date:'2026-04-30', product:'Laptop Dell XPS 13',   sku:'EL-0041', qty:2,  total:2598, client:'Empresa ABC',   method:'Transferencia' },
  { id:2, date:'2026-04-30', product:'Mouse Logitech MX3',   sku:'EL-0088', qty:3,  total:267,  client:'Juan Pérez',    method:'Efectivo' },
  { id:3, date:'2026-04-29', product:'Monitor LG 27"',       sku:'EL-0112', qty:1,  total:349,  client:'Maria López',   method:'Tarjeta' },
  { id:4, date:'2026-04-29', product:'Cable HDMI 2m',        sku:'AC-0201', qty:10, total:120,  client:'TechCorp S.A.', method:'Transferencia' },
  { id:5, date:'2026-04-28', product:'SSD Samsung 1TB',      sku:'ST-0055', qty:3,  total:360,  client:'Carlos Ruiz',   method:'Tarjeta' },
  { id:6, date:'2026-04-28', product:'Auriculares Sony XM5', sku:'AU-0019', qty:2,  total:558,  client:'Digital Store', method:'Transferencia' },
];

export const INIT_SUPPLIERS = [
  { id:1, name:'TechSupply S.A.', contact:'Carlos Mendez', email:'cmendez@techsupply.co',  phone:'310-555-0101', products:24, status:'active',   rating:5 },
  { id:2, name:'LG Colombia',     contact:'Ana García',    email:'agarcia@lgcol.com',       phone:'310-555-0202', products:8,  status:'active',   rating:4 },
  { id:3, name:'Samsung Dist.',   contact:'Luis Torres',   email:'ltorres@samsung.co',      phone:'310-555-0303', products:12, status:'active',   rating:5 },
  { id:4, name:'KeyMasters',      contact:'Rosa Jiménez',  email:'rjimenez@keymasters.co',  phone:'310-555-0404', products:6,  status:'inactive', rating:3 },
  { id:5, name:'AccesoriosCol',   contact:'Pedro Vargas',  email:'pvargas@accesorios.co',   phone:'310-555-0505', products:35, status:'active',   rating:4 },
  { id:6, name:'Sony Colombia',   contact:'Diana Castro',  email:'dcastro@sonycol.com',     phone:'310-555-0606', products:9,  status:'active',   rating:5 },
];

export const INIT_CLIENTS = [
  { id:1, name:'Empresa ABC',  email:'compras@abc.co',     phone:'310-100-2000', purchases:12, total:24500 },
  { id:2, name:'TechCorp S.A.', email:'orders@techcorp.co', phone:'310-300-4000', purchases:8,  total:15200 },
  { id:3, name:'Digital Store', email:'info@digital.co',    phone:'310-500-6000', purchases:5,  total:8900  },
  { id:4, name:'Carlos Ruiz',  email:'cruiz@gmail.com',    phone:'310-700-8000', purchases:3,  total:1850  },
];

export const MONTHLY_DATA = [
  { mes:'Nov', entradas:320, salidas:210, ventas:18500 },
  { mes:'Dic', entradas:410, salidas:380, ventas:28000 },
  { mes:'Ene', entradas:280, salidas:190, ventas:15200 },
  { mes:'Feb', entradas:390, salidas:310, ventas:21000 },
  { mes:'Mar', entradas:450, salidas:280, ventas:19800 },
  { mes:'Abr', entradas:520, salidas:390, ventas:23180 },
];

export const INIT_CAT_DATA = [
  { name:'Electrónica',    value:35, color:'#00d4aa' },
  { name:'Hardware',       value:25, color:'#4f8ef7' },
  { name:'Accesorios',     value:20, color:'#f7a24f' },
  { name:'Audio',          value:12, color:'#f05566' },
  { name:'Almacenamiento', value:8,  color:'#a78bfa' },
];
