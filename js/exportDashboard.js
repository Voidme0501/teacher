// Function to export dashboard as a multi-page, high-quality PDF
function exportDashboardAsPdf() {
    const dashboardContainer = document.getElementById('dashboard-container');
    if (!dashboardContainer) {
        console.error('Dashboard container not found!');
        return;
    }

    // Find the button to hide it from the capture
    const downloadButton = document.querySelector('.col-md-4.d-flex.align-items-end');
    if (downloadButton) {
        downloadButton.style.visibility = 'hidden'; // Use visibility to maintain layout
    }

    // Use html2canvas to capture the dashboard container
    html2canvas(dashboardContainer, {
        scale: 2, // Higher scale for better resolution
        useCORS: true,
        logging: false,
        width: dashboardContainer.scrollWidth,
        height: dashboardContainer.scrollHeight,
        windowWidth: dashboardContainer.scrollWidth,
        windowHeight: dashboardContainer.scrollHeight
    }).then(canvas => {
        try {
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;

            // A4 page size in points (pt): 595.28 x 841.89
            const pdfWidth = 595.28;
            const pageHeight = 841.89;
            
            // Calculate the image dimensions to fit the PDF width
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = imgWidth / pdfWidth;
            const scaledImgHeight = imgHeight / ratio;

            // Create a new PDF document in portrait orientation
            const pdf = new jsPDF('p', 'pt', 'a4');
            const date = new Date();
            const formattedDate = `Generated on: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            
            let heightLeft = scaledImgHeight;
            let position = 0;
            let pageNum = 1;

            // Add the first page
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledImgHeight);
            
            // Add footer to the first page
            pdf.setFontSize(8);
            pdf.setTextColor(150);
            pdf.text(
                `${formattedDate} | Page ${pageNum}`,
                pdf.internal.pageSize.getWidth() / 2,
                pdf.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );

            heightLeft -= pageHeight;

            // Add new pages if the content is longer than one page
            while (heightLeft > 0) {
                position = heightLeft - scaledImgHeight;
                pdf.addPage();
                pageNum++;
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledImgHeight);
                
                // Add footer to the new page
                pdf.setFontSize(8);
                pdf.setTextColor(150);
                pdf.text(
                    `${formattedDate} | Page ${pageNum}`,
                    pdf.internal.pageSize.getWidth() / 2,
                    pdf.internal.pageSize.getHeight() - 10,
                    { align: 'center' }
                );

                heightLeft -= pageHeight;
            }

            // Generate timestamp for the filename
            const timestamp = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}`;
            const fileName = `Teacher_Dashboard_Report_${timestamp}.pdf`;

            // Save the PDF
            pdf.save(fileName);
        } catch (e) {
            console.error('Error generating PDF:', e);
        } finally {
            // Ensure the button is made visible again
            if (downloadButton) {
                downloadButton.style.visibility = 'visible';
            }
        }
    }).catch(err => {
        console.error('Error with html2canvas:', err);
        // Ensure the button is made visible again in case of an error
        if (downloadButton) {
            downloadButton.style.visibility = 'visible';
        }
    });
} 