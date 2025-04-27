document.addEventListener("DOMContentLoaded", () => {
  if (typeof termanChartData === "undefined") return;

  const ctx = document.getElementById("chart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: termanChartData.labels,
      datasets: [
        {
          label: "Fluctuación",
          data: termanChartData.data,
          borderColor: "blue",
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
});
