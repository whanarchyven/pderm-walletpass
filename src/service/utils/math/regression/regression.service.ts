export class RegressionService {
  /**
   * Определение коэфициента (r^2) апроксимации
   * из наблюдения и прогнозов
   **/
  determinationCoefficient(data: number[][], results: number[][]) {
    const predictions = [] as number[][];
    const observations = [] as number[][];

    data.forEach((d, i) => {
      if (d[1] !== null) {
        observations.push(d);
        predictions.push(results[i]);
      }
    });

    const sum = observations.reduce((a, observation) => a + observation[1], 0);
    const mean = sum / observations.length;

    const ssyy = observations.reduce((a, observation) => {
      const difference = observation[1] - mean;
      return a + difference * difference;
    }, 0);

    const sse = observations.reduce((accum, observation, index) => {
      const prediction = predictions[index];
      const residual = observation[1] - prediction[1];
      return accum + residual * residual;
    }, 0);

    return 1 - sse / ssyy;
  }
  /**
   * Решение СЛАУ вида A * x = b с использованием
   * элиминации Гаусса
   */
  gaussianElimination(input, order) {
    const matrix = input;
    const n = input.length - 1;
    const coefficients = [order];

    for (let i = 0; i < n; i++) {
      let maxrow = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(matrix[i][j]) > Math.abs(matrix[i][maxrow])) {
          maxrow = j;
        }
      }

      for (let k = i; k < n + 1; k++) {
        const tmp = matrix[k][i];
        matrix[k][i] = matrix[k][maxrow];
        matrix[k][maxrow] = tmp;
      }

      for (let j = i + 1; j < n; j++) {
        for (let k = n; k >= i; k--) {
          matrix[k][j] -= (matrix[k][i] * matrix[i][j]) / matrix[i][i];
        }
      }
    }

    for (let j = n - 1; j >= 0; j--) {
      let total = 0;
      for (let k = j + 1; k < n; k++) {
        total += matrix[k][j] * coefficients[k];
      }

      coefficients[j] = (matrix[n][j] - total) / matrix[j][j];
    }

    return coefficients;
  }

  /**
   * Округление до нужной точности
   */
  round(number, precision) {
    const factor = 10 ** precision;
    return Math.round(number * factor) / factor;
  }

  linear(data, options) {
    const sum = [0, 0, 0, 0, 0];
    let len = 0;

    for (let n = 0; n < data.length; n++) {
      if (data[n][1] !== null) {
        len++;
        sum[0] += data[n][0];
        sum[1] += data[n][1];
        sum[2] += data[n][0] * data[n][0];
        sum[3] += data[n][0] * data[n][1];
        sum[4] += data[n][1] * data[n][1];
      }
    }

    const run = len * sum[2] - sum[0] * sum[0];
    const rise = len * sum[3] - sum[0] * sum[1];
    const gradient = run === 0 ? 0 : this.round(rise / run, options.precision);
    const intercept = this.round(
      sum[1] / len - (gradient * sum[0]) / len,
      options.precision
    );

    const predict = (x) => [
      this.round(x, options.precision),
      this.round(gradient * x + intercept, options.precision),
    ];

    const points = data.map((point) => predict(point[0]));

    return {
      points,
      predict,
      equation: [gradient, intercept],
      r2: this.round(
        this.determinationCoefficient(data, points),
        options.precision
      ),
      string:
        intercept === 0
          ? `y = ${gradient}x`
          : `y = ${gradient}x + ${intercept}`,
    };
  }

  exponential(data, options) {
    const sum = [0, 0, 0, 0, 0, 0];

    for (let n = 0; n < data.length; n++) {
      if (data[n][1] !== null) {
        sum[0] += data[n][0];
        sum[1] += data[n][1];
        sum[2] += data[n][0] * data[n][0] * data[n][1];
        sum[3] += data[n][1] * Math.log(data[n][1]);
        sum[4] += data[n][0] * data[n][1] * Math.log(data[n][1]);
        sum[5] += data[n][0] * data[n][1];
      }
    }

    const denominator = sum[1] * sum[2] - sum[5] * sum[5];
    const a = Math.exp((sum[2] * sum[3] - sum[5] * sum[4]) / denominator);
    const b = (sum[1] * sum[4] - sum[5] * sum[3]) / denominator;
    const coeffA = this.round(a, options.precision);
    const coeffB = this.round(b, options.precision);
    const predict = (x) => [
      this.round(x, options.precision),
      this.round(coeffA * Math.exp(coeffB * x), options.precision),
    ];

    const points = data.map((point) => predict(point[0]));

    return {
      points,
      predict,
      equation: [coeffA, coeffB],
      string: `y = ${coeffA}e^(${coeffB}x)`,
      r2: this.round(
        this.determinationCoefficient(data, points),
        options.precision
      ),
    };
  }

  logarithmic(data, options) {
    const sum = [0, 0, 0, 0];
    const len = data.length;

    for (let n = 0; n < len; n++) {
      if (data[n][1] !== null) {
        sum[0] += Math.log(data[n][0]);
        sum[1] += data[n][1] * Math.log(data[n][0]);
        sum[2] += data[n][1];
        sum[3] += Math.log(data[n][0]) ** 2;
      }
    }

    const a =
      (len * sum[1] - sum[2] * sum[0]) / (len * sum[3] - sum[0] * sum[0]);
    const coeffB = this.round(a, options.precision);
    const coeffA = this.round(
      (sum[2] - coeffB * sum[0]) / len,
      options.precision
    );

    const predict = (x) => [
      this.round(x, options.precision),
      this.round(
        this.round(coeffA + coeffB * Math.log(x), options.precision),
        options.precision
      ),
    ];

    const points = data.map((point) => predict(point[0]));

    return {
      points,
      predict,
      equation: [coeffA, coeffB],
      string: `y = ${coeffA} + ${coeffB} ln(x)`,
      r2: this.round(
        this.determinationCoefficient(data, points),
        options.precision
      ),
    };
  }

  power(data, options) {
    const sum = [0, 0, 0, 0, 0];
    const len = data.length;

    for (let n = 0; n < len; n++) {
      if (data[n][1] !== null) {
        sum[0] += Math.log(data[n][0]);
        sum[1] += Math.log(data[n][1]) * Math.log(data[n][0]);
        sum[2] += Math.log(data[n][1]);
        sum[3] += Math.log(data[n][0]) ** 2;
      }
    }

    const b = (len * sum[1] - sum[0] * sum[2]) / (len * sum[3] - sum[0] ** 2);
    const a = (sum[2] - b * sum[0]) / len;
    const coeffA = this.round(Math.exp(a), options.precision);
    const coeffB = this.round(b, options.precision);

    const predict = (x) => [
      this.round(x, options.precision),
      this.round(
        this.round(coeffA * x ** coeffB, options.precision),
        options.precision
      ),
    ];

    const points = data.map((point) => predict(point[0]));

    return {
      points,
      predict,
      equation: [coeffA, coeffB],
      string: `y = ${coeffA}x^${coeffB}`,
      r2: this.round(
        this.determinationCoefficient(data, points),
        options.precision
      ),
    };
  }

  polynomial(data, options) {
    const lhs = [] as number[];
    const rhs = [] as number[][];
    let a = 0;
    let b = 0;
    const len = data.length;
    const k = options.order + 1;

    for (let i = 0; i < k; i++) {
      for (let l = 0; l < len; l++) {
        if (data[l][1] !== null) {
          a += data[l][0] ** i * data[l][1];
        }
      }

      lhs.push(a);
      a = 0;

      const c = [] as number[];
      for (let j = 0; j < k; j++) {
        for (let l = 0; l < len; l++) {
          if (data[l][1] !== null) {
            b += data[l][0] ** (i + j);
          }
        }
        c.push(b);
        b = 0;
      }
      rhs.push(c);
    }
    rhs.push(lhs);

    const coefficients = this.gaussianElimination(rhs, k).map((v) =>
      this.round(v, options.precision)
    );

    const predict = (x) => [
      this.round(x, options.precision),
      this.round(
        coefficients.reduce((sum, coeff, power) => sum + coeff * x ** power, 0),
        options.precision
      ),
    ];

    const points = data.map((point) => predict(point[0]));

    let string = "y = ";
    for (let i = coefficients.length - 1; i >= 0; i--) {
      if (i > 1) {
        string += `${coefficients[i]}x^${i} + `;
      } else if (i === 1) {
        string += `${coefficients[i]}x + `;
      } else {
        string += coefficients[i];
      }
    }

    return {
      string,
      points,
      predict,
      equation: [...coefficients].reverse(),
      r2: this.round(
        this.determinationCoefficient(data, points),
        options.precision
      ),
    };
  }
}
