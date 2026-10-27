import React from 'react';

export type LogoVariant = 'fintech-k' | 'terminal' | 'receipt' | 'pill' | 'storefront';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
export type LogoTheme = 'auto' | 'light' | 'dark' | 'monochrome';
export type LogoLayout = 'horizontal' | 'vertical' | 'icon-only';

export interface BrandLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  theme?: LogoTheme;
  layout?: LogoLayout;
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeConfig = {
  sm: { icon: 30, text: 'text-base', subtext: 'text-[9px]', gap: 'gap-2' },
  md: { icon: 38, text: 'text-lg', subtext: 'text-[10px]', gap: 'gap-2.5' },
  lg: { icon: 48, text: 'text-2xl', subtext: 'text-xs', gap: 'gap-3' },
  xl: { icon: 64, text: 'text-3xl', subtext: 'text-sm', gap: 'gap-3.5' },
};

/**
 * 1. Fintech Arrow K
 * Monogram K dengan panah diagonal atas kanan (In / Growth / Cash In)
 */
const FintechKIcon: React.FC<{ size: number; isDark?: boolean; isMono?: boolean }> = ({ 
  size, 
  isMono 
}) => {
  return (
    <div 
      className={`relative shrink-0 flex items-center justify-center rounded-xl transition-transform duration-300 hover:scale-105 ${
        isMono 
          ? 'bg-black text-white' 
          : 'bg-gradient-to-br from-[#00855d] to-[#006948] text-white shadow-md shadow-emerald-950/20'
      }`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[65%] h-[65%]"
      >
        {/* Tiang vertikal (Receipt bar) */}
        <path
          d="M8 6C8 4.89543 8.89543 4 10 4C11.1046 4 12 4.89543 12 6V26C12 27.1046 11.1046 28 10 28C8.89543 28 8 27.1046 8 26V6Z"
          fill="currentColor"
        />
        {/* Panah Cash-In ↗ (atas) */}
        <path
          d="M24 7C24.5523 7 25 7.44772 25 8V14C25 14.5523 24.5523 15 24 15C23.4477 15 23 14.5523 23 14V10.4142L14.7071 18.7071C14.3166 19.0976 13.6834 19.0976 13.2929 18.7071C12.9024 18.3166 12.9024 17.6834 13.2929 17.2929L21.5858 9H18C17.4477 9 17 8.55228 17 8C17 7.44772 17.4477 7 18 7H24Z"
          fill={isMono ? 'currentColor' : '#85f8c4'}
        />
        {/* Kaki kanan bawah K */}
        <path
          d="M14.5 15.5L23.2 26.2C23.6 26.7 24.3 26.8 24.8 26.4C25.3 26 25.4 25.3 25 24.8L16.8 14.8L14.5 15.5Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

/**
 * 2. Smart POS Terminal
 * Mesin kasir handheld minimalis dengan sinyal digital & pulse dot
 */
const TerminalIcon: React.FC<{ size: number; isDark?: boolean; isMono?: boolean }> = ({
  size,
  isMono,
}) => {
  return (
    <div
      className={`relative shrink-0 flex items-center justify-center rounded-xl transition-transform duration-300 hover:scale-105 ${
        isMono
          ? 'border-2 border-black bg-white text-black'
          : 'bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-700 text-[#006948] dark:text-[#6cf8bb] shadow-sm'
      }`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[60%] h-[60%]"
      >
        {/* Body Terminal Kasir */}
        <rect x="5" y="2" width="14" height="20" rx="3" />
        {/* Layar POS */}
        <line x1="8" y1="6" x2="16" y2="6" strokeWidth="2.5" />
        {/* Tombol Numpad / Struk */}
        <line x1="8" y1="11" x2="10" y2="11" />
        <line x1="14" y1="11" x2="16" y2="11" />
        <line x1="8" y1="14" x2="10" y2="14" />
        <line x1="14" y1="14" x2="16" y2="14" />
        {/* Slot kartu/struk bawah */}
        <line x1="9" y1="18" x2="15" y2="18" strokeWidth="1.5" />
      </svg>

      {/* Dynamic Pulse Beacon */}
      {!isMono && (
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#006948]" />
        </span>
      )}
    </div>
  );
};

/**
 * 3. Folded Receipt K
 * Siluet lipatan struk kasir geometris modern 3D flat
 */
const ReceiptIcon: React.FC<{ size: number; isDark?: boolean; isMono?: boolean }> = ({
  size,
  isMono,
}) => {
  return (
    <div
      className={`relative shrink-0 flex items-center justify-center rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 ${
        isMono ? 'bg-black' : 'bg-[#005137] shadow-md shadow-emerald-950/20'
      }`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[70%] h-[70%]"
      >
        {/* Batang utama kiri */}
        <path d="M7 6H12V30H7V6Z" fill="white" />
        {/* Sayap kanan atas (Folded mint) */}
        <path
          d="M27 6H20L12 16L18 20L27 6Z"
          fill={isMono ? 'white' : '#6cf8bb'}
          fillOpacity={isMono ? '0.7' : '1'}
        />
        {/* Sayap kanan bawah */}
        <path d="M15 17L21 14L28 29H21L15 17Z" fill="white" />
        {/* Garis gerigi struk kasir bawah */}
        <circle cx="9.5" cy="27" r="1" fill={isMono ? 'black' : '#005137'} />
      </svg>
    </div>
  );
};

/**
 * 4. Pill Modern Monogram
 * Desain ala Silicon Valley SaaS modern dengan emblem scan badge
 */
const PillIcon: React.FC<{ size: number; isDark?: boolean; isMono?: boolean }> = ({
  size,
  isMono,
}) => {
  return (
    <div
      className={`relative shrink-0 flex items-center justify-center rounded-xl transition-transform duration-300 hover:scale-105 ${
        isMono
          ? 'bg-black text-white'
          : 'bg-gradient-to-tr from-[#006948] via-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-900/25'
      }`}
      style={{ width: size, height: size }}
    >
      <div className="flex items-center font-black tracking-tighter text-white" style={{ fontSize: size * 0.45 }}>
        <span>K</span>
        <span className="text-emerald-200 ml-0.5">•</span>
      </div>
    </div>
  );
};

/**
 * 5. Modern Storefront
 * Siluet toko UMKM yang ramah & terpercaya
 */
const StorefrontIcon: React.FC<{ size: number; isDark?: boolean; isMono?: boolean }> = ({
  size,
  isMono,
}) => {
  return (
    <div
      className={`relative shrink-0 flex items-center justify-center rounded-xl transition-transform duration-300 hover:scale-105 ${
        isMono
          ? 'bg-black text-white'
          : 'bg-gradient-to-tr from-[#006948] to-emerald-500 text-white shadow-md shadow-emerald-900/20'
      }`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[60%] h-[60%]"
      >
        {/* Atap toko */}
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        {/* Pintu / Register kasir */}
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      {/* Tanda check transaksi sukses */}
      {!isMono && (
        <span className="absolute -bottom-1 -right-1 bg-white text-[#006948] rounded-full p-0.5 shadow">
          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 fill-current">
            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </div>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'pill',
  size = 'md',
  theme = 'auto',
  layout = 'horizontal',
  showTagline = true,
  className = '',
  onClick,
}) => {
  const currentSize = sizeConfig[size];
  const isDark = theme === 'dark';
  const isMono = theme === 'monochrome';

  const renderIcon = () => {
    switch (variant) {
      case 'fintech-k':
        return <FintechKIcon size={currentSize.icon} isDark={isDark} isMono={isMono} />;
      case 'terminal':
        return <TerminalIcon size={currentSize.icon} isDark={isDark} isMono={isMono} />;
      case 'receipt':
        return <ReceiptIcon size={currentSize.icon} isDark={isDark} isMono={isMono} />;
      case 'pill':
        return <PillIcon size={currentSize.icon} isDark={isDark} isMono={isMono} />;
      case 'storefront':
        return <StorefrontIcon size={currentSize.icon} isDark={isDark} isMono={isMono} />;
      default:
        return <PillIcon size={currentSize.icon} isDark={isDark} isMono={isMono} />;
    }
  };

  const renderTypography = () => {
    const textColor = isMono
      ? 'text-black'
      : isDark
      ? 'text-white'
      : 'text-on-surface';

    const subColor = isMono
      ? 'text-zinc-600'
      : isDark
      ? 'text-emerald-300/80'
      : 'text-text-muted';

    // Variasi tipografi per konsep
    if (variant === 'pill') {
      return (
        <div className={`flex ${layout === 'vertical' ? 'items-center mt-2' : 'flex-col leading-none'}`}>
          <div className="flex items-center gap-1">
            <span className={`font-black tracking-tight ${currentSize.text} ${textColor}`}>
              Kasir
            </span>
            <span className={`px-1.5 py-0.5 rounded-md ${isMono ? 'bg-black text-white font-bold' : 'bg-[#006948] text-white'} text-[11px] font-extrabold tracking-wider`}>
              IN
            </span>
            {!isMono && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />}
          </div>
          {showTagline && (
            <span className={`${currentSize.subtext} font-semibold uppercase tracking-wider ${subColor} mt-0.5`}>
              Smart POS UMKM
            </span>
          )}
        </div>
      );
    }

    if (variant === 'terminal') {
      return (
        <div className={`flex flex-col leading-none ${layout === 'vertical' ? 'items-center mt-2' : ''}`}>
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight ${currentSize.text} ${textColor}`}>
              Kasir<span className="text-[#006948] dark:text-[#6cf8bb]">In</span>
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-[#006948] border border-emerald-200">
              POS
            </span>
          </div>
          {showTagline && (
            <span className={`${currentSize.subtext} font-medium tracking-wide ${subColor} mt-0.5`}>
              Pintar • Cepat • Sah
            </span>
          )}
        </div>
      );
    }

    // Default / fintech-k / receipt / storefront typography
    return (
      <div className={`flex flex-col leading-none ${layout === 'vertical' ? 'items-center mt-2' : ''}`}>
        <span className={`font-black tracking-tight ${currentSize.text} ${textColor}`}>
          Kasir<span className={isMono ? 'text-black font-normal' : 'text-[#006948] dark:text-[#6cf8bb]'}>In</span>
        </span>
        {showTagline && (
          <span className={`${currentSize.subtext} font-bold tracking-wider uppercase ${subColor} mt-1`}>
            {variant === 'receipt' ? 'Sistem Kasir Digital' : variant === 'storefront' ? 'Mitra UMKM' : 'UMKM POS'}
          </span>
        )}
      </div>
    );
  };

  if (layout === 'icon-only') {
    return (
      <div className={`inline-flex items-center justify-center cursor-pointer ${className}`} onClick={onClick}>
        {renderIcon()}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${
        layout === 'vertical' ? 'flex-col text-center' : currentSize.gap
      } ${onClick ? 'cursor-pointer select-none group' : ''} ${className}`}
    >
      {renderIcon()}
      {renderTypography()}
    </div>
  );
};

export default BrandLogo;
