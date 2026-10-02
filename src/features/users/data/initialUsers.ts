import type { UserItem, RoleItem } from '../../../types/users';

export const INITIAL_USERS: UserItem[] = [
  {
    id: 'USR-001',
    name: 'Budi Santoso',
    username: '@budi_kasir',
    role: 'Kasir',
    status: 'Aktif',
    lastLogin: 'Hari ini, 09:15 WIB',
    registeredDate: '01/09/2026',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBcK5Qld28hQWkxFcwYwL7monYdEDNnKp8q3chrphanNMDIvHxRkeL-nz2jiRtVBBh2HMU-7BSX3d3kS337_usEcXVLQX6EbohsOMVXNETM7EgSXIdvK_gmwR6axL4txAo08OzEUtphLYUQp_uhyZNtjDJFaqn5daM6jZt_23r6dbZIz9rimzz1hNU9foqg60nq23L6cSBoouauoMO5xwAm1ypOCu7V1Q-_xRFR8d0VBs9hiXT29Fsw',
  },
  {
    id: 'USR-002',
    name: 'Siti Rahma',
    username: '@siti_admin',
    role: 'Admin',
    status: 'Aktif',
    lastLogin: 'Hari ini, 09:29 WIB',
    registeredDate: '01/08/2026',
    isVerifiedAdmin: true,
    isOnline: true,
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuALf9Y1-ZsIUgf5FPQNUou_GQLyE0DMthoN4_w81_xaUD1HgMVyzHSyqhhaaA-S2KIsBK-8ki_iXcX3BnnOW8EYYRHwBohtwzxq45woDauZm4U0BGdJMSfV-U__JKOfzE3xSSrI8ekBgFYlmPGqz4bB9kUY6EriJ8-OvwYTsIqrEsv-WYzP0WhKvnyOtZKM_kpgh6t6vDlL_eCMcT9BOl_470IwV7q973bv9KFzFpEIM3ctzZRdTrvV',
  },
  {
    id: 'USR-003',
    name: 'Andi Wijaya',
    username: '@andi_spv',
    role: 'Manajer Toko',
    status: 'Nonaktif',
    lastLogin: '3 hari yang lalu (21 Okt)',
    registeredDate: '15/08/2026',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuABj8fZKYW6-9kA_Em5w3gKCpkD4AnKFYlEvryFt0KEUv1RktFMkPOhDFUwT8vms4QHbAAt515bj_kQRfe4m_9A0ePpcRRR9IXqjdMdpit6zGXYuez14GwlfhOFuCvXCzO71qSCW07rY2BpbHvepKMymEs7NHiHIwBsaU1cSj9-5p8SAYx8S_H6qceRmPcktVtWjMM36aqfx_pt4Md-mJoN8H5dOZDawDFSh3XrwYTzz65apKdDOlHH',
  },
  {
    id: 'USR-004',
    name: 'Rian Pratama',
    username: '@rian_kasir2',
    role: 'Kasir',
    status: 'Aktif',
    lastLogin: 'Kemarin, 20:45 WIB',
    registeredDate: '20/09/2026',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB3DFDcR0PGxVqYIhQkAlvzbgRGFHYU8CEvU3FzcvyVzUj2LhIbZSQ1eX6kIInzMmcbny5__BOWsOX9Mf-MebhrNF-UXxl_UxzYj1kRGWV1nUYJhAhieFAUhftrxbFsJ96hMZaYm3PDdtwC1tTkEVMlO0ezdBO-rObbuJIWBPHcDTbfT_Fo_L_6X4wwMwGpK9AqJLtGojzvrnpUu1_cr2lgHgk-s7IEDHU8PEUFePgvQL4RbZW5iRlb',
  },
];

export const INITIAL_ROLES: RoleItem[] = [
  {
    id: 'role-admin',
    name: 'Administrator',
    type: 'system',
    userCount: 1,
    description: 'System role utama dengan hak akses penuh ke seluruh modul sistem.',
    iconName: 'admin',
    permissions: {
      transaksi: { view: true, create: true, update: true, delete: true },
      produk: { view: true, create: true, update: true, delete: true },
      laporan: { view: true, create: true, update: true, delete: true },
      pengaturan: { view: true, create: true, update: true, delete: true },
    },
  },
  {
    id: 'role-kasir',
    name: 'Kasir',
    type: 'active',
    userCount: 2,
    description: 'Akses khusus operasional kasir harian & pembacaan katalog produk.',
    iconName: 'pos',
    permissions: {
      transaksi: { view: true, create: true, update: true, delete: false },
      produk: { view: true, create: false, update: false, delete: false },
      laporan: { view: false, create: false, update: false, delete: false },
      pengaturan: { view: false, create: false, update: false, delete: false },
    },
  },
  {
    id: 'role-manajer',
    name: 'Manajer Toko',
    type: 'active',
    userCount: 1,
    description: 'Akses manajemen operasional toko, inventori, laporan, dan supervisi.',
    iconName: 'store',
    permissions: {
      transaksi: { view: true, create: true, update: true, delete: true },
      produk: { view: true, create: true, update: true, delete: true },
      laporan: { view: true, create: true, update: true, delete: false },
      pengaturan: { view: true, create: true, update: true, delete: false },
    },
  },
];
