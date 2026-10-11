import type { TransactionRecord, DailyRecord, MonthlyRecord } from '../../../types/report';
import type { ProductNameItem } from '../../../types/products';

export const DEFAULT_PRODUCT_NAMES: ProductNameItem[] = [
  {
    _id: '6aa10a7f11c434c40b51da13',
    name: 'Mie Ayam Pakdhe',
  },
  {
    _id: '6aa10d3f7a5088bf9ca30d33',
    name: 'Mie Ayam Pakdhe + Bakse',
  },
  {
    _id: '6ac593d2ba3f3b695b78d8ff',
    name: 'Pangsit Mie',
  },
  {
    _id: '6ac66568e1c554986332c2a4',
    name: 'Pangsit bakso',
  },
  {
    _id: '6ac5c5d363fc9c54832f2a7f',
    name: 'Teh Pucuk',
  },
  {
    _id: '6ac59ab831247eac6c9af115',
    name: 'Wonton Soup',
  },
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'trx-1',
    invoiceId: 'INV-20260905-001',
    dateTime: '05/09/2026 15:10',
    paymentMethod: 'Tunai',
    total: 40000,
    items: [
      { productId: '6aa10a7f11c434c40b51da13', name: 'Mie Ayam Pakdhe', qty: 2, price: 15000 },
      { productId: '6ac5c5d363fc9c54832f2a7f', name: 'Teh Pucuk', qty: 2, price: 5000 },
    ],
  },
  {
    id: 'trx-2',
    invoiceId: 'INV-20260905-002',
    dateTime: '05/09/2026 11:45',
    paymentMethod: 'QRIS',
    total: 43000,
    items: [
      { productId: '6aa10d3f7a5088bf9ca30d33', name: 'Mie Ayam Pakdhe + Bakse', qty: 1, price: 20000 },
      { productId: '6ac593d2ba3f3b695b78d8ff', name: 'Pangsit Mie', qty: 1, price: 18000 },
      { productId: '6ac5c5d363fc9c54832f2a7f', name: 'Teh Pucuk', qty: 1, price: 5000 },
    ],
  },
  {
    id: 'trx-3',
    invoiceId: 'INV-20260904-001',
    dateTime: '04/09/2026 19:20',
    paymentMethod: 'Transfer',
    total: 74000,
    items: [
      { productId: '6ac66568e1c554986332c2a4', name: 'Pangsit bakso', qty: 2, price: 22000 },
      { productId: '6ac59ab831247eac6c9af115', name: 'Wonton Soup', qty: 2, price: 15000 },
    ],
  },
  {
    id: 'trx-4',
    invoiceId: 'INV-20260904-002',
    dateTime: '04/09/2026 10:15',
    paymentMethod: 'Tunai',
    total: 20000,
    items: [
      { productId: '6aa10a7f11c434c40b51da13', name: 'Mie Ayam Pakdhe', qty: 1, price: 15000 },
      { productId: '6ac5c5d363fc9c54832f2a7f', name: 'Teh Pucuk', qty: 1, price: 5000 },
    ],
  },
  {
    id: 'trx-5',
    invoiceId: 'INV-20260903-001',
    dateTime: '03/09/2026 16:04',
    paymentMethod: 'QRIS',
    total: 106000,
    items: [
      { productId: '6aa10d3f7a5088bf9ca30d33', name: 'Mie Ayam Pakdhe + Bakse', qty: 2, price: 20000 },
      { productId: '6ac593d2ba3f3b695b78d8ff', name: 'Pangsit Mie', qty: 2, price: 18000 },
      { productId: '6ac59ab831247eac6c9af115', name: 'Wonton Soup', qty: 1, price: 15000 },
      { productId: '6ac5c5d363fc9c54832f2a7f', name: 'Teh Pucuk', qty: 3, price: 5000 },
    ],
  },
];

export const INITIAL_DAILY_RECORDS: DailyRecord[] = [
  {
    id: 'day-1',
    dayDate: 'Sabtu, 05/09/2026',
    trxCount: 28,
    productSales: {
      '6aa10a7f11c434c40b51da13': { qty: 24, price: 15000 },
      '6aa10d3f7a5088bf9ca30d33': { qty: 18, price: 20000 },
      '6ac593d2ba3f3b695b78d8ff': { qty: 14, price: 18000 },
      '6ac66568e1c554986332c2a4': { qty: 10, price: 22000 },
      '6ac5c5d363fc9c54832f2a7f': { qty: 35, price: 5000 },
      '6ac59ab831247eac6c9af115': { qty: 8, price: 15000 },
    },
    dominantMethod: { percentage: 60, type: 'Tunai' },
    totalRevenue: 912000,
  },
  {
    id: 'day-2',
    dayDate: 'Jumat, 04/09/2026',
    trxCount: 34,
    productSales: {
      '6aa10a7f11c434c40b51da13': { qty: 31, price: 15000 },
      '6aa10d3f7a5088bf9ca30d33': { qty: 22, price: 20000 },
      '6ac593d2ba3f3b695b78d8ff': { qty: 18, price: 18000 },
      '6ac66568e1c554986332c2a4': { qty: 14, price: 22000 },
      '6ac5c5d363fc9c54832f2a7f': { qty: 42, price: 5000 },
      '6ac59ab831247eac6c9af115': { qty: 12, price: 15000 },
    },
    dominantMethod: { percentage: 52, type: 'QRIS' },
    totalRevenue: 1140000,
  },
  {
    id: 'day-3',
    dayDate: 'Kamis, 03/09/2026',
    trxCount: 26,
    productSales: {
      '6aa10a7f11c434c40b51da13': { qty: 20, price: 15000 },
      '6aa10d3f7a5088bf9ca30d33': { qty: 14, price: 20000 },
      '6ac593d2ba3f3b695b78d8ff': { qty: 11, price: 18000 },
      '6ac66568e1c554986332c2a4': { qty: 9, price: 22000 },
      '6ac5c5d363fc9c54832f2a7f': { qty: 28, price: 5000 },
      '6ac59ab831247eac6c9af115': { qty: 6, price: 15000 },
    },
    dominantMethod: { percentage: 70, type: 'Tunai' },
    totalRevenue: 780000,
  },
  {
    id: 'day-4',
    dayDate: 'Rabu, 02/09/2026',
    trxCount: 29,
    productSales: {
      '6aa10a7f11c434c40b51da13': { qty: 22, price: 15000 },
      '6aa10d3f7a5088bf9ca30d33': { qty: 16, price: 20000 },
      '6ac593d2ba3f3b695b78d8ff': { qty: 13, price: 18000 },
      '6ac66568e1c554986332c2a4': { qty: 11, price: 22000 },
      '6ac5c5d363fc9c54832f2a7f': { qty: 30, price: 5000 },
      '6ac59ab831247eac6c9af115': { qty: 7, price: 15000 },
    },
    dominantMethod: { percentage: 48, type: 'QRIS' },
    totalRevenue: 826000,
  },
  {
    id: 'day-5',
    dayDate: 'Selasa, 01/09/2026',
    trxCount: 25,
    productSales: {
      '6aa10a7f11c434c40b51da13': { qty: 17, price: 15000 },
      '6aa10d3f7a5088bf9ca30d33': { qty: 12, price: 20000 },
      '6ac593d2ba3f3b695b78d8ff': { qty: 10, price: 18000 },
      '6ac66568e1c554986332c2a4': { qty: 8, price: 22000 },
      '6ac5c5d363fc9c54832f2a7f': { qty: 25, price: 5000 },
      '6ac59ab831247eac6c9af115': { qty: 5, price: 15000 },
    },
    dominantMethod: { percentage: 64, type: 'Tunai' },
    totalRevenue: 640000,
  },
];

export const INITIAL_MONTHLY_RECORDS: MonthlyRecord[] = [
  {
    id: 'm-1',
    period: 'September 2026 (Berjalan)',
    isCurrent: true,
    trxCount: 142,
    productSales: {
      '6aa10a7f11c434c40b51da13': { qty: 114, price: 15000 },
      '6aa10d3f7a5088bf9ca30d33': { qty: 82, price: 20000 },
      '6ac593d2ba3f3b695b78d8ff': { qty: 66, price: 18000 },
      '6ac66568e1c554986332c2a4': { qty: 52, price: 22000 },
      '6ac5c5d363fc9c54832f2a7f': { qty: 160, price: 5000 },
      '6ac59ab831247eac6c9af115': { qty: 38, price: 15000 },
    },
    grossRevenue: 4298000,
    auditStatus: 'Aktif Berjalan',
  },
  {
    id: 'm-2',
    period: 'Agustus 2026',
    trxCount: 780,
    productSales: {
      '6aa10a7f11c434c40b51da13': { qty: 620, price: 15000 },
      '6aa10d3f7a5088bf9ca30d33': { qty: 450, price: 20000 },
      '6ac593d2ba3f3b695b78d8ff': { qty: 360, price: 18000 },
      '6ac66568e1c554986332c2a4': { qty: 290, price: 22000 },
      '6ac5c5d363fc9c54832f2a7f': { qty: 890, price: 5000 },
      '6ac59ab831247eac6c9af115': { qty: 210, price: 15000 },
    },
    grossRevenue: 23410000,
    auditStatus: 'Audit Selesai',
  },
  {
    id: 'm-3',
    period: 'Juli 2026',
    trxCount: 710,
    productSales: {
      '6aa10a7f11c434c40b51da13': { qty: 560, price: 15000 },
      '6aa10d3f7a5088bf9ca30d33': { qty: 410, price: 20000 },
      '6ac593d2ba3f3b695b78d8ff': { qty: 320, price: 18000 },
      '6ac66568e1c554986332c2a4': { qty: 260, price: 22000 },
      '6ac5c5d363fc9c54832f2a7f': { qty: 810, price: 5000 },
      '6ac59ab831247eac6c9af115': { qty: 190, price: 15000 },
    },
    grossRevenue: 21050000,
    auditStatus: 'Audit Selesai',
  },
  {
    id: 'm-4',
    period: 'Juni 2026',
    trxCount: 690,
    productSales: {
      '6aa10a7f11c434c40b51da13': { qty: 540, price: 15000 },
      '6aa10d3f7a5088bf9ca30d33': { qty: 390, price: 20000 },
      '6ac593d2ba3f3b695b78d8ff': { qty: 310, price: 18000 },
      '6ac66568e1c554986332c2a4': { qty: 250, price: 22000 },
      '6ac5c5d363fc9c54832f2a7f': { qty: 780, price: 5000 },
      '6ac59ab831247eac6c9af115': { qty: 180, price: 15000 },
    },
    grossRevenue: 19820000,
    auditStatus: 'Audit Selesai',
  },
  {
    id: 'm-5',
    period: 'Mei 2026',
    trxCount: 640,
    productSales: {
      '6aa10a7f11c434c40b51da13': { qty: 500, price: 15000 },
      '6aa10d3f7a5088bf9ca30d33': { qty: 360, price: 20000 },
      '6ac593d2ba3f3b695b78d8ff': { qty: 290, price: 18000 },
      '6ac66568e1c554986332c2a4': { qty: 230, price: 22000 },
      '6ac5c5d363fc9c54832f2a7f': { qty: 720, price: 5000 },
      '6ac59ab831247eac6c9af115': { qty: 165, price: 15000 },
    },
    grossRevenue: 17970000,
    auditStatus: 'Audit Selesai',
  },
];
