// graficaHartman.js - Script para la visualización de análisis Hartman
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar el gráfico
  initHartmanChart();

  // Configurar el botón de descarga PDF
  setupPDFDownload();
});

/**
 * Inicializa el gráfico de Hartman usando Chart.js
 */
function initHartmanChart() {
  const ctx = document.getElementById("chart").getContext("2d");

  // Acceder a los datos proporcionados por la variable hartmanData
  // Esta variable es definida en el archivo Pug antes de cargar este script
  const mundoInterno = hartmanData?.MundoInterno || {};
  const mundoExterno = hartmanData?.MundoExterno || {};
  const equilibrio = hartmanData?.Equilibrio || {};

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "Juicio de individualidad (DIM-I)",
        "Juicio Practico Concreto (DIM-E)",
        "Juicio Lógico Conceptual(DIM-S)",
        "Juicio en General(DIF)",
        "Sentido de proporcion(DIM)",
        "Aceptación del Mundo(DIM%)",
        "Cap- de Decisiones en rels(INT-I)",
        "Decisiones en aspectos practicos (INT-E)",
        "Decisiones en normas(INT-S)",
        "Capacidad de resolver problemas(INT)",
        "Control de impulsos(INT%)",
        "Capacidad de concentracion(D.I)",
        "Diferenciar el bien del mal (DIS)",
        "Sq1/Vq1",
        "Sq2/Vq2",
        "Balance entre valores internos y externos(BQr1)",
        "Bqr2",
        "Capacidad para valorar(BQa1)",
        "Bqa2",
        "Capacidades combinadas para valorar(CQ1)",
        "Cq2",
      ],
      datasets: [
        {
          label: "Mundo Interno",
          data: [
            mundoInterno.DimI,
            mundoInterno.DimE,
            mundoInterno.DimS,
            mundoInterno.DiF,
            mundoInterno.DimGeneral,
            mundoInterno.DimPorcentaje,
            mundoInterno.IntI,
            mundoInterno.IntE,
            mundoInterno.IntS,
            mundoInterno.IntGeneral,
            mundoInterno.IntPorcentaje,
            mundoInterno.Di,
            mundoInterno.Dis,
            mundoInterno.Sq1,
            mundoInterno.Sq2,
            null,
            null,
            null,
            null,
            null,
            null,
          ],
          borderColor: "rgba(70, 130, 180, 0.7)",
          backgroundColor: "rgba(70, 130, 180, 0.7)",
          fill: false,
          tension: 0,
          pointRadius: 3,
        },
        {
          label: "Mundo Externo",
          data: [
            mundoExterno.DimI,
            mundoExterno.DimE,
            mundoExterno.DimS,
            mundoExterno.DiF,
            mundoExterno.DimGeneral,
            mundoExterno.DimPorcentaje,
            mundoExterno.IntI,
            mundoExterno.IntE,
            mundoExterno.IntS,
            mundoExterno.IntGeneral,
            mundoExterno.IntPorcentaje,
            mundoExterno.Di,
            mundoExterno.Dis,
            mundoExterno.Vq1,
            mundoExterno.Vq2,
            null,
            null,
            null,
            null,
            null,
            null,
          ],
          borderColor: "rgba(135, 206, 235, 0.7)",
          backgroundColor: "rgba(135, 206, 235, 0.7)",
          fill: false,
          tension: 0,
          pointRadius: 3,
        },
        {
          label: "Equilibrio",
          data: [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            equilibrio.Bqr1,
            equilibrio.Bqr2,
            equilibrio.Bqa1,
            equilibrio.Bqa2,
            equilibrio.Cq1,
            equilibrio.Cq2,
          ],
          borderColor: "rgba(0, 0, 205, 0.7)",
          backgroundColor: "rgba(0, 0, 205, 0.7)",
          fill: false,
          tension: 0,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Gráfico: Análisis Hartman",
        },
        legend: {
          position: "bottom",
        },
        tooltip: {
          enabled: false,
        },
      },
      hover: {
        mode: null,
      },
      scales: {
        x: {
          display: true,
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            font: {
              weight: "bold",
            },
            color: "black",
          },
        },
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            callback: function (value) {
              if (value > 84) return "EXCELENTE";
              if (value >= 68) return "MUY SUPERIOR";
              if (value >= 52) return "BUENO";
              if (value >= 36) return "PROMEDIO";
              if (value >= 20) return "POBRE";
              return "MUY POBRE";
            },
            font: {
              weight: "bold",
            },
            color: "black",
          },
          grid: {
            drawTicks: true,
            drawBorder: true,
            display: true,
          },
          title: {
            display: true,
            text: "Nivel",
          },
        },
      },
    },
  });
}

/**
 * Configura la función de descarga de PDF
 */
function setupPDFDownload() {
  const generarPDFBtn = document.getElementById("generarPDF");

  if (generarPDFBtn) {
    generarPDFBtn.addEventListener("click", async () => {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("p", "pt", "a4");
      const elemento = document.querySelector("#loggin");

      // Scroll hasta arriba para evitar capturar desplazado
      window.scrollTo(0, 0);

      // Esperar un poco por si hay animaciones o gráficas que cargar
      setTimeout(() => {
        html2canvas(elemento, {
          scale: 2, // Mejora la calidad
          useCORS: true,
        }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save(`analisis_hartman.pdf`);
        });
      }, 300);
    });
  }
}
