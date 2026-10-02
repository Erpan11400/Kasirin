import type { Product } from '../../../types/pos';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'kopi',
    name: 'Kopi Hitam 200g',
    category: 'Minuman',
    price: 15000,
    sku: 'KOP-0192',
    stock: 24,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg0JxkKwxi9tyYIV0oJym4ul_btOXSfoi9inUv3Nj_U7TyDCocbUtCS0M1ioDhO6lnYf36TpD7A5OXUicZalC4H9lJS3jUbEaWCJDDtoGEFpZnB6OE5VlzjtBskVGBjvPgIS4quV6Dk-H9qoyPfACmOdjrG-_AzzXRQE0UeWNuRUhdY8NJRU8pFDq0CNU5exHTCuO_O1yHojC0vIB-hX3LgASq7FlhoFY75ItU-Eo1VRSciV8ZYtZg',
    imageAlt: 'Packaging pouch of rich dark roast Indonesian ground coffee labeled Kopi Hitam 200g on a clean studio table with warm diffused lighting, commercial retail package mockup'
  },
  {
    id: 'gula',
    name: 'Gula Pasir 1kg',
    category: 'Sembako',
    price: 16000,
    sku: 'GUL-0021',
    stock: 10,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzeRxuoe5RMHmxWR3efDp1O4nu-G5H79wU3U-iQH0B6zmTA5sqCw2VuSabHPyI_Rzzew1zWgZHewEXGtKgKtCeZGJ4GcB9gXg8A55P_fSlIrSYdx2sq8Owr2Xz_k8vIGw3YXDZ2vF5fT5KsbegEoCpmBrdohSje0ThrwTcKKUQ-uDhHMvf1yhp9YppiYY25YvWs-5bg_9Bl2q51s9pn6h2U5--q3y_bgFgJpVUp8plfHrV0ixxpHNM',
    imageAlt: 'Clear plastic pouch bag containing clean refined white granulated cane sugar labeled Gula Pasir 1kg against soft natural countertop backdrop'
  },
  {
    id: 'minyak',
    name: 'Minyak Goreng 2L',
    category: 'Sembako',
    price: 28000,
    sku: 'MYK-2001',
    stock: 5,
    isLowStock: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_07vajP5k1GVWwf9RXSoQDlVR0I_NTKMyladXDDK7t_SdUCvwen8P8X7yHR5GLTDHbPrJ6hfK93V5EZDPybBtBAgmDAdAkWGe7yq1Hr5t3vrXjcjwIexGRl8JuD-CHC5WfZ4XQjqxzK5rBlu7g_3AbAuvlAu22pYQhqfhjtwbuyHaRVzJj9y51tD2VmW9Xuzu9twZIRf0BuD7nXkCxmVIfRV5Mb70pXzUUdfWA09sGk2xUKsdXDnv',
    imageAlt: 'Transparent modern stand-up pouch of golden clear cooking palm oil labeled Minyak Goreng 2L in a well lit modern grocery display'
  },
  {
    id: 'beras',
    name: 'Beras Pandan Wangi 5kg',
    category: 'Sembako',
    price: 75000,
    sku: 'BRS-5011',
    stock: 12,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWsDfZWuTGB3G1U5lOnOskj09Do_ZrNoPoVjv8coBfQyRuMyAZqPxCRGvTDsjxy4IYk79Eo06y7fp_L5UlIoq7ukFrifOaa9ryhacByTLv_rOnJTbKPePPbCp06kVEj-fohi6M9IChjhYpnU-z4M3KD435eIJq33S8KOJd8IclXbtlhSHyvPpLoVnFNSSfN31s9vFDlp1zdfHAFsDVbMVePi96xnA4zvSYsljvcgdXY_F2I8Dx1-KS',
    imageAlt: 'Traditional woven premium rice bag with carrying handle marked Beras Pandan Wangi 5kg set against a clean market shelf display with Indonesian brand styling'
  },
  {
    id: 'teh',
    name: 'Teh Celup Kotak',
    category: 'Minuman',
    price: 8000,
    sku: 'TEH-0044',
    stock: 50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjlom9oW7PKIeLSyuR4ecPY4wEghQ8EVpqID1hZTBDUf8ECH2gZMdhjvBxwohF67W3-Jh9ixrRBuOoceaMUVRDCDSFHE7JtPEOS0fbW4-6QZ8D-yjrCcv9dqh6PiZg88mNlERMLUt-AgjNe0WlwnehW1OfvJvZEGOL7f_y4m8M2XpGSnFQHRzeCtauB7oJOgzvUTEyXeEhs97A6mhP9vTQ0BNmeS0lTDNl3xKt8gx9AO4oYP8pOSrD',
    imageAlt: 'Neat cardboard box packaging of Indonesian black jasmine tea bags labeled Teh Celup Kotak displayed cleanly with soft light accents'
  },
  {
    id: 'mie',
    name: 'Mi Instan Goreng',
    category: 'Makanan Ringan',
    price: 3100,
    sku: 'MIE-0112',
    stock: 100,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5ukeR3KnShOSPkqDifZc_1On-7wQvda8vUK6Uo0CjuXsCS0vcEcXUDJFPi25ckDECgD5L51OOLW3hCDEyFJexIrQ0l6oke7WY0GXU8G3sz6_GjQhhXQItCt256A1wUDOyHtxYMjmH4yNL01fC5GKlJuJXIRrhastzCnvqBhfEVKl_RjB12FrKN9xoFC7AUo4Q2Ak9vKx5UW3O0CU8W0vcR0abYS9vwUyy-ao_kyB9l8tMaoxTqxZ5',
    imageAlt: 'Indonesian instant fried noodles packet packaging labeled Mi Instan Goreng on clean reflective retail countertop setting'
  },
  {
    id: 'susu',
    name: 'Susu Kental Manis',
    category: 'Sembako',
    price: 12500,
    sku: 'SUS-0388',
    stock: 18,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxrn7Fc_XM_gclJHAIfx9tx_ms84KTp-lcleTGu4ZQzUupBb1TBip9ThZarwvYeq5dtoX_l_KmBBWa-fDSrLoGQ8nwF6pNCfHJBr8EiDg9KFubXoC0SoeaYpQv6sU_bO39k6AsUJYFlwKyYEEdSDEpbXUf6A-wvELPH5PgjKHcNbTs1IOIRpM5vj0gTZgHJ9WJDtnQbRT1L7q36roY_nfJgPwWB3067xOe3q90ChEIrIbo-Oj7xgV0',
    imageAlt: 'Classic tin can of sweet condensed milk labeled Susu Kental Manis on kitchen countertop under commercial soft studio photography light'
  },
  {
    id: 'tepung',
    name: 'Tepung Terigu 1kg',
    category: 'Sembako',
    price: 13000,
    sku: 'TPG-1002',
    stock: 22,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyXEb87L9dL7crQ4w5192JrORVjvmEOJQrP1rjP00TvsIT8cBnLKcYvhgLB5oIEoVmPIh98tFHFFX3QHNc_6kcsX-Pj-ALbpwQaBtzOKMdVsutYdiTxNdm4Lp-aX_5Nx9qY0i6IULSSL2p_nLJsbZ9bRncs4ya0y-78EVybt4gzegcwIvsaXIgr2v0MdvhkMrVaAbKRes2NxOUG4eu1qtx27057UOJ2J6j1dPmbXjrX_9tciLNCsxn',
    imageAlt: 'Paper flour bag packaging labeled Tepung Terigu 1kg set on bakery prep table with soft warm highlights'
  }
];

export const CATEGORIES = [
  'Semua Kategori',
  'Sembako',
  'Minuman',
  'Makanan Ringan',
  'Bumbu Dapur'
] as const;
