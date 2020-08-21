import { CameraOptions } from './';

/**
 * Camera defines a coordinate translation from World coordinates (X, Y, Z)
 * to Camera coordinates (x, y, z).
 *
 * After projection:
 *     +z is to lookAt from camera
 *     +x is right from camera
 *     +y is up from camera
 */
export class Camera {

  constructor(options: CameraOptions);

  /**
   * Project a point from world coordinates to camera coordinates.
   *
   * @param world
   *        x, y, z world coordinates.
   * @return
   *        x, y, z, camera coordinates.
   */
  project(world: number[]): number[];

}
