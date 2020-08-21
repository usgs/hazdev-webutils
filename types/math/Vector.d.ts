
/**
 * A vector object that wraps an array.
 *
 * This is a convenience object to call the static methods on the wrapped array.
 * Only the methods x(), y(), and z() modify data; other methods return new
 * Vector objects without modifying the existing object.
 *
 * @param data
 *        array to wrap.
 */
export class Vector {

  constructor(data: number[]);

  /**
   * Add two vectors.
   *
   * @param v1
   *        the first vector.
   * @param v2
   *        the second vector.
   * @return
   *         result of addition.
   * @throws when vectors are different lengths.
   */
  static add(v1: number[], v2: number[]): number[];

  /**
   * Compute the angle between two vectors.
   *
   * @param v1
   *        the first vector.
   * @param v2
   *        the second vector.
   * @return
   *         angle between vectors in radians.
   */
  static angle(v1: number[], v2: number[]): number;

  /**
   * Compute the azimuth of a vector.
   *
   * @param v1
   *        the first vector.
   * @param v2
   *        the second vector.
   * @return
   *         angle between vectors in radians.
   */
  static azimuth(v1: number[]): number;

  /**
   * Compute vector cross product.
   *
   * Note: only computes cross product in 3 dimensions.
   *
   * @param v1
   *        the first vector.
   * @param v2
   *        the second vector.
   * @return
   *         the 3 dimensional cross product.
   *         the resulting vector follows the right-hand rule: if the fingers on
   *         your right hand point to v1, and you close your hand to get to v2,
   *         the resulting vector points in the direction of your thumb.
   */
  static cross(v1: number[], v2: number[]): number[];

  /**
   * Compute vector dot product.
   *
   * @param v1
   *        the first vector.
   * @param v2
   *        the second vector.
   * @return
   *         the dot product.
   */
  static dot(v1: number[], v2: number[]): number;

  /**
   * Check if two vectors are equal.
   *
   * @param v1
   *        the first vector.
   * @param v2
   *        the second vector.
   * @return
   *         true if vectors are same length and all elements are equal.
   */
  static equals(v1: number[], v2: number[]): boolean;

  /**
   * Compute length of vector.
   *
   * @param v1
   *        vector.
   * @return
   *         magnitude of vector.
   */
  static magnitude(v1: number[]): number;

  /**
   * Multiply vector by a constant.
   *
   * @param v1
   *        vector to multiply.
   * @param n
   *        number to multiply by.
   * @return
   *         result of multiplication.
   */
  static multiply(v1: number[], n: number): number[];

  /**
   * Compute angle from plane z=0 to vector.
   *
   * @param v
   *        the vector.
   * @return
   *         angle from plane z=0 to vector.
   *         angle is positive when z > 0, negative when z < 0.
   */
  static plunge(v: number[]): number;

  /**
   * Rotate a vector around an axis.
   *
   * From "6.2 The normalized matrix for rotation about an arbitrary line",
   *      http://inside.mines.edu/~gmurray/ArbitraryAxisRotation/
   *
   * @param v1
   *        the "point" to rotate.
   * @param axis
   *        direction vector of rotation axis.
   * @param theta
   *        angle of rotation in radians.
   * @param origin
   *        default [0, 0, 0].
   *        origin of axis of rotation.
   */
  static rotate(v1: number[], axis: number[], theta: number, origin: number[]): number[];

  /**
   * Subtract two vectors.
   *
   * @param v1
   *        the first vector.
   * @param v2
   *        the vector to subtract.
   * @return
   *         result of subtraction.
   * @throws {Error} when vectors are different lengths.
   */
  static subtract(v1: number[], v2: number): number[];

  /**
   * Convert vector to length 1.
   *
   * Same as __multiply(v1, 1 / __magnitude(v1))
   *
   * @param v1
   *        the vector.
   * @return
   *         vector converted to length 1.
   * @throws {Error} if vector magnitude is 0.
   */
  static unit(v1: number[]): number[];

  /**
   * Get, and optionally set, the x component of a vector.
   *
   * @param v
   *        the vector.
   * @param value
   *        default undefined.
   *        when defined, set x component.
   * @return
   *         the x component.
   */
  static x(v: number[], value: number): number;

  /**
   * Get, and optionally set, the y component of a vector.
   *
   * @param v
   *        the vector.
   * @param value
   *        default undefined.
   *        when defined, set y component.
   * @return
   *         the y component.
   */
  static y(v: number[], value: number): number;

  /**
   * Get, and optionally set, the z component of a vector.
   *
   * @param v
   *        the vector.
   * @param value
   *        default undefined.
   *        when defined, set z component.
   * @return
   *         the z component.
   */
  static z(v: number[], value: number): number;


  /**
   * Add two vectors.
   *
   * @param that
   *        vector to add.
   * @return
   *         result of addition.
   */
  add(that: Vector | number[]): Vector;

  /**
   * Compute angle between vectors.
   *
   * @param that
   *        vector to compute angle between.
   * @return angle between vectors in radians.
   */
  angle(that: Vector | number[]): number;

  /**
   * Compute azimuth of this vector.
   *
   * @return azimuth of this vector in radians.
   */
  azimuth(): number;

  /**
   * Compute the cross product between vectors.
   *
   * @param that
   *        the vector to cross.
   * @return result of the cross product.
   */
  cross(that: Vector | number[]): Vector;

  /**
   * Access the wrapped array.
   *
   * @return
   *         the wrapped array.
   */
  data(): number[];

  /**
   * Compute dot product between vectors.
   *
   * @param that
   *        vector to dot.
   * @return result of dot product.
   */
  dot(that: Vector | number[]): number;

  /**
   * Check if two vectors are equal.
   *
   * @param that
   *        vector to compare.
   * @return true if equal, false otherwise.
   */
  equals(that: Vector | number[]): boolean;

  /**
   * Compute length of this vector.
   *
   * @return length of vector.
   *         Square root of the sum of squares of all components.
   */
  magnitude(): number;

  /**
   * Multiply this vector by a number.
   *
   * @param n
   *        number to multiply.
   * @return result of multiplication.
   */
  multiply(n: number): Vector;

  /**
   * Same as multiply(-1).
   */
  negative(): Vector;

  /**
   * Compute plunge of this vector.
   *
   * Plunge is the angle between this vector and the plane z=0.
   *
   * @return plunge in radians.
   *         positive when z>0, negative when z<0.
   */
  plunge(): number;

  /**
   * Rotate this vector around an arbitrary axis.
   *
   * @param axis
   *        direction of axis of rotation.
   * @param theta
   *        angle of rotation in radians.
   * @param origin
   *        origin of axis of rotation.
   * @return result of rotation.
   */
  rotate(axis: Vector | number[], theta: number, origin: Vector | number[]): Vector;

  /**
   * Subtract another vector.
   *
   * @param that
   *        vector to subtract.
   * @return result of subtraction.
   */
  subtract(that: Vector | number[]): Vector;

  /**
   * Convert vector to string.
   *
   * @return wrapped array converted to string.
   */
  toString(): string;

  /**
   * Convert this vector to length 1.
   *
   * @return vector / |vector|.
   */
  unit(): Vector;

  /**
   * Get or set x component.
   *
   * @param value
   *        when defined, set x component to value.
   * @return x component value.
   */
  x(value: number): number;

  /**
   * Get or set y component.
   *
   * @param value
   *        when defined, set y component to value.
   * @return y component value.
   */
  y(value: number): number;

  /**
   * Get or set z component.
   *
   * @param value
   *        when defined, set z component to value.
   * @return z component value.
   */
  z(value: number): number;

}
