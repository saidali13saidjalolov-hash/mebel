import React, { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';

/* ==========================================================================
   1. ARCHITECTURAL SVG ICON SYSTEM (1.5px stroke, geometric precision)
   ========================================================================== */
const Icons = {
  LogoMark: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" stroke="currentColor" strokeWidth="1.75" />
      <path d="M9 23V9L16 17L23 9V23" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
      <line x1="2" y1="23" x2="30" y2="23" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  ),
  Search: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="11" cy="11" r="7.5" />
      <line x1="16.65" y1="16.65" x2="21.5" y2="21.5" />
    </svg>
  ),
  Heart: ({ filled = false }) => (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M12 20.5C12 20.5 3.5 15.1 3.5 8.8C3.5 6.1 5.6 4 8.2 4C9.8 4 11.2 4.8 12 6C12.8 4.8 14.2 4 15.8 4C18.4 4 20.5 6.1 20.5 8.8C20.5 15.1 12 20.5 12 20.5Z" />
    </svg>
  ),
  Bag: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 8H19L20 21H4L5 8Z" />
      <path d="M8.5 8V6C8.5 4.067 10.067 2.5 12 2.5C13.933 2.5 15.5 4.067 15.5 6V8" />
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="14 6 20 12 14 18" />
    </svg>
  ),
  ArrowUpRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="8 7 17 7 17 16" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="4 12 9 17 20 6" />
    </svg>
  ),
  Plus: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Minus: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Eye: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M2 12C4.5 7 8 4.5 12 4.5C16 4.5 19.5 7 22 12C19.5 17 16 19.5 12 19.5C8 19.5 4.5 17 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Sun: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="4.5" />
      <line x1="12" y1="2" x2="12" y2="4.5" />
      <line x1="12" y1="19.5" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="6.7" y2="6.7" />
      <line x1="17.3" y1="17.3" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="4.5" y2="12" />
      <line x1="19.5" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="6.7" y2="17.3" />
      <line x1="17.3" y1="6.7" x2="19.07" y2="4.93" />
    </svg>
  ),
  Moon: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20.5 14.5C19.2 15.1 17.7 15.4 16.1 15.4C10.8 15.4 6.6 11.2 6.6 5.9C6.6 4.5 6.9 3.2 7.4 2C4.3 3.4 2.2 6.5 2.2 10.2C2.2 15.3 6.3 19.4 11.4 19.4C15.5 19.4 19 16.7 20.5 14.5Z" />
    </svg>
  ),
  MapPin: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 21C12 21 18.5 14.8 18.5 9.5C18.5 5.9 15.6 3 12 3C8.4 3 5.5 5.9 5.5 9.5C5.5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  ),
  Phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 4H9L11 9L8.5 10.5C9.6 12.8 11.2 14.4 13.5 15.5L15 13L20 15V19C20 20.1 19.1 21 18 21C10.3 21 3 13.7 3 6C3 4.9 3.9 4 5 4Z" />
    </svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3L19 6V11.5C19 16.2 16 20.1 12 21.5C8 20.1 5 16.2 5 11.5V6L12 3Z" />
      <polyline points="9 12 11 14 15.5 9.5" />
    </svg>
  ),
  Truck: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="6" width="13" height="11" />
      <path d="M15 9H19L22 12.5V17H15V9Z" />
      <circle cx="6.5" cy="17.5" r="2" />
      <circle cx="18" cy="17.5" r="2" />
    </svg>
  ),
  Ruler: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="7" width="18" height="10" />
      <line x1="7" y1="7" x2="7" y2="11" />
      <line x1="11" y1="7" x2="11" y2="13" />
      <line x1="15" y1="7" x2="15" y2="11" />
      <line x1="19" y1="7" x2="19" y2="13" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Menu: () => (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="17" x2="15" y2="17" />
    </svg>
  ),
  Star: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.7 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2" />
    </svg>
  ),
};

/* ==========================================================================
   2. DOMAIN DATA — CURATED FURNITURE CATALOG, MATERIALS, LOOKBOOKS, SHOWROOMS
   ========================================================================== */
const CATEGORIES = [
  { id: 'all', label: 'Barcha kolleksiya' },
  { id: 'living', label: 'Mehmonxona' },
  { id: 'bedroom', label: 'Yotoqxona' },
  { id: 'dining', label: 'Ovqatlanish zonasi' },
  { id: 'office', label: 'Ish kabineti' },
  { id: 'lighting', label: 'Yoritish va dekor' },
];

const PRODUCTS_DATA = [
  {
    id: 'nm-01',
    sku: 'NM-SF-104',
    name: 'Oqsaroy Modulli Divan',
    collection: 'Oqsaroy Seriyasi',
    category: 'living',
    categoryLabel: 'Mehmonxona',
    basePrice: 19800000,
    oldPrice: 22400000,
    dimensions: '265 × 102 × 74 sm',
    weight: '78 kg',
    inStock: true,
    leadTime: 'Omborda tayyor (2–3 kun)',
    designer: 'Rustam Qodirov, notiMebel Studio',
    warranty: '5 yil karkas kafolati',
    rating: 4.9,
    reviewsCount: 38,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=85',
    description:
      'Past profil va chuqur o‘rindiqli arxitektura divani. Quruq qayin va eman karkasi hamda ko‘p qatlamli ortopedik ko‘pik tizimi uzoq yillar davomida shaklini yo‘qotmasligini ta’minlaydi.',
    specs: {
      frame: 'Kamera quritilgan massiv qayin va eman yog‘ochi',
      filling: 'HR-42 yuqori zichlikdagi elastik ko‘pik + g‘oz pari qatlami',
      legs: 'Yashirin mat qora po‘lat tayanchlar',
      care: 'Quruq kimyoviy tozalash, olinadigan yostiq jildlari',
    },
    finishes: [
      { id: 'boucle-ivory', name: 'Italiya Bukle — Sutrang', code: 'IT-01', hex: '#EAE4D7', priceDelta: 0 },
      { id: 'linen-sand', name: 'Zig‘ir — Qumloq', code: 'LN-04', hex: '#C6B79E', priceDelta: 450000 },
      { id: 'velvet-moss', name: 'Baxmal — Zaytun', code: 'VL-09', hex: '#4B5849', priceDelta: 900000 },
    ],
  },
  {
    id: 'nm-02',
    sku: 'NM-AC-208',
    name: 'Zomin Kreslosi',
    collection: 'Zomin Yog‘och',
    category: 'living',
    categoryLabel: 'Mehmonxona',
    basePrice: 6450000,
    oldPrice: null,
    dimensions: '76 × 82 × 78 sm',
    weight: '22 kg',
    inStock: true,
    leadTime: 'Omborda tayyor (2–3 kun)',
    designer: 'Malika Usmonova',
    warranty: '5 yil kafolat',
    rating: 4.8,
    reviewsCount: 24,
    badge: 'Yangi',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85',
    description:
      'Qo‘lda silliqlangan tabiiy yog‘och tirsakqo‘ygichlar va ergonomik egilgan suyanchiq uyg‘unligi. Kichik mehmonxona va mutolaa burchaklari uchun ideal mutanosiblik.',
    specs: {
      frame: '100% tabiiy Amerika yong‘og‘i yoki Shimoliy eman',
      filling: 'Anatomik shakllangan poliuretan ko‘pik',
      legs: 'Yog‘och karkas bilan yaxlit konstruksiya',
      care: 'Tabiiy asalari mumi bilan yilda 1 marta parvarish',
    },
    finishes: [
      { id: 'walnut-cognac', name: 'Yong‘oq + Konyak Charm', code: 'WL-02', hex: '#7A4326', priceDelta: 0 },
      { id: 'oak-oat', name: 'Eman + Suli Matosi', code: 'OK-05', hex: '#D8CFC0', priceDelta: -300000 },
      { id: 'ash-charcoal', name: 'Shumtol + Grafit', code: 'AS-08', hex: '#383735', priceDelta: 150000 },
    ],
  },
  {
    id: 'nm-03',
    sku: 'NM-DT-312',
    name: 'Registon Ovqatlanish Stoli',
    collection: 'Registon Atelier',
    category: 'dining',
    categoryLabel: 'Ovqatlanish zonasi',
    basePrice: 12900000,
    oldPrice: 14500000,
    dimensions: '220 × 100 × 75 sm',
    weight: '68 kg',
    inStock: true,
    leadTime: 'Omborda tayyor (3–4 kun)',
    designer: 'Rustam Qodirov',
    warranty: '7 yil konstruksiya kafolati',
    rating: 5.0,
    reviewsCount: 19,
    badge: 'Cheklangan',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=85',
    description:
      '8–10 kishiga mo‘ljallangan monumental ovqatlanish stoli. Qalinligi 40 mm bo‘lgan yaxlit yog‘och ustki qismi Germaniyaning Osmo tabiiy yog‘i bilan himoyalangan.',
    specs: {
      frame: '40 mm yaxlit massiv eman taxtasi',
      filling: 'Suv va issiqqa chidamli 3 qatlamli Osmo TopOil qoplama',
      legs: 'Arxitektura uslubidagi ikki ustunli massiv tayanch',
      care: 'Nam yumshoq mato bilan artish tavsiya etiladi',
    },
    finishes: [
      { id: 'natural-oak', name: 'Tabiiy Oq Eman', code: 'OK-01', hex: '#C8A983', priceDelta: 0 },
      { id: 'smoked-oak', name: 'Tutunli To‘q Eman', code: 'OK-07', hex: '#5D4736', priceDelta: 650000 },
      { id: 'american-walnut', name: 'Amerika Yong‘og‘i', code: 'WL-01', hex: '#4A3224', priceDelta: 1400000 },
    ],
  },
  {
    id: 'nm-04',
    sku: 'NM-BD-401',
    name: 'Samarqand Platforma Karavoti',
    collection: 'Oqsaroy Seriyasi',
    category: 'bedroom',
    categoryLabel: 'Yotoqxona',
    basePrice: 15600000,
    oldPrice: null,
    dimensions: '218 × 196 × 96 sm (180×200 matras)',
    weight: '84 kg',
    inStock: false,
    leadTime: 'Buyurtma asosida (14–18 kun)',
    designer: 'Malika Usmonova',
    warranty: '5 yil kafolat',
    rating: 4.9,
    reviewsCount: 31,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=85',
    description:
      'Keng yumshoq bosh qismi va poldan ko‘tarilgan yengil vizual konstruksiyaga ega zamonaviy karavot. Shovqinsiz ortopedik qayin lamellar tizimi bilan jihozlangan.',
    specs: {
      frame: 'Po‘lat burchakli mustahkamlangan yog‘och karkas',
      filling: 'Shovqinsiz 28 ta egiluvchan qayin lamellari',
      legs: '14 sm balandlikdagi robot-changyutgichga mos tayanchlar',
      care: 'Yon bort qoplamalari to‘liq yechilib tozalanadi',
    },
    finishes: [
      { id: 'warm-taupe', name: 'Issiq Kulrang Jun', code: 'WL-11', hex: '#9B9184', priceDelta: 0 },
      { id: 'chalk-boucle', name: 'Bo‘r Oq Bukle', code: 'IT-02', hex: '#EFECE6', priceDelta: 550000 },
      { id: 'espresso-nubuck', name: 'Espresso Nubuk', code: 'NB-03', hex: '#3B302A', priceDelta: 1100000 },
    ],
  },
  {
    id: 'nm-05',
    sku: 'NM-DK-502',
    name: 'Amir Temur Ish Stoli',
    collection: 'Minimalist Kabinet',
    category: 'office',
    categoryLabel: 'Ish kabineti',
    basePrice: 8900000,
    oldPrice: 9800000,
    dimensions: '160 × 75 × 75 sm',
    weight: '44 kg',
    inStock: true,
    leadTime: 'Omborda tayyor (2–3 kun)',
    designer: 'Rustam Qodirov',
    warranty: '5 yil kafolat',
    rating: 4.9,
    reviewsCount: 15,
    badge: 'Yangi',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=85',
    description:
      'Kabellar uchun yashirin magnitli kanal, ikkita yumshoq yopiluvchi Blum tortmasi va tabiiy charm yozuv paneliga ega rahbarlar va ijodkorlar stoli.',
    specs: {
      frame: 'Yong‘oq shponi va massiv eman chetlari',
      filling: 'Avstriyaning Blum Tandembox yumshoq mexanizmlari',
      legs: 'Mat kukunli bo‘yoq bilan qoplangan po‘lat ramka',
      care: 'Quruq yoki biroz nam mikrofibra mato',
    },
    finishes: [
      { id: 'walnut-black', name: 'Yong‘oq + Qora Po‘lat', code: 'DK-01', hex: '#583B28', priceDelta: 0 },
      { id: 'oak-stone', name: 'Eman + Tosh Kulrang', code: 'DK-02', hex: '#B9A389', priceDelta: 0 },
    ],
  },
  {
    id: 'nm-06',
    sku: 'NM-SB-609',
    name: 'Buxoro Komod va Konsol',
    collection: 'Registon Atelier',
    category: 'dining',
    categoryLabel: 'Ovqatlanish zonasi',
    basePrice: 10400000,
    oldPrice: null,
    dimensions: '185 × 46 × 78 sm',
    weight: '56 kg',
    inStock: true,
    leadTime: 'Omborda tayyor (3–4 kun)',
    designer: 'Malika Usmonova',
    warranty: '5 yil kafolat',
    rating: 4.7,
    reviewsCount: 12,
    badge: null,
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=85',
    description:
      'Tutqichsiz Push-to-Open tizimi va vertikal frezerlangan yog‘och fasadli komod. Mehmonxona, ovqatlanish xonasi yoki keng dahliz uchun tartibli saqlash yechimi.',
    specs: {
      frame: 'Frezerlangan massiv eman fasad va MDF shpon korpus',
      filling: '3 ta sozlanuvchi ichki tokcha va 2 ta tortma',
      legs: 'Minimalist bronza rangli po‘lat tayanchlar',
      care: 'To‘g‘ridan-to‘g‘ri quyosh nuridan himoyalash tavsiya etiladi',
    },
    finishes: [
      { id: 'oak-fluted', name: 'Tabiiy Eman', code: 'SB-01', hex: '#C2A37E', priceDelta: 0 },
      { id: 'espresso-fluted', name: 'To‘q Espresso', code: 'SB-02', hex: '#342922', priceDelta: 400000 },
    ],
  },
  {
    id: 'nm-07',
    sku: 'NM-CT-115',
    name: 'Travertin Jurnal Stoli',
    collection: 'Tosh va Yog‘och',
    category: 'living',
    categoryLabel: 'Mehmonxona',
    basePrice: 5200000,
    oldPrice: 5900000,
    dimensions: '120 × 70 × 36 sm',
    weight: '48 kg',
    inStock: true,
    leadTime: 'Omborda tayyor (1–2 kun)',
    designer: 'Rustam Qodirov',
    warranty: '5 yil kafolat',
    rating: 4.9,
    reviewsCount: 27,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1200&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85',
    description:
      'Tabiiy g‘ovakli travertin toshi va massiv eman asosining haykaltaroshona uyg‘unligi. Har bir tosh plitasi o‘ziga xos takrorlanmas tabiiy naqshga ega.',
    specs: {
      frame: '25 mm qalinlikdagi tabiiy travertin tosh plitasi',
      filling: 'G‘ovaklarni himoyalovchi maxsus Italiya singdiruvchisi',
      legs: 'Silindrsimon massiv eman tayanchlar',
      care: 'Kislotali suyuqliklar to‘kilganda darhol artish lozim',
    },
    finishes: [
      { id: 'travertine-cream', name: 'Krem Travertin + Eman', code: 'TR-01', hex: '#DFD6C7', priceDelta: 0 },
      { id: 'travertine-silver', name: 'Kumushrang Travertin + Yong‘oq', code: 'TR-02', hex: '#A59E94', priceDelta: 500000 },
    ],
  },
  {
    id: 'nm-08',
    sku: 'NM-LP-704',
    name: 'Chorsu Arxitektura Torsheri',
    collection: 'Yorug‘lik Geometriyasi',
    category: 'lighting',
    categoryLabel: 'Yoritish va dekor',
    basePrice: 3150000,
    oldPrice: null,
    dimensions: '42 × 42 × 162 sm',
    weight: '9.5 kg',
    inStock: true,
    leadTime: 'Omborda tayyor (1–2 kun)',
    designer: 'Malika Usmonova',
    warranty: '3 yil elektronika kafolati',
    rating: 4.8,
    reviewsCount: 16,
    badge: 'Yangi',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85',
    description:
      'Og‘ir marmar taglik, latun ustun va qo‘lda to‘qilgan zig‘ir abajurga ega pol lampasi. Xonada ko‘zni charchatmaydigan 2700K iliq tarqoq nur yaratadi.',
    specs: {
      frame: 'Tabiiy marmar taglik va silliqlangan latun quvur',
      filling: 'E27 LED 2700K dimmerli (yorug‘likni sozlovchi) tizim',
      legs: '2.5 metrli to‘qima matoli elektr shnuri',
      care: 'Quruq yumshoq cho‘tka bilan changdan tozalash',
    },
    finishes: [
      { id: 'brass-linen', name: 'Mat Latun + Oq Zig‘ir', code: 'LP-01', hex: '#C5A86F', priceDelta: 0 },
      { id: 'bronze-sand', name: 'Qora Bronza + Qumrang', code: 'LP-02', hex: '#433C35', priceDelta: 150000 },
    ],
  },
  {
    id: 'nm-09',
    sku: 'NM-DC-318',
    name: 'Navoiy Ovqatlanish Stuli (2 dona)',
    collection: 'Registon Atelier',
    category: 'dining',
    categoryLabel: 'Ovqatlanish zonasi',
    basePrice: 4800000,
    oldPrice: 5400000,
    dimensions: '54 × 56 × 81 sm (har biri)',
    weight: '15 kg (juftlik)',
    inStock: true,
    leadTime: 'Omborda tayyor (2–3 kun)',
    designer: 'Rustam Qodirov',
    warranty: '5 yil kafolat',
    rating: 4.9,
    reviewsCount: 42,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=85',
    description:
      'Bug‘da egilgan yaxlit eman suyanchig‘i va dog‘ga chidamli mato qoplamali ovqatlanish stullari to‘plami (2 dona). Uzoq kechki suhbatlar uchun maksimal qulaylik.',
    specs: {
      frame: 'Bug‘da egilgan massiv eman yog‘ochi',
      filling: 'Suv o‘tkazmaydigan EasyClean mikro-bukle mato',
      legs: 'Polni tirnamaydigan kigiz (fetr) qoplamalar',
      care: 'Nam salfetka bilan oson tozalanadi',
    },
    finishes: [
      { id: 'oak-cream', name: 'Eman + Sutrang', code: 'DC-01', hex: '#E3DDD1', priceDelta: 0 },
      { id: 'walnut-terracotta', name: 'Yong‘oq + Terrakota', code: 'DC-02', hex: '#8C4A27', priceDelta: 300000 },
    ],
  },
  {
    id: 'nm-10',
    sku: 'NM-NS-412',
    name: 'Toshkent Yotoqxona Tumbasi',
    collection: 'Oqsaroy Seriyasi',
    category: 'bedroom',
    categoryLabel: 'Yotoqxona',
    basePrice: 2950000,
    oldPrice: null,
    dimensions: '52 × 42 × 48 sm',
    weight: '16 kg',
    inStock: true,
    leadTime: 'Omborda tayyor (2–3 kun)',
    designer: 'Malika Usmonova',
    warranty: '5 yil kafolat',
    rating: 4.8,
    reviewsCount: 18,
    badge: null,
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
    description:
      'Kitob va ko‘zoynaklar uchun ochiq nisha hamda yumshoq yopiluvchi tortmaga ega ixcham yotoqxona tumbasi. Karavot yonida ortiqcha shovqinsiz tartib yaratadi.',
    specs: {
      frame: 'Tabiiy eman shponi va massiv oyoqlar',
      filling: 'Blum yumshoq yopilish yo‘naltirgichlari',
      legs: 'Konussimon massiv eman oyoqlar',
      care: 'Quruq mato bilan artish',
    },
    finishes: [
      { id: 'natural-oak-ns', name: 'Tabiiy Eman', code: 'NS-01', hex: '#C8A983', priceDelta: 0 },
      { id: 'walnut-ns', name: 'Amerika Yong‘og‘i', code: 'NS-02', hex: '#5A3E2B', priceDelta: 200000 },
    ],
  },
  {
    id: 'nm-11',
    sku: 'NM-OC-515',
    name: 'Mirabad Ergonomik Kreslosi',
    collection: 'Minimalist Kabinet',
    category: 'office',
    categoryLabel: 'Ish kabineti',
    basePrice: 7400000,
    oldPrice: null,
    dimensions: '66 × 64 × 88–96 sm',
    weight: '19 kg',
    inStock: false,
    leadTime: 'Buyurtma asosida (10–14 kun)',
    designer: 'Rustam Qodirov',
    warranty: '5 yil mexanizm kafolati',
    rating: 4.9,
    reviewsCount: 11,
    badge: 'Yangi',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=85',
    description:
      'Plastik ofis kreslolaridan farqli o‘laroq, uy interyeriga tabiiy singib ketadigan egilgan yong‘oq qobiqli va yashirin sinxron mexanizmli ish kreslosi.',
    specs: {
      frame: '7 qatlamli egilgan yong‘oq fanerasi va quyma alyuminiy',
      filling: 'Anilin tabiiy charm yoki jun mato qoplama',
      legs: '5 yulduzli mat qora alyuminiy g‘ildirakli baza',
      care: 'Charm uchun maxsus konditsioner krem',
    },
    finishes: [
      { id: 'cognac-leather', name: 'Yong‘oq + Konyak Charm', code: 'OC-01', hex: '#884B2A', priceDelta: 0 },
      { id: 'black-wool', name: 'Qora Eman + Grafit Jun', code: 'OC-02', hex: '#2B2A29', priceDelta: -350000 },
    ],
  },
  {
    id: 'nm-12',
    sku: 'NM-LC-122',
    name: 'Fergana Kusetka va Banketka',
    collection: 'Zomin Yog‘och',
    category: 'living',
    categoryLabel: 'Mehmonxona',
    basePrice: 5850000,
    oldPrice: 6400000,
    dimensions: '150 × 52 × 43 sm',
    weight: '24 kg',
    inStock: true,
    leadTime: 'Omborda tayyor (2–3 kun)',
    designer: 'Malika Usmonova',
    warranty: '5 yil kafolat',
    rating: 4.8,
    reviewsCount: 14,
    badge: null,
    image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=85',
    description:
      'Yotoqxona oxiri, keng dahliz yoki panorama deraza oldi uchun mo‘ljallangan minimalist kusetka. To‘qilgan tabiiy charm tasmalar va yumshoq yostiq bilan.',
    specs: {
      frame: 'Massiv eman yog‘ochi va an’anaviy tirnoqsiz birikmalar',
      filling: 'Olinadigan yumshoq zig‘ir yostiq',
      legs: 'Massiv eman karkas',
      care: 'Quruq tozalash',
    },
    finishes: [
      { id: 'oak-linen-bench', name: 'Eman + Tabiiy Zig‘ir', code: 'LC-01', hex: '#D6CCB9', priceDelta: 0 },
      { id: 'walnut-saddle', name: 'Yong‘oq + Egar Charm', code: 'LC-02', hex: '#6F4229', priceDelta: 450000 },
    ],
  },
];

const MATERIALS_DATA = [
  {
    id: 'oak',
    name: 'Shimoliy Massiv Eman',
    origin: 'Kavkaz va Yevropa o‘rmonlari • FSC Sertifikat',
    metricLabel: 'Qattiqlik darajasi',
    metricValue: '3.8 Brinell (Yuqori chidamlilik)',
    hex: '#C4A47C',
    summary:
      'Kameralarda 8% namlikkacha sekin quritilgan eman taxtalari Toshkentning quruq yoz va isitiladigan qish iqlimida yorilmaydi va shaklini saqlaydi.',
    care: 'Yiliga bir marta tabiiy Osmo moyi bilan yangilash kifoya.',
  },
  {
    id: 'boucle',
    name: 'Italiya Bukle va Zig‘ir',
    origin: 'Prato, Italiya • OEKO-TEX® Standard 100',
    metricLabel: 'Ishqalanishga chidamlilik',
    metricValue: '85,000 Martindale sikli',
    hex: '#E5DFD3',
    summary:
      'Taktil jihatdan iliq va nafas oluvchi tabiiy paxta-jun aralashmasi. Maxsus himoya qatlami tufayli qahva yoki suv tomchilarini darhol shimib olmaydi.',
    care: 'Yumshoq cho‘tka va nam mikrofibra bilan oson tozalanadi.',
  },
  {
    id: 'travertine',
    name: 'Tabiiy Tabaka Travertin',
    origin: 'Tabiiy tosh karerlari • Qo‘lda silliqlangan',
    metricLabel: 'Zichlik va ishlov',
    metricValue: 'Mat Honed + Italiya himoya singdiruvchisi',
    hex: '#D7CEC0',
    summary:
      'Har bir plita million yillar davomida shakllangan tabiiy g‘ovak va chiziqlarga ega. Yaltiroq lak o‘rniga tabiiy mat tosh hissi saqlab qolingan.',
    care: 'Issiq chashka va idishlarga chidamli, maxsus taglik shart emas.',
  },
  {
    id: 'leather',
    name: 'Full-Grain Anilin Charm',
    origin: 'Turkiya va Italiya ko‘nchilik ustaxonalari',
    metricLabel: 'Teri qalinligi',
    metricValue: '1.4 – 1.6 mm tabiiy tekstura',
    hex: '#844827',
    summary:
      'Sun’iy bo‘yoq qatlami bilan yopilmagan sof charm. Vaqt o‘tishi bilan yanada chiroyli tabiiy patina (olijanob tus) hosil qiladi.',
    care: 'Har 6 oyda tabiiy balm bilan oziqlantirish tavsiya etiladi.',
  },
];

const LOOKBOOK_SCENES = [
  {
    id: 'scene-living',
    title: 'Mehmonxona: Tinch Geometriya',
    subtitle: 'Toshkent City xususiy rezidensiyasi loyihasi • 68 m²',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85',
    pins: [
      { id: 'pin-1', number: '01', x: 34, y: 64, productId: 'nm-01', note: 'Sutrang bukle qoplamali 3 o‘rinli divan' },
      { id: 'pin-2', number: '02', x: 54, y: 76, productId: 'nm-07', note: 'Krem travertin markaziy jurnal stoli' },
      { id: 'pin-3', number: '03', x: 77, y: 63, productId: 'nm-02', note: 'Yong‘oq va charm aksent kreslosi' },
      { id: 'pin-4', number: '04', x: 18, y: 42, productId: 'nm-08', note: '2700K iliq nurli latun torsher' },
    ],
  },
  {
    id: 'scene-dining',
    title: 'Ovqatlanish va Ish Uyg‘unligi',
    subtitle: 'Mirabad Avenue penthaus interyeri • 54 m²',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85',
    pins: [
      { id: 'pin-5', number: '01', x: 46, y: 66, productId: 'nm-03', note: '220 sm yaxlit eman ovqatlanish stoli' },
      { id: 'pin-6', number: '02', x: 64, y: 68, productId: 'nm-09', note: 'Bug‘da egilgan eman stullar juftligi' },
      { id: 'pin-7', number: '03', x: 24, y: 58, productId: 'nm-06', note: 'Frezerlangan fasadli Buxoro komodi' },
      { id: 'pin-8', number: '04', x: 82, y: 55, productId: 'nm-05', note: 'Yashirin kabelli ish stoli' },
    ],
  },
];

const SHOWROOMS_DATA = [
  {
    id: 'mirabad',
    district: 'Mirobod tumani • Flagman Shourum',
    address: 'Taras Shevchenko ko‘chasi, 21A (Ming O‘rik metro yaqinida)',
    hours: 'Har kuni: 10:00 – 20:00',
    phone: '+998 71 200-44-88',
    area: '640 m² ekspozitsiya • Material kutubxonasi',
  },
  {
    id: 'yunusobod',
    district: 'Yunusobod tumani • Design Studio',
    address: 'Amir Temur shoh ko‘chasi, 108 (Bodomzor)',
    hours: 'Dush–Shan: 10:00 – 19:30 • Yak: 11:00 – 18:00',
    phone: '+998 71 200-44-99',
    area: '380 m² ekspozitsiya • 3D loyihalash bo‘limi',
  },
];

const FAQ_DATA = [
  {
    q: 'Mebel o‘lchamlari va matosini xonamga moslab o‘zgartirish mumkinmi?',
    a: 'Ha. notiMebel o‘z ishlab chiqarish ustaxonasiga ega bo‘lgani sababli har bir divan, stol yoki karavotning eni, uzunligi, yog‘och tusi va Italiya matosini interyeringiz chizmasiga moslab tayyorlab beramiz. Shourumimizda 240 dan ortiq mato va yog‘och namunalari mavjud.',
  },
  {
    q: 'Toshkent bo‘ylab yetkazib berish va yig‘ish xizmati qancha turadi?',
    a: '10 000 000 so‘mdan yuqori barcha buyurtmalar uchun Toshkent shahri ichida yetkazib berish, qavatga ko‘tarish va professional ustalar tomonidan yig‘ish mutlaqo bepul. Kichik buyurtmalar uchun yetkazib berish narxi 250 000 so‘mni tashkil etadi.',
  },
  {
    q: 'Muddatli to‘lov (bo‘lib to‘lash) imkoniyati bormi?',
    a: 'Albatta. Hamkor banklarimiz va ichki tizim orqali 6 oydan 12 oygacha boshlang‘ich to‘lovsiz va ortiqcha foizlarsiz (0%) rasmiylashtirish mumkin. Buning uchun faqat pasport yoki ID-karta kifoya.',
  },
  {
    q: 'Kafolat muddati nimalarni o‘z ichiga oladi?',
    a: 'Barcha yumshoq va korpus mebellar karkasiga 5 yildan 7 yilgacha rasmiy yozma kafolat beriladi. Kafolat davrida mexanizmlar sozlanishi va konstruktiv nuqsonlar bepul bartaraf etiladi.',
  },
  {
    q: 'Dizayner uyga kelib o‘lcham olishi mumkinmi?',
    a: 'Ha, Toshkent shahri bo‘ylab interyer-konsultantimiz lazerli o‘lchov asboblari hamda mato-yog‘och kataloglari bilan xonadoningizga tashrif buyuradi. Xizmat buyurtma rasmiylashtirilganda bepul taqdim etiladi.',
  },
];

/* ==========================================================================
   3. UTILITY HELPERS
   ========================================================================== */
function formatPriceUZS(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return "0 so'm";
  return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm`;
}

/* ==========================================================================
   4. MAIN APPLICATION COMPONENT
   ========================================================================== */
export default function App() {
  // Architectural color mode: 'daylight' (warm limestone) | 'evening' (deep charcoal)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('notimebel_theme') || 'daylight';
    } catch {
      return 'daylight';
    }
  });

  // Catalog filters & sorting
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [priceBracket, setPriceBracket] = useState('all'); // 'all' | 'under-8m' | '8m-15m' | 'over-15m'
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'rating'

  // Per-product selected finish index map: { [productId]: finishIndex }
  const [selectedFinishes, setSelectedFinishes] = useState(() => {
    const initial = {};
    PRODUCTS_DATA.forEach((p) => {
      initial[p.id] = 0;
    });
    return initial;
  });

  // Hero featured showcase index
  const [heroShowcaseIndex, setHeroShowcaseIndex] = useState(0);
  const heroProducts = useMemo(() => [PRODUCTS_DATA[0], PRODUCTS_DATA[2], PRODUCTS_DATA[6]], []);

  // Materials explorer active tab
  const [activeMaterialId, setActiveMaterialId] = useState(MATERIALS_DATA[0].id);

  // Lookbook interactive scene & active hotspot
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [activePinId, setActivePinId] = useState(LOOKBOOK_SCENES[0].pins[0].id);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Persistent Wishlist (array of productIds)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('notimebel_wishlist');
      return saved ? JSON.parse(saved) : ['nm-01', 'nm-07'];
    } catch {
      return ['nm-01', 'nm-07'];
    }
  });

  // Persistent Cart: [{ key, productId, finishId, quantity }]
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('notimebel_cart');
      return saved ? JSON.parse(saved) : [{ key: 'nm-07__travertine-cream', productId: 'nm-07', finishId: 'travertine-cream', quantity: 1 }];
    } catch {
      return [];
    }
  });

  // Drawers & Modals state
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewImageIdx, setQuickViewImageIdx] = useState(0);
  const [quickViewQty, setQuickViewQty] = useState(1);

  // Cart Checkout & Promo state
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null); // { code: 'NOTI10', rate: 0.1 }
  const [checkoutStep, setCheckoutStep] = useState('bag'); // 'bag' | 'form' | 'confirmed'
  const [orderNumber, setOrderNumber] = useState('');
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: '',
    phone: '+998 ',
    district: 'Mirobod tumani',
    address: '',
    paymentMethod: 'card',
    comment: '',
  });
  const [checkoutErrors, setCheckoutErrors] = useState({});

  // Custom Bespoke Order / Consultation Form state
  const [bespokeForm, setBespokeForm] = useState({
    roomType: 'Mehmonxona to‘plami',
    preferredMaterial: 'Shimoliy Massiv Eman',
    budget: '15 – 30 mln so‘m',
    visitType: 'Shourumga tashrif (Mirobod)',
    clientName: '',
    clientPhone: '+998 ',
    notes: '',
  });
  const [bespokeSubmitted, setBespokeSubmitted] = useState(false);
  const [bespokeError, setBespokeError] = useState('');

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const searchInputRef = useRef(null);

  const showToast = (message, detail = '') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, detail });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3400);
  };

  // Sync theme attribute & localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('notimebel_theme', theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('notimebel_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('notimebel_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Body scroll lock & Escape key handler for overlays
  useEffect(() => {
    const hasOverlay = cartOpen || wishlistOpen || mobileMenuOpen || Boolean(quickViewProduct);
    document.body.style.overflow = hasOverlay ? 'hidden' : '';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setCartOpen(false);
        setWishlistOpen(false);
        setMobileMenuOpen(false);
        setQuickViewProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cartOpen, wishlistOpen, mobileMenuOpen, quickViewProduct]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  /* ------------------------------------------------------------------------
     COMPUTED CATALOG & CART VALUES
     ------------------------------------------------------------------------ */
  const getProductActiveFinish = (product) => {
    const idx = selectedFinishes[product.id] ?? 0;
    return product.finishes[idx] || product.finishes[0];
  };

  const getProductEffectivePrice = (product) => {
    const finish = getProductActiveFinish(product);
    return product.basePrice + (finish ? finish.priceDelta : 0);
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const list = PRODUCTS_DATA.filter((product) => {
      if (activeCategory !== 'all' && product.category !== activeCategory) return false;
      if (onlyInStock && !product.inStock) return false;

      const currentPrice = product.basePrice + (product.finishes[selectedFinishes[product.id] ?? 0]?.priceDelta || 0);
      if (priceBracket === 'under-8m' && currentPrice >= 8000000) return false;
      if (priceBracket === '8m-15m' && (currentPrice < 8000000 || currentPrice > 15000000)) return false;
      if (priceBracket === 'over-15m' && currentPrice <= 15000000) return false;

      if (query) {
        const haystack = [
          product.name,
          product.sku,
          product.collection,
          product.categoryLabel,
          product.description,
          ...product.finishes.map((f) => f.name),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });

    const sorted = [...list];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => getProductEffectivePrice(a) - getProductEffectivePrice(b));
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => getProductEffectivePrice(b) - getProductEffectivePrice(a));
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
    }
    return sorted;
  }, [activeCategory, onlyInStock, priceBracket, searchQuery, sortBy, selectedFinishes]);

  const detailedCartItems = useMemo(() => {
    return cart
      .map((entry) => {
        const product = PRODUCTS_DATA.find((p) => p.id === entry.productId);
        if (!product) return null;
        const finish = product.finishes.find((f) => f.id === entry.finishId) || product.finishes[0];
        const unitPrice = product.basePrice + (finish?.priceDelta || 0);
        return {
          ...entry,
          product,
          finish,
          unitPrice,
          lineTotal: unitPrice * entry.quantity,
        };
      })
      .filter(Boolean);
  }, [cart]);

  const cartCount = useMemo(() => detailedCartItems.reduce((sum, item) => sum + item.quantity, 0), [detailedCartItems]);

  const cartSubtotal = useMemo(
    () => detailedCartItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [detailedCartItems]
  );

  const promoDiscount = useMemo(() => {
    if (!appliedPromo) return 0;
    return Math.round(cartSubtotal * appliedPromo.rate);
  }, [cartSubtotal, appliedPromo]);

  const deliveryFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return cartSubtotal - promoDiscount >= 10000000 ? 0 : 250000;
  }, [cartSubtotal, promoDiscount]);

  const cartGrandTotal = Math.max(0, cartSubtotal - promoDiscount + deliveryFee);

  const wishlistProducts = useMemo(
    () => PRODUCTS_DATA.filter((p) => wishlist.includes(p.id)),
    [wishlist]
  );

  /* ------------------------------------------------------------------------
     ACTION HANDLERS
     ------------------------------------------------------------------------ */
  const handleSelectFinish = (productId, finishIndex) => {
    setSelectedFinishes((prev) => ({
      ...prev,
      [productId]: finishIndex,
    }));
  };

  const toggleWishlist = (productId) => {
    const product = PRODUCTS_DATA.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Sevimlilardan olib tashlandi', product?.name || '');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Sevimlilarga saqlandi', product?.name || '');
        return [...prev, productId];
      }
    });
  };

  const addToCart = (product, customFinish = null, quantity = 1) => {
    const finish = customFinish || getProductActiveFinish(product);
    const key = `${product.id}__${finish.id}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.key === key);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { key, productId: product.id, finishId: finish.id, quantity }];
    });

    setCheckoutStep('bag');
    showToast('Savatga qo‘shildi', `${product.name} (${finish.name})`);
  };

  const updateCartQuantity = (key, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item.key === key ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const cleaned = promoInput.trim().toUpperCase();
    if (!cleaned) return;
    if (cleaned === 'NOTI10' || cleaned === 'MEBEL10') {
      setAppliedPromo({ code: cleaned, rate: 0.1 });
      showToast('Promokod faollashtirildi', `${cleaned} — 10% chegirma qo‘llanildi`);
    } else {
      showToast('Promokod topilmadi', 'Sinov uchun NOTI10 kodidan foydalaning');
    }
  };

  const openQuickView = (product) => {
    setQuickViewProduct(product);
    setQuickViewImageIdx(0);
    setQuickViewQty(1);
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!checkoutForm.fullName.trim() || checkoutForm.fullName.trim().length < 3) {
      errors.fullName = 'Ism va familiyangizni to‘liq kiriting';
    }
    const digits = checkoutForm.phone.replace(/\D/g, '');
    if (digits.length < 12) {
      errors.phone = 'Telefon raqamini to‘liq kiriting (+998 XX XXX-XX-XX)';
    }
    if (!checkoutForm.address.trim()) {
      errors.address = 'Yetkazib berish manzilini kiriting';
    }

    if (Object.keys(errors).length > 0) {
      setCheckoutErrors(errors);
      return;
    }

    setCheckoutErrors({});
    const generatedCode = `NM-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generatedCode);
    setCheckoutStep('confirmed');
    setCart([]);
    setAppliedPromo(null);
  };

  const handleBespokeSubmit = (e) => {
    e.preventDefault();
    const digits = bespokeForm.clientPhone.replace(/\D/g, '');
    if (!bespokeForm.clientName.trim() || digits.length < 12) {
      setBespokeError('Iltimos, ismingiz va amaldagi telefon raqamingizni (+998...) kiriting.');
      return;
    }
    setBespokeError('');
    setBespokeSubmitted(true);
    showToast('Ariza qabul qilindi', 'Arxitektor-konsultant 30 daqiqa ichida bog‘lanadi');
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setNewsletterDone(true);
    setNewsletterEmail('');
    showToast('Obuna tasdiqlandi', 'Yangi kolleksiya katalogi elektron pochtangizga yuboriladi');
  };

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const activeMaterial = MATERIALS_DATA.find((m) => m.id === activeMaterialId) || MATERIALS_DATA[0];
  const activeScene = LOOKBOOK_SCENES[activeSceneIndex] || LOOKBOOK_SCENES[0];
  const activePin = activeScene.pins.find((p) => p.id === activePinId) || activeScene.pins[0];
  const activeHeroProduct = heroProducts[heroShowcaseIndex];

  /* ========================================================================
     5. RENDER UI
     ======================================================================== */
  return (
    <div className="nm-app">
      {/* TOP UTILITY & ARCHITECTURAL BAR */}
      <div className="nm-utility-bar">
        <div className="nm-container nm-utility-inner">
          <div className="nm-utility-left">
            <span className="nm-utility-dot" aria-hidden="true" />
            <span>Toshkent bo‘ylab 10 mln so‘mdan yuqori buyurtmalarga yetkazish va yig‘ish bepul</span>
          </div>
          <div className="nm-utility-right">
            <span className="nm-utility-promo">
              Promokod: <strong>NOTI10</strong> (−10%)
            </span>
            <span className="nm-utility-sep" aria-hidden="true">|</span>
            <a href="tel:+998712004488" className="nm-utility-phone">
              <Icons.Phone />
              <span>+998 71 200-44-88</span>
            </a>
          </div>
        </div>
      </div>

      {/* STICKY ARCHITECTURAL HEADER */}
      <header className="nm-header">
        <div className="nm-container nm-header-inner">
          <a
            href="#top"
            className="nm-brand"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Icons.LogoMark />
            <div className="nm-brand-text">
              <span className="nm-brand-name">notiMebel</span>
              <span className="nm-brand-sub">INTERYER &amp; ARXITEKTURA</span>
            </div>
          </a>

          <nav className="nm-nav" aria-label="Asosiy navigatsiya">
            <button type="button" className="nm-nav-link" onClick={() => scrollToSection('catalog')}>
              Katalog
            </button>
            <button type="button" className="nm-nav-link" onClick={() => scrollToSection('lookbook')}>
              Interyerda ko‘ring
            </button>
            <button type="button" className="nm-nav-link" onClick={() => scrollToSection('materials')}>
              Materiallar
            </button>
            <button type="button" className="nm-nav-link" onClick={() => scrollToSection('bespoke')}>
              Buyurtma asosida
            </button>
            <button type="button" className="nm-nav-link" onClick={() => scrollToSection('showrooms')}>
              Shourumlar
            </button>
          </nav>

          <div className="nm-header-actions">
            <button
              type="button"
              className={`nm-icon-btn ${searchOpen ? 'is-active' : ''}`}
              aria-label="Katalogdan qidirish"
              onClick={() => setSearchOpen((prev) => !prev)}
            >
              <Icons.Search />
            </button>

            <button
              type="button"
              className="nm-icon-btn"
              aria-label={theme === 'daylight' ? 'Tungi ko‘rinishga o‘tish' : 'Kunduzgi ko‘rinishga o‘tish'}
              title={theme === 'daylight' ? 'Tungi shourum rejimi' : 'Kunduzgi shourum rejimi'}
              onClick={() => setTheme((prev) => (prev === 'daylight' ? 'evening' : 'daylight'))}
            >
              {theme === 'daylight' ? <Icons.Moon /> : <Icons.Sun />}
            </button>

            <button
              type="button"
              className="nm-icon-btn nm-badge-btn"
              aria-label="Sevimlilar ro‘yxati"
              onClick={() => setWishlistOpen(true)}
            >
              <Icons.Heart filled={wishlist.length > 0} />
              {wishlist.length > 0 && <span className="nm-count-badge">{wishlist.length}</span>}
            </button>

            <button
              type="button"
              className="nm-cart-trigger"
              aria-label="Xarid savati"
              onClick={() => setCartOpen(true)}
            >
              <Icons.Bag />
              <span className="nm-cart-label">Savat</span>
              <span className="nm-cart-pill">{cartCount}</span>
            </button>

            <button
              type="button"
              className="nm-icon-btn nm-mobile-toggle"
              aria-label="Menyuni ochish"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Icons.Menu />
            </button>
          </div>
        </div>

        {/* EXPANDABLE LIVE SEARCH BAR */}
        {searchOpen && (
          <div className="nm-search-drawer">
            <div className="nm-container nm-search-inner">
              <Icons.Search />
              <input
                ref={searchInputRef}
                type="text"
                className="nm-search-input"
                placeholder="Mahsulot nomi, artikul (NM-SF-104), eman, travertin yoki bukle..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  const catalogEl = document.getElementById('catalog');
                  if (catalogEl && window.scrollY < catalogEl.offsetTop - 200) {
                    catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="nm-text-clear"
                  onClick={() => setSearchQuery('')}
                >
                  Tozalash
                </button>
              )}
              <button
                type="button"
                className="nm-icon-btn"
                aria-label="Qidiruvni yopish"
                onClick={() => setSearchOpen(false)}
              >
                <Icons.Close />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ====================================================================
          HERO SECTION — ASYMMETRIC ARCHITECTURAL GALLERY
         ==================================================================== */}
      <main id="top">
        <section className="nm-hero">
          <div className="nm-container nm-hero-grid">
            <div className="nm-hero-content">
              <div className="nm-eyebrow">
                <span>TOSHKENT • KOLLEKSIYA 2026</span>
                <span className="nm-eyebrow-line" aria-hidden="true" />
              </div>

              <h1 className="nm-hero-title">
                Vaqt sinovidan o‘tadigan <em>arxitektura</em> mebellari.
              </h1>

              <p className="nm-hero-lead">
                <strong>notiMebel</strong> — tabiiy massiv eman, Amerika yong‘og‘i, g‘ovakli travertin va Italiya
                to‘qimachilik matolaridan yaratilgan mualliflik mebel studiyasi. Ortiqcha bezaksiz, sof mutanosiblik
                va kundalik qulaylik.
              </p>

              <div className="nm-hero-cta-group">
                <button
                  type="button"
                  className="nm-btn nm-btn-primary"
                  onClick={() => scrollToSection('catalog')}
                >
                  <span>Kolleksiyani ko‘rish</span>
                  <Icons.ArrowRight />
                </button>
                <button
                  type="button"
                  className="nm-btn nm-btn-secondary"
                  onClick={() => scrollToSection('bespoke')}
                >
                  <span>Individual buyurtma</span>
                </button>
              </div>

              <div className="nm-hero-metrics">
                <div className="nm-metric-item">
                  <span className="nm-metric-num">100%</span>
                  <span className="nm-metric-label">Kamera quritilgan tabiiy yog‘och</span>
                </div>
                <div className="nm-metric-item">
                  <span className="nm-metric-num">5–7 yil</span>
                  <span className="nm-metric-label">Karkas va mexanizmlarga kafolat</span>
                </div>
                <div className="nm-metric-item">
                  <span className="nm-metric-num">0%</span>
                  <span className="nm-metric-label">12 oygacha muddatli to‘lov</span>
                </div>
              </div>
            </div>

            <div className="nm-hero-visual">
              <div className="nm-hero-frame">
                <img
                  src={activeHeroProduct.image}
                  alt={activeHeroProduct.name}
                  className="nm-hero-img"
                />
                <div className="nm-hero-frame-tag">
                  <span>{activeHeroProduct.collection}</span>
                  <span>{activeHeroProduct.sku}</span>
                </div>
              </div>

              {/* INTERACTIVE HERO FEATURED ITEM CARD */}
              <div className="nm-hero-spec-card">
                <div className="nm-hero-spec-top">
                  <div>
                    <span className="nm-spec-kicker">Tanlangan eksponat</span>
                    <h2 className="nm-spec-title">{activeHeroProduct.name}</h2>
                  </div>
                  <div className="nm-hero-switcher" role="tablist" aria-label="Bosh sahifa eksponatlari">
                    {heroProducts.map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={heroShowcaseIndex === idx}
                        className={`nm-switcher-dot ${heroShowcaseIndex === idx ? 'is-active' : ''}`}
                        onClick={() => setHeroShowcaseIndex(idx)}
                      >
                        0{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="nm-hero-spec-meta">
                  <span>O‘lcham: {activeHeroProduct.dimensions}</span>
                  <strong>{formatPriceUZS(activeHeroProduct.basePrice)}</strong>
                </div>

                <div className="nm-hero-spec-actions">
                  <button
                    type="button"
                    className="nm-link-arrow"
                    onClick={() => openQuickView(activeHeroProduct)}
                  >
                    <span>Texnik xususiyatlar</span>
                    <Icons.ArrowUpRight />
                  </button>
                  <button
                    type="button"
                    className="nm-btn nm-btn-sm nm-btn-primary"
                    onClick={() => addToCart(activeHeroProduct)}
                  >
                    Savatga qo‘shish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STUDIO STANDARDS BAR */}
        <section className="nm-standards" aria-label="Sifat kafolatlari">
          <div className="nm-container nm-standards-grid">
            <div className="nm-standard-cell">
              <div className="nm-standard-icon">
                <Icons.Ruler />
              </div>
              <div>
                <h3>Aniq arxitektura o‘lchamlari</h3>
                <p>Xonangiz chizmasiga mos individual kenglik va balandlikda ishlab chiqarish.</p>
              </div>
            </div>

            <div className="nm-standard-cell">
              <div className="nm-standard-icon">
                <Icons.Shield />
              </div>
              <div>
                <h3>Sertifikatlangan xomashyo</h3>
                <p>FSC tabiiy yog‘och, OEKO-TEX Italiya matolari va Avstriya Blum furniturasi.</p>
              </div>
            </div>

            <div className="nm-standard-cell">
              <div className="nm-standard-icon">
                <Icons.Truck />
              </div>
              <div>
                <h3>Oq qo‘lqop yetkazish xizmati</h3>
                <p>Toshkent bo‘ylab ehtiyotkorlik bilan olib kirish, yig‘ish va qadoqlarni olib ketish.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            CATALOG SECTION — FILTERABLE, SWATCH-INTERACTIVE PRODUCT GRID
           ================================================================== */}
        <section id="catalog" className="nm-section nm-catalog-section">
          <div className="nm-container">
            <div className="nm-section-header">
              <div>
                <span className="nm-eyebrow-simple">01 / DOIMIY KOLLEKSIYA</span>
                <h2 className="nm-section-title">Interyer uchun mualliflik mebellari</h2>
              </div>
              <p className="nm-section-desc">
                Har bir model ustidagi rang tugmachalarini bosish orqali tabiiy yog‘och yoki mato turini tanlang —
                narx va artikul avtomatik yangilanadi.
              </p>
            </div>

            {/* CATEGORY TABS & FILTER TOOLBAR */}
            <div className="nm-filter-bar">
              <div className="nm-category-tabs" role="tablist" aria-label="Mebel toifalari">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === cat.id}
                    className={`nm-cat-tab ${activeCategory === cat.id ? 'is-active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="nm-filter-controls">
                <label className="nm-checkbox-control">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                  />
                  <span>Omborda tayyor</span>
                </label>

                <select
                  aria-label="Narx oralig‘i"
                  className="nm-select"
                  value={priceBracket}
                  onChange={(e) => setPriceBracket(e.target.value)}
                >
                  <option value="all">Barcha narxlar</option>
                  <option value="under-8m">8 mln so‘mgacha</option>
                  <option value="8m-15m">8 – 15 mln so‘m</option>
                  <option value="over-15m">15 mln so‘mdan yuqori</option>
                </select>

                <select
                  aria-label="Saralash tartibi"
                  className="nm-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Tavsiya etilgan</option>
                  <option value="price-asc">Narx: arzondan qimmatga</option>
                  <option value="price-desc">Narx: qimmatdan arzonga</option>
                  <option value="rating">Mijozlar bahosi bo‘yicha</option>
                </select>
              </div>
            </div>

            {/* ACTIVE SEARCH / FILTER SUMMARY */}
            <div className="nm-catalog-status">
              <span>
                Ko‘rsatilmoqda: <strong>{filteredProducts.length}</strong> ta model
                {searchQuery ? ` («${searchQuery}» bo‘yicha)` : ''}
              </span>
              {(activeCategory !== 'all' || onlyInStock || priceBracket !== 'all' || searchQuery) && (
                <button
                  type="button"
                  className="nm-reset-filters"
                  onClick={() => {
                    setActiveCategory('all');
                    setOnlyInStock(false);
                    setPriceBracket('all');
                    setSearchQuery('');
                    setSortBy('featured');
                  }}
                >
                  Filtrlarni bekor qilish
                </button>
              )}
            </div>

            {/* PRODUCT GRID */}
            {filteredProducts.length === 0 ? (
              <div className="nm-empty-state">
                <h3>So‘rovingiz bo‘yicha mahsulot topilmadi</h3>
                <p>Boshqa toifani tanlang yoki qidiruv so‘zini o‘zgartirib ko‘ring.</p>
                <button
                  type="button"
                  className="nm-btn nm-btn-primary"
                  onClick={() => {
                    setActiveCategory('all');
                    setOnlyInStock(false);
                    setPriceBracket('all');
                    setSearchQuery('');
                  }}
                >
                  Barcha mebellarni ko‘rsatish
                </button>
              </div>
            ) : (
              <div className="nm-product-grid">
                {filteredProducts.map((product) => {
                  const activeFinish = getProductActiveFinish(product);
                  const currentPrice = getProductEffectivePrice(product);
                  const isSaved = wishlist.includes(product.id);

                  return (
                    <article key={product.id} className="nm-card">
                      <div className="nm-card-media">
                        <img
                          src={product.image}
                          alt={`${product.name} — ${activeFinish.name}`}
                          className="nm-card-img"
                          loading="lazy"
                          onClick={() => openQuickView(product)}
                        />

                        <div className="nm-card-top-badges">
                          {product.badge && <span className="nm-badge">{product.badge}</span>}
                          <span className={`nm-stock-tag ${product.inStock ? 'is-ready' : 'is-order'}`}>
                            {product.inStock ? 'Tayyor' : 'Buyurtmaga'}
                          </span>
                        </div>

                        <div className="nm-card-floating-actions">
                          <button
                            type="button"
                            className={`nm-circle-action ${isSaved ? 'is-saved' : ''}`}
                            aria-label="Sevimlilarga qo‘shish"
                            onClick={() => toggleWishlist(product.id)}
                          >
                            <Icons.Heart filled={isSaved} />
                          </button>
                          <button
                            type="button"
                            className="nm-circle-action"
                            aria-label="Tezkor ko‘rish"
                            onClick={() => openQuickView(product)}
                          >
                            <Icons.Eye />
                          </button>
                        </div>
                      </div>

                      <div className="nm-card-body">
                        <div className="nm-card-meta-row">
                          <span className="nm-card-cat">{product.categoryLabel}</span>
                          <span className="nm-card-sku">
                            {product.sku}-{activeFinish.code}
                          </span>
                        </div>

                        <h3 className="nm-card-title">
                          <button type="button" onClick={() => openQuickView(product)}>
                            {product.name}
                          </button>
                        </h3>

                        <p className="nm-card-dims">{product.dimensions}</p>

                        {/* INTERACTIVE MATERIAL SWATCHES */}
                        <div className="nm-swatches-block">
                          <div className="nm-swatches-row" role="radiogroup" aria-label={`${product.name} materiallari`}>
                            {product.finishes.map((finish, idx) => {
                              const selected = (selectedFinishes[product.id] ?? 0) === idx;
                              return (
                                <button
                                  key={finish.id}
                                  type="button"
                                  role="radio"
                                  aria-checked={selected}
                                  aria-label={finish.name}
                                  title={finish.name}
                                  className={`nm-swatch-btn ${selected ? 'is-selected' : ''}`}
                                  onClick={() => handleSelectFinish(product.id, idx)}
                                >
                                  <span
                                    className="nm-swatch-color"
                                    style={{ backgroundColor: finish.hex }}
                                  />
                                </button>
                              );
                            })}
                          </div>
                          <span className="nm-swatch-name">{activeFinish.name}</span>
                        </div>

                        <div className="nm-card-footer">
                          <div className="nm-price-block">
                            {product.oldPrice && (
                              <span className="nm-old-price">{formatPriceUZS(product.oldPrice)}</span>
                            )}
                            <span className="nm-current-price">{formatPriceUZS(currentPrice)}</span>
                          </div>

                          <button
                            type="button"
                            className="nm-btn nm-btn-sm nm-btn-outline"
                            onClick={() => addToCart(product)}
                          >
                            <Icons.Plus />
                            <span>Savatga</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ==================================================================
            INTERACTIVE SHOP-THE-ROOM LOOKBOOK SECTION
           ================================================================== */}
        <section id="lookbook" className="nm-section nm-lookbook-section">
          <div className="nm-container">
            <div className="nm-section-header">
              <div>
                <span className="nm-eyebrow-simple">02 / TAYYOR INTERYER YECHIMLARI</span>
                <h2 className="nm-section-title">Interyerda ko‘ring va tanlang</h2>
              </div>

              <div className="nm-scene-switcher" role="tablist" aria-label="Interyer sahnalari">
                {LOOKBOOK_SCENES.map((scene, idx) => (
                  <button
                    key={scene.id}
                    type="button"
                    role="tab"
                    aria-selected={activeSceneIndex === idx}
                    className={`nm-scene-tab ${activeSceneIndex === idx ? 'is-active' : ''}`}
                    onClick={() => {
                      setActiveSceneIndex(idx);
                      setActivePinId(LOOKBOOK_SCENES[idx].pins[0].id);
                    }}
                  >
                    {scene.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="nm-lookbook-layout">
              {/* LEFT: INTERACTIVE PINNED PHOTOGRAPH */}
              <div className="nm-lookbook-stage">
                <img src={activeScene.image} alt={activeScene.title} className="nm-lookbook-img" />
                <div className="nm-lookbook-caption">
                  <strong>{activeScene.title}</strong>
                  <span>{activeScene.subtitle}</span>
                </div>

                {activeScene.pins.map((pin) => {
                  const isSelected = activePin.id === pin.id;
                  return (
                    <button
                      key={pin.id}
                      type="button"
                      className={`nm-hotspot-pin ${isSelected ? 'is-active' : ''}`}
                      style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                      aria-label={`Eksponat ${pin.number}: ${pin.note}`}
                      onClick={() => setActivePinId(pin.id)}
                    >
                      <span>{pin.number}</span>
                    </button>
                  );
                })}
              </div>

              {/* RIGHT: INTERACTIVE ITEM LIST FOR THIS ROOM */}
              <div className="nm-lookbook-sidebar">
                <div className="nm-lookbook-sidebar-head">
                  <span className="nm-spec-kicker">Ushbu interyerdagi mebellar</span>
                  <p>Raqamli nuqtani bosing yoki ro‘yxatdan bevosita savatga qo‘shing.</p>
                </div>

                <div className="nm-lookbook-items">
                  {activeScene.pins.map((pin) => {
                    const product = PRODUCTS_DATA.find((p) => p.id === pin.productId);
                    if (!product) return null;
                    const isFocused = activePin.id === pin.id;

                    return (
                      <div
                        key={pin.id}
                        className={`nm-lookbook-item ${isFocused ? 'is-focused' : ''}`}
                        onClick={() => setActivePinId(pin.id)}
                      >
                        <div className="nm-lookbook-num">{pin.number}</div>
                        <img src={product.image} alt={product.name} className="nm-lookbook-thumb" />
                        <div className="nm-lookbook-info">
                          <h4>{product.name}</h4>
                          <p>{pin.note}</p>
                          <div className="nm-lookbook-price-row">
                            <strong>{formatPriceUZS(product.basePrice)}</strong>
                            <button
                              type="button"
                              className="nm-link-arrow"
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product);
                              }}
                            >
                              <span>Savatga</span>
                              <Icons.Plus />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            MATERIAL & CRAFTSMANSHIP LIBRARY
           ================================================================== */}
        <section id="materials" className="nm-section nm-materials-section">
          <div className="nm-container">
            <div className="nm-section-header">
              <div>
                <span className="nm-eyebrow-simple">03 / XOMASHYO VA HUNARMANDCHILIK</span>
                <h2 className="nm-section-title">Tabiiy materiallar kutubxonasi</h2>
              </div>
              <p className="nm-section-desc">
                Biz sun’iy DSP va arzon sintetik qoplamalardan voz kechganmiz. Har bir detal qo‘lga tekkanda tabiiy
                harorat va haqiqiy teksturani beradi.
              </p>
            </div>

            <div className="nm-materials-layout">
              <div className="nm-material-selector" role="tablist" aria-label="Materiallar ro‘yxati">
                {MATERIALS_DATA.map((mat, index) => {
                  const active = mat.id === activeMaterial.id;
                  return (
                    <button
                      key={mat.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      className={`nm-material-tab ${active ? 'is-active' : ''}`}
                      onClick={() => setActiveMaterialId(mat.id)}
                    >
                      <span className="nm-material-index">0{index + 1}</span>
                      <span
                        className="nm-material-sample-dot"
                        style={{ backgroundColor: mat.hex }}
                        aria-hidden="true"
                      />
                      <div className="nm-material-tab-text">
                        <strong>{mat.name}</strong>
                        <span>{mat.origin}</span>
                      </div>
                      <Icons.ArrowRight />
                    </button>
                  );
                })}
              </div>

              <div className="nm-material-detail-card">
                <div className="nm-material-detail-top">
                  <div
                    className="nm-material-swatch-large"
                    style={{ backgroundColor: activeMaterial.hex }}
                    aria-hidden="true"
                  />
                  <div>
                    <span className="nm-spec-kicker">{activeMaterial.origin}</span>
                    <h3>{activeMaterial.name}</h3>
                  </div>
                </div>

                <p className="nm-material-summary">{activeMaterial.summary}</p>

                <div className="nm-material-specs-grid">
                  <div className="nm-material-spec-box">
                    <span>{activeMaterial.metricLabel}</span>
                    <strong>{activeMaterial.metricValue}</strong>
                  </div>
                  <div className="nm-material-spec-box">
                    <span>Parvarish tavsiyasi</span>
                    <strong>{activeMaterial.care}</strong>
                  </div>
                </div>

                <div className="nm-material-detail-footer">
                  <button
                    type="button"
                    className="nm-btn nm-btn-secondary"
                    onClick={() => {
                      const keyword = activeMaterial.name.split(' ').pop();
                      setSearchQuery(keyword || '');
                      scrollToSection('catalog');
                    }}
                  >
                    <span>Ushbu materialdagi modellarni ko‘rish</span>
                    <Icons.ArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            CUSTOM BESPOKE ORDER & ARCHITECT CONSULTATION
           ================================================================== */}
        <section id="bespoke" className="nm-section nm-bespoke-section">
          <div className="nm-container nm-bespoke-grid">
            <div className="nm-bespoke-info">
              <span className="nm-eyebrow-simple">04 / INDIVIDUAL LOYIHALASH</span>
              <h2 className="nm-section-title">Xonadoningiz o‘lchamiga mos buyurtma</h2>
              <p className="nm-bespoke-lead">
                Tayyor modellar o‘lchami xonangizga to‘g‘ri kelmayaptimi yoki arxitektoringiz chizmasi asosida
                mebel yasattirmoqchimisiz? <strong>notiMebel</strong> muhandislik byurosi 48 soat ichida 3D
                vizualizatsiya va aniq smeta tayyorlab beradi.
              </p>

              <ol className="nm-process-steps">
                <li>
                  <span className="nm-step-num">01</span>
                  <div>
                    <strong>O‘lcham va material tanlovi</strong>
                    <p>Shourumda yoki uyingizda 240+ mato va tabiiy yog‘och namunalarini tanlaysiz.</p>
                  </div>
                </li>
                <li>
                  <span className="nm-step-num">02</span>
                  <div>
                    <strong>Muhandislik chizmasi va smeta</strong>
                    <p>Aniq o‘lchamlar, furnitura spetsifikatsiyasi va yakuniy narx shartnomada qayd etiladi.</p>
                  </div>
                </li>
                <li>
                  <span className="nm-step-num">03</span>
                  <div>
                    <strong>14–21 ish kunida ishlab chiqarish</strong>
                    <p>Har bir bosqich foto-hisobot orqali yuboriladi va tayyor mebel o‘rnatib beriladi.</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="nm-bespoke-form-box">
              {bespokeSubmitted ? (
                <div className="nm-bespoke-success">
                  <div className="nm-success-check">
                    <Icons.Check />
                  </div>
                  <h3>Loyiha so‘rovingiz qabul qilindi</h3>
                  <p>
                    Hurmatli <strong>{bespokeForm.clientName}</strong>, shaxsiy interyer-arxitektoringiz{' '}
                    <strong>{bespokeForm.clientPhone}</strong> raqamiga 30 daqiqa ichida bog‘lanib, uchrashuv
                    vaqtini tasdiqlaydi.
                  </p>
                  <div className="nm-ticket-summary">
                    <div>
                      <span>Yo‘nalish:</span>
                      <strong>{bespokeForm.roomType}</strong>
                    </div>
                    <div>
                      <span>Material:</span>
                      <strong>{bespokeForm.preferredMaterial}</strong>
                    </div>
                    <div>
                      <span>Uchrashuv:</span>
                      <strong>{bespokeForm.visitType}</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="nm-btn nm-btn-secondary"
                    onClick={() => {
                      setBespokeSubmitted(false);
                      setBespokeForm((prev) => ({ ...prev, notes: '' }));
                    }}
                  >
                    Yangi so‘rov yuborish
                  </button>
                </div>
              ) : (
                <form className="nm-form" onSubmit={handleBespokeSubmit} noValidate>
                  <div className="nm-form-header">
                    <h3>Arxitektor konsultatsiyasiga yozilish</h3>
                    <p>Bepul o‘lcham olish va namunalar katalogi bilan tanishish</p>
                  </div>

                  <div className="nm-form-row">
                    <label className="nm-field">
                      <span>Xona yoki loyiha turi</span>
                      <select
                        value={bespokeForm.roomType}
                        onChange={(e) => setBespokeForm({ ...bespokeForm, roomType: e.target.value })}
                      >
                        <option>Mehmonxona to‘plami</option>
                        <option>Yotoqxona va garderob</option>
                        <option>Ovqatlanish stoli va stullar</option>
                        <option>Ish kabineti</option>
                        <option>To‘liq xonadon / Penthaus loyihasi</option>
                      </select>
                    </label>

                    <label className="nm-field">
                      <span>Asosiy material</span>
                      <select
                        value={bespokeForm.preferredMaterial}
                        onChange={(e) => setBespokeForm({ ...bespokeForm, preferredMaterial: e.target.value })}
                      >
                        <option>Shimoliy Massiv Eman</option>
                        <option>Amerika Yong‘og‘i</option>
                        <option>Italiya Bukle va Zig‘ir</option>
                        <option>Tabiiy Travertin toshi</option>
                        <option>Arxitektor tavsiyasi asosida</option>
                      </select>
                    </label>
                  </div>

                  <div className="nm-form-row">
                    <label className="nm-field">
                      <span>Mo‘ljallangan byudjet</span>
                      <select
                        value={bespokeForm.budget}
                        onChange={(e) => setBespokeForm({ ...bespokeForm, budget: e.target.value })}
                      >
                        <option>10 – 15 mln so‘m</option>
                        <option>15 – 30 mln so‘m</option>
                        <option>30 – 60 mln so‘m</option>
                        <option>60 mln so‘mdan yuqori</option>
                      </select>
                    </label>

                    <label className="nm-field">
                      <span>Uchrashuv formati</span>
                      <select
                        value={bespokeForm.visitType}
                        onChange={(e) => setBespokeForm({ ...bespokeForm, visitType: e.target.value })}
                      >
                        <option>Shourumga tashrif (Mirobod)</option>
                        <option>Shourumga tashrif (Yunusobod)</option>
                        <option>Dizaynerning uyga tashrifi (Toshkent)</option>
                        <option>Onlayn video-konsultatsiya</option>
                      </select>
                    </label>
                  </div>

                  <div className="nm-form-row">
                    <label className="nm-field">
                      <span>Ismingiz *</span>
                      <input
                        type="text"
                        placeholder="Masalan: Sardor Karimov"
                        value={bespokeForm.clientName}
                        onChange={(e) => setBespokeForm({ ...bespokeForm, clientName: e.target.value })}
                        required
                      />
                    </label>

                    <label className="nm-field">
                      <span>Telefon raqamingiz *</span>
                      <input
                        type="tel"
                        placeholder="+998 90 123-45-67"
                        value={bespokeForm.clientPhone}
                        onChange={(e) => setBespokeForm({ ...bespokeForm, clientPhone: e.target.value })}
                        required
                      />
                    </label>
                  </div>

                  <label className="nm-field">
                    <span>Qo‘shimcha izoh yoki o‘lchamlar (ixtiyoriy)</span>
                    <textarea
                      rows="3"
                      placeholder="Xona maydoni, kerakli mebel o‘lchamlari yoki topshirish muddati..."
                      value={bespokeForm.notes}
                      onChange={(e) => setBespokeForm({ ...bespokeForm, notes: e.target.value })}
                    />
                  </label>

                  {bespokeError && <p className="nm-form-error">{bespokeError}</p>}

                  <button type="submit" className="nm-btn nm-btn-primary nm-btn-full">
                    <span>Konsultatsiyaga yozilish</span>
                    <Icons.ArrowRight />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ==================================================================
            SHOWROOMS & FAQ ACCORDION
           ================================================================== */}
        <section id="showrooms" className="nm-section nm-showrooms-section">
          <div className="nm-container nm-showrooms-layout">
            {/* LEFT: TASHKENT SHOWROOMS */}
            <div>
              <span className="nm-eyebrow-simple">05 / OFFLINE EKSPOZITSIYA</span>
              <h2 className="nm-section-title">Toshkentdagi shourumlarimiz</h2>
              <p className="nm-section-desc">
                Divan yumshoqligini shaxsan sinab ko‘rish, tabiiy eman va Italiya matolarini yorug‘likda solishtirish
                uchun tashrif buyuring.
              </p>

              <div className="nm-showroom-cards">
                {SHOWROOMS_DATA.map((room) => (
                  <div key={room.id} className="nm-showroom-card">
                    <div className="nm-showroom-top">
                      <Icons.MapPin />
                      <h3>{room.district}</h3>
                    </div>
                    <p className="nm-showroom-addr">{room.address}</p>
                    <div className="nm-showroom-meta">
                      <span>{room.hours}</span>
                      <span>{room.area}</span>
                    </div>
                    <div className="nm-showroom-bottom">
                      <a href={`tel:${room.phone.replace(/\s+/g, '')}`} className="nm-showroom-phone">
                        {room.phone}
                      </a>
                      <button
                        type="button"
                        className="nm-link-arrow"
                        onClick={() => {
                          setBespokeForm((prev) => ({
                            ...prev,
                            visitType:
                              room.id === 'mirabad'
                                ? 'Shourumga tashrif (Mirobod)'
                                : 'Shourumga tashrif (Yunusobod)',
                          }));
                          scrollToSection('bespoke');
                        }}
                      >
                        <span>Uchrashuv belgilash</span>
                        <Icons.ArrowUpRight />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: FAQ ACCORDION */}
            <div className="nm-faq-column">
              <span className="nm-eyebrow-simple">KO‘P BERILADIGAN SAVOLLAR</span>
              <h2 className="nm-section-title">Yetkazish, kafolat va to‘lov</h2>

              <div className="nm-accordion">
                {FAQ_DATA.map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={item.q} className={`nm-accordion-item ${isOpen ? 'is-open' : ''}`}>
                      <button
                        type="button"
                        className="nm-accordion-trigger"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                      >
                        <span>{item.q}</span>
                        <span className="nm-accordion-icon">
                          <Icons.ChevronDown />
                        </span>
                      </button>
                      {isOpen && (
                        <div className="nm-accordion-panel">
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ====================================================================
          ARCHITECTURAL FOOTER
         ==================================================================== */}
      <footer className="nm-footer">
        <div className="nm-container">
          <div className="nm-footer-top">
            <div className="nm-footer-brand">
              <div className="nm-brand">
                <Icons.LogoMark />
                <div className="nm-brand-text">
                  <span className="nm-brand-name">notiMebel</span>
                  <span className="nm-brand-sub">INTERYER &amp; ARXITEKTURA</span>
                </div>
              </div>
              <p className="nm-footer-about">
                2014-yildan buyon Toshkentda zamonaviy turar-joy va tijorat interyerlari uchun tabiiy yog‘och hamda
                yuqori sifatli to‘qimachilik mebellarini loyihalaymiz va ishlab chiqaramiz.
              </p>
            </div>

            <div className="nm-footer-links">
              <div>
                <h4>Kolleksiya</h4>
                <ul>
                  <li>
                    <button type="button" onClick={() => { setActiveCategory('living'); scrollToSection('catalog'); }}>
                      Mehmonxona divanlari
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => { setActiveCategory('dining'); scrollToSection('catalog'); }}>
                      Ovqatlanish stollari
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => { setActiveCategory('bedroom'); scrollToSection('catalog'); }}>
                      Yotoqxona mebellari
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => { setActiveCategory('office'); scrollToSection('catalog'); }}>
                      Ish kabineti
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4>Kompaniya</h4>
                <ul>
                  <li>
                    <button type="button" onClick={() => scrollToSection('materials')}>
                      Materiallar va sifat
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => scrollToSection('bespoke')}>
                      Arxitektorlar uchun hamkorlik
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => scrollToSection('showrooms')}>
                      Toshkent shourumlari
                    </button>
                  </li>
                  <li>
                    <a href="tel:+998712004488">+998 71 200-44-88</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="nm-footer-newsletter">
              <h4>Arxitektura katalogi (PDF)</h4>
              <p>Yangi kolleksiya narxnomasi va 3D modellar to‘plamini elektron pochtangizga oling.</p>
              {newsletterDone ? (
                <div className="nm-newsletter-ok">
                  <Icons.Check />
                  <span>Katalog muvaffaqiyatli yuborildi.</span>
                </div>
              ) : (
                <form className="nm-newsletter-form" onSubmit={handleNewsletterSubmit}>
                  <input
                    type="email"
                    placeholder="Elektron pochta manzilingiz"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="nm-btn nm-btn-primary">
                    Yuborish
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="nm-footer-bottom">
            <span>© {new Date().getFullYear()} notiMebel MChJ. Barcha huquqlar himoyalangan. Toshkent, O‘zbekiston.</span>
            <div className="nm-payment-methods">
              <span>Uzcard</span>
              <span>Humo</span>
              <span>Payme</span>
              <span>Click</span>
              <span>0% Muddatli to‘lov</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ====================================================================
          PRODUCT QUICK-VIEW MODAL
         ==================================================================== */}
      {quickViewProduct && (
        <div
          className="nm-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={quickViewProduct.name}
          onClick={() => setQuickViewProduct(null)}
        >
          <div className="nm-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="nm-modal-close"
              aria-label="Oynani yopish"
              onClick={() => setQuickViewProduct(null)}
            >
              <Icons.Close />
            </button>

            <div className="nm-modal-grid">
              <div className="nm-modal-gallery">
                <img
                  src={
                    quickViewImageIdx === 0
                      ? quickViewProduct.image
                      : quickViewProduct.secondaryImage || quickViewProduct.image
                  }
                  alt={quickViewProduct.name}
                  className="nm-modal-main-img"
                />
                <div className="nm-modal-thumbs">
                  <button
                    type="button"
                    className={`nm-modal-thumb ${quickViewImageIdx === 0 ? 'is-active' : ''}`}
                    onClick={() => setQuickViewImageIdx(0)}
                  >
                    <img src={quickViewProduct.image} alt="Asosiy ko‘rinish" />
                  </button>
                  {quickViewProduct.secondaryImage && (
                    <button
                      type="button"
                      className={`nm-modal-thumb ${quickViewImageIdx === 1 ? 'is-active' : ''}`}
                      onClick={() => setQuickViewImageIdx(1)}
                    >
                      <img src={quickViewProduct.secondaryImage} alt="Interyerdagi ko‘rinish" />
                    </button>
                  )}
                </div>
              </div>

              <div className="nm-modal-details">
                <div className="nm-modal-top-meta">
                  <span>{quickViewProduct.collection}</span>
                  <span>
                    Artikul: {quickViewProduct.sku}-{getProductActiveFinish(quickViewProduct).code}
                  </span>
                </div>

                <h2 className="nm-modal-title">{quickViewProduct.name}</h2>

                <div className="nm-modal-rating">
                  <Icons.Star />
                  <strong>{quickViewProduct.rating}</strong>
                  <span>({quickViewProduct.reviewsCount} ta tasdiqlangan xaridor bahosi)</span>
                </div>

                <div className="nm-modal-price-row">
                  <strong className="nm-modal-price">
                    {formatPriceUZS(getProductEffectivePrice(quickViewProduct))}
                  </strong>
                  {quickViewProduct.oldPrice && (
                    <span className="nm-old-price">{formatPriceUZS(quickViewProduct.oldPrice)}</span>
                  )}
                </div>

                <p className="nm-modal-desc">{quickViewProduct.description}</p>

                {/* FINISH SELECTION */}
                <div className="nm-modal-finish-box">
                  <span className="nm-modal-label">
                    Material va rang: <strong>{getProductActiveFinish(quickViewProduct).name}</strong>
                  </span>
                  <div className="nm-modal-finish-list">
                    {quickViewProduct.finishes.map((finish, idx) => {
                      const active = (selectedFinishes[quickViewProduct.id] ?? 0) === idx;
                      return (
                        <button
                          key={finish.id}
                          type="button"
                          className={`nm-finish-pill ${active ? 'is-active' : ''}`}
                          onClick={() => handleSelectFinish(quickViewProduct.id, idx)}
                        >
                          <span className="nm-swatch-color" style={{ backgroundColor: finish.hex }} />
                          <span>{finish.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* TECHNICAL SPECIFICATIONS TABLE */}
                <div className="nm-spec-table">
                  <div className="nm-spec-row">
                    <span>O‘lchamlari</span>
                    <strong>{quickViewProduct.dimensions}</strong>
                  </div>
                  <div className="nm-spec-row">
                    <span>Karkas</span>
                    <strong>{quickViewProduct.specs.frame}</strong>
                  </div>
                  <div className="nm-spec-row">
                    <span>To‘ldiruvchi / Qoplama</span>
                    <strong>{quickViewProduct.specs.filling}</strong>
                  </div>
                  <div className="nm-spec-row">
                    <span>Tayyorlanish muddati</span>
                    <strong>{quickViewProduct.leadTime}</strong>
                  </div>
                  <div className="nm-spec-row">
                    <span>Kafolat</span>
                    <strong>{quickViewProduct.warranty}</strong>
                  </div>
                </div>

                {/* ADD TO CART CONTROLS */}
                <div className="nm-modal-actions">
                  <div className="nm-qty-stepper">
                    <button
                      type="button"
                      aria-label="Sonini kamaytirish"
                      onClick={() => setQuickViewQty((q) => Math.max(1, q - 1))}
                    >
                      <Icons.Minus />
                    </button>
                    <span>{quickViewQty}</span>
                    <button
                      type="button"
                      aria-label="Sonini oshirish"
                      onClick={() => setQuickViewQty((q) => q + 1)}
                    >
                      <Icons.Plus />
                    </button>
                  </div>

                  <button
                    type="button"
                    className="nm-btn nm-btn-primary nm-modal-add-btn"
                    onClick={() => {
                      addToCart(quickViewProduct, getProductActiveFinish(quickViewProduct), quickViewQty);
                      setQuickViewProduct(null);
                    }}
                  >
                    <span>Savatga qo‘shish</span>
                  </button>

                  <button
                    type="button"
                    className={`nm-icon-square-btn ${wishlist.includes(quickViewProduct.id) ? 'is-saved' : ''}`}
                    aria-label="Sevimlilarga saqlash"
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                  >
                    <Icons.Heart filled={wishlist.includes(quickViewProduct.id)} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SHOPPING CART & CHECKOUT SLIDE-OVER DRAWER
         ==================================================================== */}
      {cartOpen && (
        <div
          className="nm-overlay nm-drawer-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Xarid savati"
          onClick={() => setCartOpen(false)}
        >
          <aside className="nm-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="nm-drawer-header">
              <div>
                <h3>
                  {checkoutStep === 'bag' && `Xarid savati (${cartCount})`}
                  {checkoutStep === 'form' && 'Buyurtmani rasmiylashtirish'}
                  {checkoutStep === 'confirmed' && 'Buyurtma tasdiqlandi'}
                </h3>
                <span className="nm-drawer-sub">notiMebel Toshkent yetkazib berish xizmati</span>
              </div>
              <button
                type="button"
                className="nm-icon-btn"
                aria-label="Savatni yopish"
                onClick={() => setCartOpen(false)}
              >
                <Icons.Close />
              </button>
            </div>

            {checkoutStep === 'confirmed' ? (
              <div className="nm-drawer-confirmed">
                <div className="nm-success-check">
                  <Icons.Check />
                </div>
                <h4>Rahmat, {checkoutForm.fullName}!</h4>
                <p>
                  Buyurtmangiz <strong>#{orderNumber}</strong> raqami bilan ro‘yxatga olindi. Menejerimiz{' '}
                  <strong>{checkoutForm.phone}</strong> raqamiga qo‘ng‘iroq qilib, yetkazib berish vaqtini
                  kelishib oladi.
                </p>
                <div className="nm-ticket-summary">
                  <div>
                    <span>Hudud:</span>
                    <strong>Toshkent, {checkoutForm.district}</strong>
                  </div>
                  <div>
                    <span>Manzil:</span>
                    <strong>{checkoutForm.address}</strong>
                  </div>
                  <div>
                    <span>To‘lov turi:</span>
                    <strong>
                      {checkoutForm.paymentMethod === 'card' && 'Uzcard / Humo / Payme / Click'}
                      {checkoutForm.paymentMethod === 'cash' && 'Qabul qilganda naqd yoki terminal'}
                      {checkoutForm.paymentMethod === 'installment' && '0% Muddatli to‘lov (12 oy)'}
                    </strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="nm-btn nm-btn-primary nm-btn-full"
                  onClick={() => {
                    setCheckoutStep('bag');
                    setCartOpen(false);
                  }}
                >
                  Katalogga qaytish
                </button>
              </div>
            ) : detailedCartItems.length === 0 ? (
              <div className="nm-drawer-empty">
                <p>Hozircha savatingiz bo‘sh.</p>
                <span>Kolleksiyamizdan o‘zingizga yoqqan mebel va mato turini tanlang.</span>
                <button
                  type="button"
                  className="nm-btn nm-btn-primary"
                  onClick={() => {
                    setCartOpen(false);
                    scrollToSection('catalog');
                  }}
                >
                  Mebellarni ko‘rish
                </button>
              </div>
            ) : checkoutStep === 'bag' ? (
              <>
                <div className="nm-drawer-body">
                  {/* FREE DELIVERY PROGRESS */}
                  <div className="nm-delivery-banner">
                    {deliveryFee === 0 ? (
                      <span>Toshkent shahri ichida bepul yetkazib berish va yig‘ish faollashdi.</span>
                    ) : (
                      <span>
                        Bepul yetkazib berish uchun yana{' '}
                        <strong>{formatPriceUZS(10000000 - (cartSubtotal - promoDiscount))}</strong> qo‘shing.
                      </span>
                    )}
                  </div>

                  <div className="nm-cart-list">
                    {detailedCartItems.map((item) => (
                      <div key={item.key} className="nm-cart-item">
                        <img src={item.product.image} alt={item.product.name} className="nm-cart-thumb" />
                        <div className="nm-cart-item-info">
                          <div className="nm-cart-item-top">
                            <h4>{item.product.name}</h4>
                            <button
                              type="button"
                              className="nm-remove-btn"
                              aria-label="O‘chirish"
                              onClick={() => removeFromCart(item.key)}
                            >
                              O‘chirish
                            </button>
                          </div>
                          <span className="nm-cart-finish">
                            {item.finish.name} • {item.product.sku}-{item.finish.code}
                          </span>
                          <div className="nm-cart-item-bottom">
                            <div className="nm-qty-stepper nm-qty-sm">
                              <button
                                type="button"
                                aria-label="Kamaytirish"
                                onClick={() => updateCartQuantity(item.key, -1)}
                              >
                                <Icons.Minus />
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                type="button"
                                aria-label="Oshirish"
                                onClick={() => updateCartQuantity(item.key, 1)}
                              >
                                <Icons.Plus />
                              </button>
                            </div>
                            <strong>{formatPriceUZS(item.lineTotal)}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* PROMO CODE */}
                  <form className="nm-promo-form" onSubmit={handleApplyPromo}>
                    <input
                      type="text"
                      placeholder="Promokod (masalan: NOTI10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                    />
                    <button type="submit" className="nm-btn nm-btn-secondary nm-btn-sm">
                      Qo‘llash
                    </button>
                  </form>
                </div>

                <div className="nm-drawer-footer">
                  <div className="nm-totals">
                    <div className="nm-total-line">
                      <span>Mahsulotlar qiymati:</span>
                      <span>{formatPriceUZS(cartSubtotal)}</span>
                    </div>
                    {appliedPromo && (
                      <div className="nm-total-line is-discount">
                        <span>Promokod ({appliedPromo.code}):</span>
                        <span>−{formatPriceUZS(promoDiscount)}</span>
                      </div>
                    )}
                    <div className="nm-total-line">
                      <span>Yetkazib berish va yig‘ish:</span>
                      <span>{deliveryFee === 0 ? 'Bepul' : formatPriceUZS(deliveryFee)}</span>
                    </div>
                    <div className="nm-total-line is-grand">
                      <span>Jami to‘lov:</span>
                      <strong>{formatPriceUZS(cartGrandTotal)}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="nm-btn nm-btn-primary nm-btn-full"
                    onClick={() => setCheckoutStep('form')}
                  >
                    <span>Rasmiylashtirishga o‘tish</span>
                    <Icons.ArrowRight />
                  </button>
                </div>
              </>
            ) : (
              /* CHECKOUT FORM STEP */
              <form className="nm-drawer-body nm-checkout-form" onSubmit={handleCheckoutSubmit} noValidate>
                <button
                  type="button"
                  className="nm-back-link"
                  onClick={() => setCheckoutStep('bag')}
                >
                  ← Savatga qaytish
                </button>

                <label className="nm-field">
                  <span>Ism va familiyangiz *</span>
                  <input
                    type="text"
                    placeholder="Azizbek Tursunov"
                    value={checkoutForm.fullName}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, fullName: e.target.value })}
                  />
                  {checkoutErrors.fullName && <small className="nm-field-err">{checkoutErrors.fullName}</small>}
                </label>

                <label className="nm-field">
                  <span>Telefon raqamingiz *</span>
                  <input
                    type="tel"
                    placeholder="+998 90 123-45-67"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                  />
                  {checkoutErrors.phone && <small className="nm-field-err">{checkoutErrors.phone}</small>}
                </label>

                <label className="nm-field">
                  <span>Toshkent tumani</span>
                  <select
                    value={checkoutForm.district}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, district: e.target.value })}
                  >
                    <option>Mirobod tumani</option>
                    <option>Yunusobod tumani</option>
                    <option>Mirzo Ulug‘bek tumani</option>
                    <option>Shayxontohur tumani</option>
                    <option>Yakkasaroy tumani</option>
                    <option>Chilonzor tumani</option>
                    <option>Olmazor tumani</option>
                    <option>Sergeli / Yangihayot tumani</option>
                  </select>
                </label>

                <label className="nm-field">
                  <span>Ko‘cha, uy va xonadon raqami *</span>
                  <input
                    type="text"
                    placeholder="Nukus ko‘chasi, 44-uy, 18-xonadon"
                    value={checkoutForm.address}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                  />
                  {checkoutErrors.address && <small className="nm-field-err">{checkoutErrors.address}</small>}
                </label>

                <label className="nm-field">
                  <span>To‘lov usuli</span>
                  <select
                    value={checkoutForm.paymentMethod}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value })}
                  >
                    <option value="card">Uzcard / Humo / Payme / Click</option>
                    <option value="cash">Yetkazib berilganda naqd yoki terminal</option>
                    <option value="installment">0% Muddatli to‘lov (6–12 oy)</option>
                  </select>
                </label>

                <div className="nm-checkout-summary-bar">
                  <span>To‘lanadigan summa:</span>
                  <strong>{formatPriceUZS(cartGrandTotal)}</strong>
                </div>

                <button type="submit" className="nm-btn nm-btn-primary nm-btn-full">
                  <span>Buyurtmani tasdiqlash</span>
                  <Icons.Check />
                </button>
              </form>
            )}
          </aside>
        </div>
      )}

      {/* ====================================================================
          WISHLIST SLIDE-OVER DRAWER
         ==================================================================== */}
      {wishlistOpen && (
        <div
          className="nm-overlay nm-drawer-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Sevimlilar ro‘yxati"
          onClick={() => setWishlistOpen(false)}
        >
          <aside className="nm-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="nm-drawer-header">
              <div>
                <h3>Sevimlilar ({wishlistProducts.length})</h3>
                <span className="nm-drawer-sub">Saqlangan interyer modellari</span>
              </div>
              <button
                type="button"
                className="nm-icon-btn"
                aria-label="Sevimlilarni yopish"
                onClick={() => setWishlistOpen(false)}
              >
                <Icons.Close />
              </button>
            </div>

            {wishlistProducts.length === 0 ? (
              <div className="nm-drawer-empty">
                <p>Sevimlilar ro‘yxati bo‘sh.</p>
                <span>Yoqqan mebel kartochkasidagi yurakcha belgisini bosing.</span>
                <button
                  type="button"
                  className="nm-btn nm-btn-primary"
                  onClick={() => {
                    setWishlistOpen(false);
                    scrollToSection('catalog');
                  }}
                >
                  Katalogga o‘tish
                </button>
              </div>
            ) : (
              <div className="nm-drawer-body">
                <div className="nm-cart-list">
                  {wishlistProducts.map((product) => (
                    <div key={product.id} className="nm-cart-item">
                      <img src={product.image} alt={product.name} className="nm-cart-thumb" />
                      <div className="nm-cart-item-info">
                        <div className="nm-cart-item-top">
                          <h4>{product.name}</h4>
                          <button
                            type="button"
                            className="nm-remove-btn"
                            onClick={() => toggleWishlist(product.id)}
                          >
                            O‘chirish
                          </button>
                        </div>
                        <span className="nm-cart-finish">{product.dimensions}</span>
                        <div className="nm-cart-item-bottom">
                          <strong>{formatPriceUZS(getProductEffectivePrice(product))}</strong>
                          <button
                            type="button"
                            className="nm-btn nm-btn-sm nm-btn-outline"
                            onClick={() => {
                              addToCart(product);
                              setWishlistOpen(false);
                              setCartOpen(true);
                            }}
                          >
                            Savatga
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* ====================================================================
          MOBILE NAVIGATION DRAWER
         ==================================================================== */}
      {mobileMenuOpen && (
        <div
          className="nm-overlay nm-drawer-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Mobil menyu"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside className="nm-drawer nm-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="nm-drawer-header">
              <span className="nm-brand-name">notiMebel</span>
              <button
                type="button"
                className="nm-icon-btn"
                aria-label="Menyuni yopish"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icons.Close />
              </button>
            </div>

            <nav className="nm-mobile-nav">
              <button type="button" onClick={() => scrollToSection('catalog')}>
                Katalog
              </button>
              <button type="button" onClick={() => scrollToSection('lookbook')}>
                Interyerda ko‘ring
              </button>
              <button type="button" onClick={() => scrollToSection('materials')}>
                Materiallar kutubxonasi
              </button>
              <button type="button" onClick={() => scrollToSection('bespoke')}>
                Buyurtma asosida
              </button>
              <button type="button" onClick={() => scrollToSection('showrooms')}>
                Toshkent shourumlari
              </button>
            </nav>

            <div className="nm-mobile-footer">
              <a href="tel:+998712004488" className="nm-mobile-phone">
                +998 71 200-44-88
              </a>
              <p>Mirobod va Yunusobod shourumlari • Har kuni 10:00 – 20:00</p>
            </div>
          </aside>
        </div>
      )}

      {/* ====================================================================
          ARCHITECTURAL TOAST NOTIFICATION
         ==================================================================== */}
      {toast && (
        <div className="nm-toast" role="status" aria-live="polite">
          <div className="nm-toast-accent" aria-hidden="true" />
          <div className="nm-toast-content">
            <strong>{toast.message}</strong>
            {toast.detail && <span>{toast.detail}</span>}
          </div>
          <button
            type="button"
            className="nm-toast-close"
            aria-label="Bildirishnomani yopish"
            onClick={() => setToast(null)}
          >
            <Icons.Close />
          </button>
        </div>
      )}
    </div>
  );
}