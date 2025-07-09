window.exportMultipleDivsToPdf = function (divIds, fileName, filipinoData, englishData) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
    });

    // Set font
    pdf.setFont('Arial', 'normal');
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);

    // Filipino Summary (Page 1)
    let y = 40;
    pdf.text("Filipino Summary (Filipino Version)", 40, y);
    y += 30;
    pdf.setFontSize(14);
    pdf.text("Buod at Pagsusuri ng Pag-unlad ng mga Nag-aaral", 40, y);
    y += 30;
    pdf.setFontSize(12);
    pdf.text(`${filipinoData.frustration} (${filipinoData.frustrationPercent}%) - Frustration Level (Kailangang Gabayan)`, 40, y);
    y += 20;
    pdf.text("Kailangan nila ng mas maraming gabay at pagsasanay sa mga batayang kasanayan.", 40, y);
    y += 20;
    pdf.text(`${filipinoData.instructional} (${filipinoData.instructionalPercent}%) - Instructional Level (Nagsisimula/Umaasenso)`, 40, y);
    y += 20;
    pdf.text("Makakatulong ang dagdag na pagsasanay at self-paced learning para sa kanila.", 40, y);
    y += 20;
    pdf.text(`${filipinoData.independent} (${filipinoData.independentPercent}%) - Independent Level (Mahusay)`, 40, y);
    y += 20;
    pdf.text("Bigyan sila ng mas mahihirap na gawain at pagkakataong tumulong sa iba.", 40, y);
    y += 30;
    pdf.text(`Kabuuang mag-aaral: ${filipinoData.total}`, 40, y);

    // English Summary (Page 2)
    pdf.addPage();
    y = 40;
    pdf.setFontSize(18);
    pdf.text("English Summary", 40, y);
    y += 30;
    pdf.setFontSize(14);
    pdf.text("Summary & Analysis of Learner Progression", 40, y);
    y += 30;
    pdf.setFontSize(12);
    pdf.text(`${englishData.frustration} (${englishData.frustrationPercent}%) - Frustration Level (Needs Improvement)`, 40, y);
    y += 20;
    pdf.text("They likely need more guidance and basic skill-building to move forward.", 40, y);
    y += 20;
    pdf.text(`${englishData.instructional} (${englishData.instructionalPercent}%) - Instructional Level (Satisfactory/Progressing)`, 40, y);
    y += 20;
    pdf.text("These learners can benefit from more practice and self-paced learning to improve their skills.", 40, y);
    y += 20;
    pdf.text(`${englishData.independent} (${englishData.independentPercent}%) - Independent Level (Mastery/Excellent)`, 40, y);
    y += 20;
    pdf.text("They should be given advanced challenges and opportunities to mentor others.", 40, y);
    y += 30;
    pdf.text(`Total learners: ${englishData.total}`, 40, y);

    pdf.save(fileName || 'all-summaries.pdf');
};

// New function for generating and printing student credentials PDF
window.generateAndPrintPDF = function (htmlContent) {
    try {
        // Create a temporary div to hold the HTML content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        document.body.appendChild(tempDiv);

        // Use html2canvas to convert HTML to canvas
        html2canvas(tempDiv, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
        }).then(function (canvas) {
            // Remove the temporary div
            document.body.removeChild(tempDiv);

            // Convert canvas to blob
            canvas.toBlob(function (blob) {
                // Create a URL for the blob
                const url = URL.createObjectURL(blob);
                
                // Create a new window for printing
                const printWindow = window.open(url, '_blank');
                
                if (printWindow) {
                    printWindow.onload = function () {
                        printWindow.print();
                        // Clean up the URL after printing
                        setTimeout(function () {
                            URL.revokeObjectURL(url);
                        }, 1000);
                    };
                } else {
                    // Fallback: download the PDF
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'student-credentials.pdf';
                    link.click();
                    URL.revokeObjectURL(url);
                }
            }, 'image/png');
        }).catch(function (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        });
    } catch (error) {
        console.error('Error in generateAndPrintPDF:', error);
        alert('Error generating PDF. Please try again.');
    }
};

// Alternative function using jsPDF for better PDF generation
window.generateStudentCredentialsPDF = function (credentials) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text("Student Login Credentials", 105, 15, { align: 'center' });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text(`Date Generated: ${new Date().toLocaleDateString()}`, 105, 20, { align: 'center' });

    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
    const bottomMargin = 15;
    const cardWidth = (pageWidth - 30) / 2; // 2 columns with margin
    const cardHeight = 50;
    const xPositions = [15, pageWidth / 2 + 5]; // X start positions for 2 columns

    let col = 0;
    let y = 30;

    credentials.forEach((cred, index) => {
        if (y + cardHeight > pageHeight - bottomMargin) {
            pdf.addPage();
            y = 20; // Reset Y position for new page
            col = 0;
        }
        
        const x = xPositions[col];

        // Draw a rounded rectangle for the card
        pdf.setDrawColor(150, 150, 150);
        pdf.setFillColor(249, 249, 249);
        pdf.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'FD');

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(40, 40, 40);
        pdf.text(cred.fullName || '', x + 5, y + 8);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Grade ${cred.gradeLevel || ''} - ${cred.section || ''}`, x + 5, y + 14);

        // Separator line
        pdf.setDrawColor(200, 200, 200);
        pdf.line(x + 5, y + 20, x + cardWidth - 5, y + 20);

        // Credentials
        pdf.setFont('courier', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Username: ${cred.username || ''}`, x + 5, y + 28);
        pdf.text(`Password: ${cred.password || ''}`, x + 5, y + 36);
        
        // Move to next column or row
        col++;
        if (col >= 2) {
            col = 0;
            y += cardHeight + 5; // Move to next row
        }
    });

    pdf.save('student-credentials.pdf');
};