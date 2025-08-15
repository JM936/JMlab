import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateEnsaioPDF = (ensaio) => {
  const doc = new jsPDF();
  
  // Cabeçalho
  doc.setFontSize(18);
  doc.text(`Relatório: ${ensaio.title}`, 15, 15);
  doc.setFontSize(12);
  doc.text(`Normas: ${ensaio.normas.join(', ')}`, 15, 25);

  // Tabela de equipamentos
  doc.autoTable({
    head: [['Equipamento', 'Especificações']],
    body: ensaio.equipamentos.map(item => [item.name, item.specs]),
    startY: 35
  });

  // Procedimentos
  doc.text('Procedimento:', 15, doc.lastAutoTable.finalY + 10);
  ensaio.procedimento.forEach((step, i) => {
    doc.text(`${i + 1}. ${step}`, 20, doc.lastAutoTable.finalY + 15 + (i * 7));
  });

  // Salvar
  doc.save(`ensaio_${ensaio.id}.pdf`);
};