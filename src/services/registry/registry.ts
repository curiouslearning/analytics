/**
 * Notes: Can be reused with SceneHandler.
 * TODO: move to utility project.
 */
export class Registry<T> {
  registry: Record<string, T> = {};

  register(key: string, item: T) {
    this.registry[key] = item;
  }

  unregister(key: string) {
    delete this.registry[key];
  }
}