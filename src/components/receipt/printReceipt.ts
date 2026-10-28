/**
 * Utilitas cetak instan struk thermal kasir menggunakan iframe terisolasi.
 * Menjamin hasil cetak presisi sesuai ukuran kertas thermal (58mm / 80mm),
 * langsung memicu dialog printer tanpa terhalang CORS, PDF viewer, atau pop-up blocker.
 */

export interface PrintThermalReceiptOptions {
  paperWidth?: '58mm' | '80mm';
  documentTitle?: string;
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
}

export function printThermalReceipt(
  targetElementId: string,
  options: PrintThermalReceiptOptions | '58mm' | '80mm' = '80mm'
): boolean {
  const config: PrintThermalReceiptOptions =
    typeof options === 'string'
      ? { paperWidth: options }
      : { paperWidth: '80mm', ...options };

  const paperWidth = config.paperWidth || '80mm';
  const documentTitle = config.documentTitle || 'Struk-KasirIn';

  const element = document.getElementById(targetElementId);
  if (!element) {
    console.warn(`Elemen struk dengan id "${targetElementId}" tidak ditemukan.`);
    return false;
  }

  // Buat iframe tersembunyi di DOM
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    console.error('Tidak dapat mengakses iframe document untuk mencetak.');
    iframe.remove();
    return false;
  }

  doc.title = documentTitle;

  // Salin seluruh stylesheet dari aplikasi utama ke dalam iframe
  const styleNodes = document.querySelectorAll('link[rel="stylesheet"], style');
  styleNodes.forEach((node) => {
    doc.head.appendChild(node.cloneNode(true));
  });

  // Aturan CSS cetak thermal presisi
  const targetWidth = paperWidth === '58mm' ? '58mm' : '80mm';
  const printRuleStyle = doc.createElement('style');
  printRuleStyle.textContent = `
    @page {
      size: ${targetWidth} auto;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #ffffff !important;
      color: #000000 !important;
      width: ${targetWidth} !important;
      max-width: ${targetWidth} !important;
      font-family: 'Courier New', Courier, Consolas, monospace !important;
    }
    .print\\:hidden {
      display: none !important;
    }
    #${targetElementId} {
      width: 100% !important;
      max-width: 100% !important;
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
      padding: 3mm 2mm 5mm 2mm !important;
      margin: 0 auto !important;
      background: #ffffff !important;
    }
  `;
  doc.head.appendChild(printRuleStyle);

  // Masukkan elemen HTML struk ke body iframe
  doc.body.innerHTML = element.outerHTML;

  config.onBeforePrint?.();

  // Berikan sedikit jeda agar stylesheet dan font termuat sempurna
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      console.error('Gagal mencetak struk via iframe:', err);
    } finally {
      config.onAfterPrint?.();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1500);
    }
  }, 200);

  return true;
}

