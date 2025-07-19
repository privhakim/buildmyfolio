document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const exportPdfBtn = document.getElementById('export-pdf');
    const exportHtmlBtn = document.getElementById('export-html');
    const copyCodeBtn = document.getElementById('copy-code');
    const previewContainer = document.getElementById('previewContainer');

    // 1. Enhanced PDF Export
    exportPdfBtn.addEventListener('click', function() {
        if (!previewContainer.querySelector('.portfolio-container')) {
            alert('Please generate portfolio content first!');
            return;
        }

        // Create print-optimized template
        const element = document.createElement('div');
        element.innerHTML = `
            <div class="p-8 print:p-0">
                <div class="max-w-4xl mx-auto">
                    <header class="mb-8 print:mb-4 border-b pb-4 print:border-black">
                        <h1 class="text-3xl font-bold print:text-2xl">My Portfolio</h1>
                        <div class="text-sm text-gray-500 mt-2">
                            ${new Date().toLocaleDateString()}
                        </div>
                    </header>
                    ${previewContainer.querySelector('.portfolio-container').innerHTML}
                </div>
            </div>
        `;

        // PDF Options
        const pdfOptions = {
            margin: 15,
            filename: 'my-portfolio.pdf',
            html2canvas: { scale: 2, scrollX: 0, scrollY: 0 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // UI Feedback
        const originalText = exportPdfBtn.innerHTML;
        exportPdfBtn.innerHTML = '⏳ Generating PDF...';
        exportPdfBtn.disabled = true;

        // Generate PDF
        html2pdf()
            .set(pdfOptions)
            .from(element)
            .toPdf()
            .get('pdf')
            .then(pdf => {
                const totalPages = pdf.internal.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i);
                    pdf.setFontSize(10);
                    pdf.text(
                        `Page ${i} of ${totalPages}`,
                        pdf.internal.pageSize.getWidth() - 25,
                        pdf.internal.pageSize.getHeight() - 10
                    );
                }
            })
            .save()
            .finally(() => {
                exportPdfBtn.innerHTML = originalText;
                exportPdfBtn.disabled = false;
            });
    });

    // 2. HTML Download (Original Functionality)
    exportHtmlBtn.addEventListener('click', function() {
        if (!previewContainer.querySelector('.portfolio-container')) {
            alert('Please generate portfolio content first!');
            return;
        }

        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @media print {
            body { padding: 20px; }
            .portfolio-container { max-width: 100% !important; }
        }
    </style>
</head>
<body>
    ${previewContainer.querySelector('.portfolio-container').outerHTML}
</body>
</html>
        `;

        // Trigger download
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-portfolio.html';
        a.click();
        URL.revokeObjectURL(url);
    });

    // 3. Copy HTML Code (Original Functionality)
    copyCodeBtn.addEventListener('click', function() {
        if (!previewContainer.querySelector('.portfolio-container')) {
            alert('Please generate portfolio content first!');
            return;
        }

        const htmlCode = previewContainer.querySelector('.portfolio-container').outerHTML;
        navigator.clipboard.writeText(htmlCode)
            .then(() => {
                const originalText = copyCodeBtn.innerHTML;
                copyCodeBtn.innerHTML = '✓ Copied!';
                setTimeout(() => {
                    copyCodeBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Copy failed:', err);
                copyCodeBtn.innerHTML = '❌ Failed!';
                setTimeout(() => {
                    copyCodeBtn.innerHTML = 'Copy HTML';
                }, 2000);
            });
    });
});