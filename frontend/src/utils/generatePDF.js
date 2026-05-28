import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = async (order, userInfo) => {
    try {
        const doc = new jsPDF('p', 'pt', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 40;

        // Colors
        const primaryColor = [0, 138, 123]; // Brand Teal #008A7B
        const secondaryColor = [44, 62, 80]; // Brand Navy
        const lightGray = [241, 245, 249]; // slate-100

        // Header Section
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, pageWidth, 100, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('RentEase', margin, 50);
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text('Premium Furniture Rentals', margin, 70);

        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('TAX INVOICE', pageWidth - margin, 60, { align: 'right' });

        // Invoice Meta Details
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        let startY = 140;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Invoice Number:', pageWidth - margin - 200, startY);
        doc.setFont('helvetica', 'normal');
        doc.text(`INV-${order._id.substring(0, 8).toUpperCase()}`, pageWidth - margin, startY, { align: 'right' });

        doc.setFont('helvetica', 'bold');
        doc.text('Date of Issue:', pageWidth - margin - 200, startY + 15);
        doc.setFont('helvetica', 'normal');
        doc.text(new Date(order.createdAt || Date.now()).toLocaleDateString(), pageWidth - margin, startY + 15, { align: 'right' });

        doc.setFont('helvetica', 'bold');
        doc.text('Order ID:', pageWidth - margin - 200, startY + 30);
        doc.setFont('helvetica', 'normal');
        doc.text(order._id, pageWidth - margin, startY + 30, { align: 'right' });

        // Customer Details
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Billed To:', margin, startY);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const customerName = order.user?.name || userInfo?.name || 'Valued Customer';
        const customerEmail = order.user?.email || userInfo?.email || '';
        
        doc.text(customerName, margin, startY + 15);
        if (customerEmail) doc.text(customerEmail, margin, startY + 30);
        
        if (order.shippingAddress) {
            const { address, city, postalCode, country } = order.shippingAddress;
            doc.text(`${address}`, margin, startY + 45);
            doc.text(`${city}, ${postalCode}`, margin, startY + 60);
            doc.text(`${country}`, margin, startY + 75);
        }

        startY = 240;

        // Table Data
        const tableColumn = ["Item", "Qty", "Duration", "Price/Month", "Total"];
        const tableRows = [];

        order.orderItems.forEach(item => {
            const pricePerMonth = Math.round(item.price / (item.rentalDurationDays/30 || 1));
            const itemData = [
                item.name,
                item.qty,
                `${item.rentalDurationDays} Days`,
                `Rs. ${pricePerMonth.toLocaleString()}`,
                `Rs. ${item.price.toLocaleString()}`
            ];
            tableRows.push(itemData);
        });

        autoTable(doc, {
            startY: startY,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
            bodyStyles: { textColor: 50 },
            alternateRowStyles: { fillColor: lightGray },
            margin: { left: margin, right: margin }
        });

        // Totals Section
        const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 30 : doc.previousAutoTable ? doc.previousAutoTable.finalY + 30 : startY + (tableRows.length * 20) + 50;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Payment Method:', margin, finalY);
        doc.setFont('helvetica', 'normal');
        doc.text(order.paymentMethod, margin + 100, finalY);

        doc.setFont('helvetica', 'bold');
        doc.text('Payment Status:', margin, finalY + 15);
        doc.setFont('helvetica', 'normal');
        doc.text(order.isPaid ? 'Paid' : (order.paymentMethod === 'Cash on Delivery' ? 'Pending (COD)' : 'Pending'), margin + 100, finalY + 15);

        // Right side totals
        doc.setFont('helvetica', 'normal');
        doc.text('Subtotal:', pageWidth - margin - 160, finalY);
        doc.text(`Rs. ${(order.totalPrice - (order.taxPrice || 0) - (order.shippingPrice || 0)).toLocaleString()}`, pageWidth - margin, finalY, { align: 'right' });

        doc.text('Tax:', pageWidth - margin - 160, finalY + 15);
        doc.text(`Rs. ${(order.taxPrice || 0).toLocaleString()}`, pageWidth - margin, finalY + 15, { align: 'right' });

        doc.text('Delivery Charge:', pageWidth - margin - 160, finalY + 30);
        doc.text(`Rs. ${(order.shippingPrice || 0).toLocaleString()}`, pageWidth - margin, finalY + 30, { align: 'right' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Grand Total:', pageWidth - margin - 160, finalY + 50);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`Rs. ${order.totalPrice.toLocaleString()}`, pageWidth - margin, finalY + 50, { align: 'right' });

        // Footer
        const footerY = doc.internal.pageSize.getHeight() - 80;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, footerY, pageWidth - margin, footerY);

        doc.setTextColor(100, 100, 100);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Terms & Conditions:', margin, footerY + 15);
        
        doc.setFont('helvetica', 'normal');
        doc.text('1. Returns must be initiated within 7 days of delivery in original condition.', margin, footerY + 30);
        doc.text('2. Please keep this invoice for any warranty claims or support requests.', margin, footerY + 45);

        doc.setFont('helvetica', 'bold');
        doc.text('Thank you for choosing RentEase!', pageWidth / 2, footerY + 60, { align: 'center' });
        
        doc.save(`invoice-${order._id}.pdf`);
        return true;
    } catch (error) {
        console.error("Error generating PDF:", error);
        return false;
    }
};
