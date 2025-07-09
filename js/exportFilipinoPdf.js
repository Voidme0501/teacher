window.exportFilipinoSummaryToPdf = function (testType, fileName, data) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
    });

    let y = 40;
    pdf.setFont('Arial', 'normal');
    pdf.setFontSize(22);
    pdf.text('Summary & Analysis', 40, y);
    y += 28;
    pdf.setFontSize(18);
    pdf.text('Filipino Summary', 40, y);
    y += 30;
    pdf.setFontSize(14);
    let testTitle = testType === "preTest" ? "PRE-TEST" : "POST-TEST";
    pdf.text(testTitle, 40, y);
    y += 30;
    pdf.setFontSize(12);
    let frustrationLabel = "Frustration Level (Kailangang Gabayan)";
    let instructionalLabel = "Instructional Level (Nagsisimula/Umaasenso)";
    let independentLabel = "Independent Level (Mahusay)";
    let frustrationDesc = "Kailangan nila ng mas maraming gabay at pagsasanay sa mga batayang kasanayan.";
    let instructionalDesc = "Makakatulong ang dagdag na pagsasanay at self-paced learning para sa kanila.";
    let independentDesc = "Bigyan sila ng mas mahihirap na gawain at pagkakataong tumulong sa iba.";
    let totalLabel = testType === "preTest" ? "Kabuuang mag-aaral (Pre-Test):" : "Kabuuang mag-aaral (Post-Test):";

    pdf.text(`${data.frustration} (${data.frustrationPercent}%) - ${frustrationLabel}`, 40, y);
    y += 18;
    pdf.text(frustrationDesc, 40, y);
    y += 18;
    pdf.text(`${data.instructional} (${data.instructionalPercent}%) - ${instructionalLabel}`, 40, y);
    y += 18;
    pdf.text(instructionalDesc, 40, y);
    y += 18;
    pdf.text(`${data.independent} (${data.independentPercent}%) - ${independentLabel}`, 40, y);
    y += 18;
    pdf.text(independentDesc, 40, y);
    y += 22;
    pdf.text(`${totalLabel} ${data.total}`, 40, y);

    // Add date and time at the bottom
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    pdf.setFontSize(10);
    pdf.text(`Date: ${dateStr}    Time: ${timeStr}`, 40, 800);

    pdf.save(fileName || 'filipino-summary.pdf');
}; 