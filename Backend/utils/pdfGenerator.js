const PDFDocument = require('pdfkit');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const moment = require('moment');

const width = 600;
const height = 300;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

async function generatePDF(expenses, from, to) {
  const doc = new PDFDocument();
  let buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  // Title
  doc.fontSize(18).text('Expense Report', { align: 'center' });
  doc.fontSize(12).text(`From: ${from} To: ${to}`, { align: 'center' });
  doc.moveDown();

  // Table Header
  doc.fontSize(14).text('Date', 50).text('Amount', 200).text('Description', 300);
  doc.moveDown();

  expenses.forEach(exp => {
    doc.fontSize(12)
      .text(moment(exp.date).format('DD MMM YYYY'), 50)
      .text(`₹${exp.amount}`, 200)
      .text(exp.description || '-', 300);
    doc.moveDown();
  });

  // If more than one month, show graph
  const uniqueMonths = new Set(
    expenses.map(exp => moment(exp.date).format('YYYY-MM'))
  );

  if (uniqueMonths.size > 1) {
    const monthly = {};
    expenses.forEach(exp => {
      const month = moment(exp.date).format('MMM YYYY');
      monthly[month] = (monthly[month] || 0) + exp.amount;
    });

    const labels = Object.keys(monthly);
    const data = Object.values(monthly);

    const barBuffer = await chartJSNodeCanvas.renderToBuffer({
      type: 'bar',
      data: {
        labels,
        datasets: [{ label: 'Monthly Expenses', data, backgroundColor: '#4e73df' }]
      }
    });

    doc.addPage().image(barBuffer, { fit: [500, 300], align: 'center' });
  }

  doc.end();

  return Buffer.concat(buffers);
}

module.exports = generatePDF;
