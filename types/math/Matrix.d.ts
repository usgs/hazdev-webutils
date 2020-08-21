import { Vector } from './';

/**
 * Construct a new Matrix object.
 *
 * If m and n are omitted, Matrix is assumed to be square and
 * data length is used to compute size.
 *
 * If m or n are omitted, data length is used to compute omitted value.
 *
 * @param data
 *        matrix data.
 * @param m
 *        number of rows.
 * @param n
 *        number of columns.
 */
export class Matrix {

  constructor(data: number[], m: number, n: number);

  /**
   * Extract a column from this matrix.
   *
   * @param data
   *        matrix data.
   * @param m
   *        number of rows.
   * @param n
   *        number of columns.
   * @param col
   *        index of column, in range [0,n)
   * @throws Error if column out of range.
   * @return column elements.
   */
  static col(data: number[], m: number, n: number, col: number): number[];

  /**
   * Get array of elements on the diagonal.
   *
   * @param data
   *        matrix data.
   * @param m
   *        number of rows.
   * @param n
   *        number of columns.
   * @return elements on the diagonal.
   */
  static diagonal(data: number[], m: number, n: number): number[]

  /**
   * Get the value of an element of this matrix.
   *
   * @param data
   *        matrix data.
   * @param m
   *        number of rows.
   * @param n
   *        number of columns.
   * @param row
   *        row of element, in range [0,m)
   * @param col
   *        column of element, in range [0,n)
   * @throws Error if row or col are out of range.
   * @return value.
   */
  static get(data: number[], m: number, n: number, row: number, col: number): number;

  /**
   * Create an identity Matrix.
   *
   * @param n
   *        number of rows and columns.
   * @return identity matrix of size n.
   */
  static identity(n: number): number[];

  /**
   * Get the index of an element of this matrix.
   *
   * @param data
   *        matrix data.
   * @param m
   *        number of rows.
   * @param n
   *        number of columns.
   * @param row
   *        row of element, in range [0,m)
   * @param col
   *        column of element, in range [0,n)
   * @return index.
   */
  static index(data: number[], m: number, n: number, row: number, col: number): number;

  /**
   * Jacobi eigenvalue algorithm.
   *
   * Ported from:
   *     http://users-phys.au.dk/fedorov/nucltheo/Numeric/now/eigen.pdf
   *
   * An iterative method for eigenvalues and eigenvectors,
   * only works on symmetric matrices.
   *
   * @param data
   *        matrix data.
   * @param m
   *        number of rows.
   * @param n
   *        number of columns.
   * @param maxRotations
   *        maximum number of rotations.
   *        Optional, default 100.
   * @return array of eigenvectors, magnitude is eigenvalue.
   */
  static jacobi(data: number[], m: number, n: number, maxRotations: number): Vector[];

  /**
   * Multiply this matrix by another matrix.
   *
   * @param data1
   *        first matrix data.
   * @param m1
   *        number of rows in first matrix.
   * @param n1
   *        number of columns in first matrix.
   * @param data2
   *        second matrix data.
   * @param m2
   *        number of rows in second matrix.
   * @param n2
   *        number of columns in second matrix.
   * @throws Error if n1 !== m2
   * @return result of multiplication (original matrix is unchanged).
   */
  static multiply(
      data1: number[], m1: number, n1: number,
      data2: number[], m2: number, n2: number): number[];

  /**
   * Extract a row from this matrix.
   *
   * @param data
   *        matrix data.
   * @param m
   *        number of rows.
   * @param n
   *        number of columns.
   * @param row
   *        index of row, in range [0,m)
   * @throws Error if row out of range.
   * @return row elements.
   */
  static row(data: number[], m: number, n: number, row: number): number[];

  /**
   * Set the value of an element of this matrix.
   *
   * NOTE: this method modifies the contents of this matrix.
   *
   * @param data
   *        matrix data.
   * @param m
   *        number of rows.
   * @param n
   *        number of columns.
   * @param row
   *        row of element, in range [0,m)
   * @param col
   *        column of element, in range [0,n)
   * @param value
   *        value to set.
   * @throws Error if row or col are out of range.
   */
  static set(data: number[], m: number, n: number, row: number, col: number, value: number): void;

  /**
   * Display matrix as a string.
   *
   * @param data
   *        matrix data.
   * @param m
   *        number of rows.
   * @param n
   *        number of columns.
   * @return formatted matrix.
   */
  static stringify(data: number[], m: number, n: number): string;

  /**
   * Transpose this matrix.
   *
   * @param data
   *        matrix data.
   * @param m
   *        number of rows.
   * @param n
   *        number of columns.
   * @return transposed matrix (original matrix is unchanged).
   */
  static transpose(data: number[], m: number, n: number): number[];

  /**
   * Add matrices.
   *
   * @param that
   *        matrix to add.
   * @throws Error if dimensions do not match.
   * @return result of addition (original matrix is unchanged).
   */
  add(that: Matrix): Matrix;

  /**
   * Get a column from this matrix.
   *
   * @param col
   *        zero-based column index.
   * @return array containing elements from column.
   */
  col(col: number): number[]

  /**
   * Access the wrapped array.
   */
  data(): number[][];

  /**
   * Get the diagonal from this matrix.
   *
   * @return array containing elements from diagonal.
   */
  diagonal(): number[];

  /**
   * Get a value from this matrix.
   *
   * @param row
   *        zero-based index of row.
   * @param col
   *        zero-based index of column.
   * @return value at (row, col).
   */
  get(row: number, col: number): number;

  /**
   * Compute the eigenvectors of this matrix.
   *
   * NOTE: Matrix should be 3x3 and symmetric.
   *
   * @param maxRotations
   *        default 100.
   *        maximum number of iterations.
   * @return eigenvectors.
   *         Magnitude of each vector is eigenvalue.
   */
  jacobi(maxRotations: number): Vector[];

  /**
   * Get the number of rows in matrix.
   *
   * @return
   *         number of rows.
   */
  m(): number;

  /**
   * Multiply matrices.
   *
   * @param that
   *        matrix to multiply.
   * @return result of multiplication.
   */
  multiply(that: Matrix): Matrix;

  /**
   * Get number of columns in matrix.
   *
   * @return number of columns.
   */
  n(): number;

  /**
   * Multiply each element by -1.
   *
   * @return result of negation.
   */
  negative(): Matrix;

  /**
   * Get a row from this matrix.
   *
   * @param row
   *        zero-based index of row.
   * @return elements from row.
   */
  row(row: number): number[];

  /**
   * Set a value in this matrix.
   *
   * @param row
   *        zero-based row index.
   * @param col
   *        zero-based column index.
   * @param value
   *        value to set.
   */
  set(row: number, col: number, value: number): void;

  /**
   * Subtract another matrix from this matrix.
   *
   * @param that
   *        matrix to subtract.
   * @throws Error if dimensions do not match.
   * @return result of subtraction (original matrix is unchanged).
   */
  subtract(that: Matrix): Matrix;

  /**
   * Display matrix as a string.
   *
   * @return formatted matrix.
   */
  toString(): string;

  /**
   * Transpose matrix.
   *
   * Columns become rows, and rows become columns.
   *
   * @return result of transpose.
   */
  transpose(): Matrix;

}
