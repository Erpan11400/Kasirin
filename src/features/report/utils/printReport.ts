/**
 * Utilitas untuk mencetak atau mendownload template laporan menjadi PDF
 * Menggunakan iframe terisolasi sehingga menghasilkan dokumen PDF vektor berkualitas tinggi
 * tanpa mengganggu tampilan layar aplikasi.
 */

export function printReportDocument(
  printableElementId: string,
  fileName: string = 'Laporan-KasirIn'
): void {
  const element = document.getElementById(printableElementId);
  if (!element) {
    console.warn(`Elemen dengan ID "${printableElementId}" tidak ditemukan. Menggunakan window.print() default.`);
    window.print();
    return;
  }

  // Buat iframe tersembunyi untuk mencetak dokumen secara terisolasi
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
    window.print();
    return;
  }

  // Tentukan judul dokumen untuk penamaan file otomatis saat "Save as PDF" di browser
  doc.title = fileName;

  // Salin seluruh stylesheet dari aplikasi utama ke dalam iframe
  const styleNodes = document.querySelectorAll('link[rel="stylesheet"], style');
  styleNodes.forEach((node) => {
    doc.head.appendChild(node.cloneNode(true));
  });

  // Tambahkan aturan CSS spesifik cetak agar layout presisi A4 tanpa margin aneh
  const printRuleStyle = doc.createElement('style');
  printRuleStyle.textContent = `
    @page {
      size: auto;
      margin: 8mm 10mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      background-color: #ffffff !important;
      color: #0f172a !important;
      margin: 0 !important;
      padding: 0 !important;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    table {
      border-collapse: collapse !important;
      width: 100% !important;
    }
    thead {
      display: table-header-group !important;
    }
    tfoot {
      display: table-footer-group !important;
    }
    tr {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }
    .no-print {
      display: none !important;
    }
  `;
  doc.head.appendChild(printRuleStyle);

  // Salin HTML dari elemen laporan ke body iframe
  doc.body.innerHTML = element.innerHTML;

  // Berikan sedikit waktu agar browser merender font dan CSS
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      console.error('Gagal memicu pencetakan pada iframe:', err);
      window.print();
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2500);
    }
  }, 400);
}
