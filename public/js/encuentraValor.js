/**
 * Función para encontrar los resultados de
 * Hartman dentro de los arreglos, para poder
 * generar la gráfica
 */
function buscarValor(valor, matriz) {
  for (let i = 0; i < matriz.length; i++) {
    const [min, max, resultado] = matriz[i];
    if (valor >= min && valor <= max + 0.0000001) {
      //  Añade una tolerancia pequeña
      return resultado;
    }
  }
  return 0;
}

const DIM = [
  [0, 0.9, 100],
  [1, 1.9, 97.62],
  [2, 2.9, 95.24],
  [3, 3.9, 92.86],
  [4, 4.9, 90.48],
  [5, 5.9, 88.1],
  [6, 6.9, 85.72],
  [7, 7.9, 83.34],
  [8, 8.9, 80.96],
  [9, 9.9, 78.58],
  [10, 10.9, 76.2],
  [11, 11.9, 73.82],
  [12, 12.9, 71.44],
  [13, 13.9, 69.06],
  [14, 14.9, 66.68],
  [15, 15.9, 64.3],
  [16, 16.9, 61.92],
  [17, 17.9, 59.54],
  [18, 18.9, 57.16],
  [19, 19.9, 54.78],
  [20, 20.9, 52.4],
  [21, 21.9, 50.02],
  [22, 22.9, 47.64],
  [23, 23.9, 45.26],
  [24, 24.9, 42.88],
  [25, 25.9, 40.5],
  [26, 26.9, 38.12],
  [27, 27.9, 35.74],
  [28, 28.9, 33.36],
  [29, 29.9, 30.98],
  [30, 30.9, 28.6],
  [31, 31.9, 26.22],
  [32, 32.9, 23.84],
  [33, 33.9, 21.46],
  [34, 34.9, 19.08],
  [35, 35.9, 16.7],
  [36, 36.9, 14.32],
  [37, 37.9, 11.94],
  [38, 38.9, 9.56],
  [39, 39.9, 7.18],
  [40, 40.9, 4.8],
  [41, 41.9, 2.42],
  [42, 99.9, 0.04],
];

const DIF = [
  [0, 22.9, 100],
  [23, 24.9, 96.67],
  [25, 26.9, 93.34],
  [27, 28.9, 90.01],
  [29, 30.9, 86.68],
  [31, 32.9, 83.35],
  [33, 34.9, 80.02],
  [35, 36.9, 76.69],
  [37, 38.9, 73.36],
  [39, 40.9, 70.03],
  [41, 42.9, 66.7],
  [43, 44.9, 63.37],
  [45, 46.9, 60.04],
  [47, 48.9, 56.71],
  [49, 50.9, 53.38],
  [51, 52.9, 50.05],
  [53, 54.9, 46.72],
  [55, 56.9, 43.39],
  [57, 58.9, 40.06],
  [59, 60.9, 36.73],
  [61, 62.9, 33.4],
  [63, 64.9, 30.07],
  [65, 66.9, 26.74],
  [67, 68.9, 23.41],
  [69, 70.9, 20.08],
  [71, 72.9, 16.75],
  [73, 74.9, 13.42],
  [75, 76.9, 10.09],
  [77, 78.9, 6.76],
  [79, 80.9, 3.43],
  [81, 99.9, 0],
];

const dimGeneral = [
  [0, 0.9, 100],
  [1, 1.9, 95.66],
  [2, 2.9, 91.32],
  [3, 3.9, 86.98],
  [4, 4.9, 82.64],
  [5, 5.9, 78.3],
  [6, 6.9, 73.96],
  [7, 7.9, 69.62],
  [8, 8.9, 65.28],
  [9, 9.9, 60.94],
  [10, 10.9, 56.6],
  [11, 11.9, 52.26],
  [12, 12.9, 47.92],
  [13, 13.9, 43.58],
  [14, 14.9, 39.24],
  [15, 15.9, 34.9],
  [16, 16.9, 30.56],
  [17, 17.9, 26.22],
  [18, 18.9, 21.88],
  [19, 19.9, 17.54],
  [20, 20.9, 13.2],
  [21, 21.9, 8.86],
  [22, 22.9, 4.52],
  [23, 23.9, 0.18],
  [24, 100, 0],
];

const dimPorcentaje = [
  [0, 2.9, 100],
  [3, 4.9, 96.67],
  [5, 6.9, 93.34],
  [7, 8.9, 90.01],
  [9, 10.9, 86.68],
  [11, 12.9, 83.35],
  [13, 14.9, 80.02],
  [15, 16.9, 76.69],
  [17, 18.9, 73.36],
  [19, 20.9, 70.03],
  [21, 22.9, 66.7],
  [23, 24.9, 63.37],
  [25, 26.9, 60.04],
  [27, 28.9, 56.71],
  [29, 30.9, 53.38],
  [31, 32.9, 50.05],
  [33, 34.9, 46.72],
  [35, 36.9, 43.39],
  [37, 38.9, 40.06],
  [39, 40.9, 36.73],
  [41, 42.9, 33.4],
  [43, 44.9, 30.07],
  [45, 46.9, 26.74],
  [47, 48.9, 23.41],
  [49, 50.9, 20.08],
  [51, 52.9, 16.75],
  [53, 54.9, 13.42],
  [55, 56.9, 10.09],
  [57, 58.9, 6.76],
  [59, 60.9, 3.43],
  [61, 99.9, 0],
];

const INT = [
  [0, 0.9, 95],
  [1, 1.9, 79],
  [2, 2.9, 76.62],
  [3, 3.9, 74.24],
  [4, 4.9, 71.86],
  [5, 5.9, 69.48],
  [6, 6.9, 67.1],
  [7, 7.9, 64.72],
  [8, 8.9, 62.34],
  [9, 9.9, 59.96],
  [10, 10.9, 57.58],
  [11, 11.9, 55.2],
  [12, 12.9, 52.82],
  [13, 13.9, 50.44],
  [14, 14.9, 48.06],
  [15, 15.9, 45.68],
  [16, 16.9, 43.3],
  [17, 17.9, 40.92],
  [18, 18.9, 38.54],
  [19, 19.9, 36.16],
  [20, 20.9, 33.78],
  [21, 21.9, 31.4],
  [22, 22.9, 29.02],
  [23, 23.9, 26.64],
  [24, 24.9, 24.26],
  [25, 25.9, 21.88],
  [26, 26.9, 19.5],
  [27, 27.9, 17.12],
  [28, 28.9, 14.74],
  [29, 29.9, 12.36],
  [30, 30.9, 9.98],
  [31, 31.9, 7.6],
  [32, 32.9, 5.22],
  [33, 33.9, 2.84],
  [34, 100, 0],
];

const DI = [
  [0, 0.9, 100],
  [1, 1.9, 96],
  [2, 2.9, 91],
  [3, 3.9, 87],
  [4, 4.9, 83],
  [5, 5.9, 79],
  [6, 6.9, 74],
  [7, 7.9, 70],
  [8, 8.9, 66],
  [9, 9.9, 61],
  [10, 10.9, 57],
  [11, 11.9, 53],
  [12, 12.9, 48],
  [13, 13.9, 44],
  [14, 14.9, 40],
  [15, 15.9, 36],
  [16, 16.9, 31],
  [17, 17.9, 27],
  [18, 18.9, 23],
  [19, 19.9, 18],
  [20, 20.9, 14],
  [21, 21.9, 10],
  [22, 22.9, 5],
  [23, 23.9, 1],
  [24, 100, 0],
];

const DIS = [
  [0, 1.9, 93],
  [2, 3.9, 60],
  [4, 5.9, 40],
  [6, 10.9, 8],
];

const VQ = [
  [0, 1.9, 100],
  [2, 10.9, 98],
  [11, 19.9, 95],
  [20, 28.9, 93],
  [29, 37.9, 90],
  [38, 46.9, 88],
  [47, 55.9, 86],
  [56, 56.9, 83],
  [57, 58.9, 81],
  [59, 60.9, 79],
  [61, 63.9, 76],
  [64, 66.9, 74],
  [67, 68.9, 71],
  [69, 70.9, 69],
  [71, 71.9, 67],
  [72, 73.9, 64],
  [74, 75.9, 62],
  [76, 78.9, 60],
  [79, 81.9, 57],
  [82, 83.9, 55],
  [84, 85.9, 52],
  [86, 86.9, 50],
  [87, 88.9, 48],
  [89, 90.9, 45],
  [91, 93.9, 43],
  [94, 96.9, 41],
  [97, 98.9, 38],
  [99, 100.9, 36],
  [101, 101.9, 33],
  [102, 103.9, 31],
  [104, 105.9, 29],
  [106, 108.9, 26],
  [109, 111.9, 24],
  [112, 113.9, 21],
  [114, 115.9, 19],
  [116, 116.9, 17],
  [117, 118.9, 14],
  [119, 120.9, 12],
  [121, 123.9, 10],
  [124, 126.9, 7],
  [127, 128.9, 5],
  [129, 130.9, 2],
  [131, 199, 0],
];

const Equilibrio_BQR = [
  [0.0, 0.1, 100],
  [0.2, 0.7, 97],
  [0.8, 1.1, 93],
  [1.2, 1.5, 90],
  [1.6, 1.6, 87],
  [1.7, 1.7, 83],
  [1.8, 1.8, 80],
  [1.9, 1.9, 77],
  [2, 2.0, 73],
  [2.1, 2.1, 70],
  [2.2, 2.2, 67],
  [2.3, 2.3, 63],
  [2.4, 2.4, 60],
  [2.5, 2.5, 57],
  [2.6, 2.6, 53],
  [2.7, 2.7, 50],
  [2.8, 2.8, 47],
  [2.9, 2.9, 43],
  [3.0, 3.0, 40],
  [3.1, 3.1, 37],
  [3.2, 3.2, 33],
  [3.3, 3.3, 30],
  [3.4, 3.4, 27],
  [3.5, 3.5, 23],
  [3.6, 3.6, 20],
  [3.7, 3.7, 17],
  [3.8, 3.8, 13],
  [3.9, 3.9, 10],
  [4.0, 4.9, 7],
  [5, 6.9, 3],
  [7, 50, 0],
];

const Equilibrio_BQA = [
  [0, 1.9, 100],
  [2, 10.9, 98],
  [11, 19.9, 95],
  [20, 28.9, 93],
  [29, 37.9, 90],
  [38, 46.9, 88],
  [47, 55.9, 86],
  [56, 56.9, 83],
  [57, 58.9, 81],
  [59, 60.9, 79],
  [61, 63.9, 76],
  [64, 66.9, 74],
  [67, 68.9, 71],
  [69, 70.9, 69],
  [71, 71.9, 67],
  [72, 73.9, 64],
  [74, 75.9, 62],
  [76, 78.9, 60],
  [79, 81.9, 57],
  [82, 83.9, 55],
  [84, 85.9, 52],
  [86, 86.9, 50],
  [87, 88.9, 48],
  [89, 90.9, 45],
  [91, 93.9, 43],
  [94, 96.9, 41],
  [97, 98.9, 38],
  [99, 100.9, 36],
  [101, 101.9, 33],
  [102, 103.9, 31],
  [104, 105.9, 29],
  [106, 108.9, 26],
  [109, 111.9, 24],
  [112, 113.9, 21],
  [114, 115.9, 19],
  [116, 116.9, 17],
  [117, 118.9, 14],
  [119, 120.9, 12],
  [121, 123.9, 10],
  [124, 126.9, 7],
  [127, 128.9, 5],
  [129, 130.9, 2],
  [131, 200, 0],
];

const Equilibrio_CQ1 = [
  [0, 1.9, 100],
  [2, 14.9, 98],
  [15, 28.9, 95],
  [29, 42.9, 93],
  [43, 56.9, 90],
  [57, 70.9, 88],
  [71, 83.9, 86],
  [84, 90.9, 83],
  [91, 98.9, 81],
  [99, 106.9, 79],
  [107, 115.9, 76],
  [116, 124.9, 74],
  [125, 132.9, 71],
  [133, 140.9, 69],
  [141, 149.9, 67],
  [150, 159.9, 64],
  [160, 170.9, 62],
  [171, 181.9, 60],
  [182, 191.9, 57],
  [192, 202.9, 55],
  [203, 213.9, 52],
  [214, 224.9, 50],
  [225, 236.9, 48],
  [237, 249.9, 45],
  [250, 262.9, 43],
  [263, 275.9, 41],
  [276, 288.9, 38],
  [289, 300.9, 36],
  [301, 313.9, 33],
  [314, 328.9, 31],
  [329, 343.9, 29],
  [344, 358.9, 26],
  [359, 373.9, 24],
  [374, 388.9, 21],
  [389, 403.9, 19],
  [404, 418.9, 17],
  [419, 435.9, 14],
  [436, 452.9, 12],
  [453, 469.9, 10],
  [470, 486.9, 7],
  [487, 503.9, 5],
  [504, 508.9, 2],
  [509, 999.9, 0],
];

const Equilibrio_CQ2 = [
  [0, 1.9, 100],
  [2, 3.9, 98],
  [4, 5.9, 95],
  [6, 7.9, 93],
  [8, 8.9, 90],
  [9, 11.9, 88],
  [12, 13.9, 86],
  [14, 16.9, 83],
  [17, 18.9, 81],
  [19, 21.9, 79],
  [22, 24.9, 76],
  [25, 26.9, 74],
  [27, 28.9, 71],
  [29, 32.9, 69],
  [33, 35.9, 67],
  [36, 38.9, 64],
  [39, 42.9, 62],
  [43, 45.9, 60],
  [46, 49.9, 57],
  [50, 53.9, 55],
  [54, 57.9, 52],
  [58, 62.9, 50],
  [63, 66.9, 48],
  [67, 71.9, 45],
  [72, 75.9, 43],
  [76, 80.9, 41],
  [81, 84.9, 38],
  [85, 90.9, 36],
  [91, 95.9, 33],
  [96, 101.9, 31],
  [102, 106.9, 29],
  [107, 112.9, 26],
  [113, 117.9, 24],
  [118, 123.9, 21],
  [124, 130.9, 19],
  [131, 137.9, 17],
  [138, 143.9, 14],
  [144, 149.9, 12],
  [150, 155.9, 10],
  [156, 162.9, 7],
  [163, 180.9, 5],
  [181, 187.9, 2],
  [188, 200.9, 0],
];

module.exports = {
  buscarValor,
  DIM,
  DIF,
  dimGeneral,
  dimPorcentaje,
  INT,
  DI,
  DIS,
  VQ,
  Equilibrio_BQR,
  Equilibrio_BQA,
  Equilibrio_CQ1,
  Equilibrio_CQ2,
};
