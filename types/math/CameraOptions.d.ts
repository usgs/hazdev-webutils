
/**
 * origin:
 *        default [100, 100, 100].
 *        position of camera in world coordinates.
 *
 * lookAt:
 *        default [0, 0, 0].
 *        position for camera to look at in world coordinates.
 *
 * up:
 *        default [0, 0, 1].
 *        vector pointing up in world coordinates.
 */
export interface CameraOptions {
  origin: number[];
  lookAt: number[];
  up: number;
}
