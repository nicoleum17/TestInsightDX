document.addEventListener('DOMContentLoaded', () => {
  if (!resultadosTerman) {
      console.error("No se encontraron resultados de Terman.");
      return;
  }

  renderizarGrafica(resultadosTerman);
  configurarBotonPDF();
});

function renderizarGrafica(resultados) {
  const ctx = document.getElementById('chart').getContext('2d');

  const coloresFondo = [
      'rgba(255, 99, 132, 0.8)',  
      'rgba(54, 162, 235, 0.8)',  
      'rgba(255, 206, 86, 0.8)', 
      'rgba(75, 192, 192, 0.8)',  
      'rgba(153, 102, 255, 0.8)', 
      'rgba(255, 159, 64, 0.8)',  
      'rgba(0, 128, 0, 0.8)',   
      'rgba(0, 0, 255, 0.8)',     
      'rgba(128, 0, 128, 0.8)',    
      'rgba(255, 215, 0, 0.8)'
  ];

  const coloresBorde = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(0, 128, 0, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(128, 0, 128, 1)',
      'rgba(255, 215, 0, 1)'
  ];

  const chartData = {
      labels: resultados.map(r => r.categoria),
      datasets: [{
          label: 'Porcentaje',
          data: resultados.map(r => parseFloat(r.porcentaje.toFixed(2))), // Aseguramos números reales
          backgroundColor: coloresFondo,
          borderColor: coloresBorde,
          borderWidth: 2
      }]
  };

  const chartOptions = {
      scales: {
          y: {
              beginAtZero: true,
              max: 100
          }
      },
      plugins: {
          legend: {
              display: false
          }
      }
  };

  new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: chartOptions
  });
}

function configurarBotonPDF() {
  const boton = document.getElementById('generarPDF');
  if (boton) {
      boton.addEventListener('click', generarPDF);
  } else {
      console.error('Botón "generarPDF" no encontrado.');
  }
}

async function generarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'pt', 'a4');
  const contenido = document.getElementById('Terman');

  // 🔥 Obtener nombre desde h3 con ID
  const nombreElemento = document.getElementById('nombre-aspirante');
  let nombreAspirante = nombreElemento ? nombreElemento.innerText.trim() : 'aspirante';

  // 🔒 Limpiar: eliminar tildes y símbolos raros
  nombreAspirante = nombreAspirante
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita tildes
      .replace(/[^a-zA-Z0-9_\-]/g, '_') // reemplaza caracteres raros por "_"
      .substring(0, 30); // máximo 30 caracteres

  await html2canvas(contenido, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
      }

      const nombreArchivo = `analisis_terman_${nombreAspirante}.pdf`;
      doc.save(nombreArchivo);
  });
}