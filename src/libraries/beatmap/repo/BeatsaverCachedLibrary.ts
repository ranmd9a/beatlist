import {
  BeatsaverKey,
  BeatsaverKeyType,
  toStrKey,
} from "@/libraries/beatmap/repo/BeatsaverKeyType";
import {
  BeatsaverItem,
  BeatsaverItemInvalid,
  BeatsaverItemValid,
} from "@/libraries/beatmap/repo/BeatsaverItem";
import store from "@/plugins/store";

export default class BeatsaverCachedLibrary {
  public static Add(hash: string, item: BeatsaverItemValid) {
    store.commit("beatmap/setBeatsaverCached", { hash, item });
  }

  public static AddAll(
    items: {
      key: BeatsaverKey;
      item: BeatsaverItem;
    }[]
  ) {
    store.commit("beatmap/addAllBeatsaverCached", { items });
  }

  public static AddInvalid(key: BeatsaverKey, item: BeatsaverItemInvalid) {
    store.commit("beatmap/addBeatsaverCachedInvalid", { key, item });
  }

  public static async LoadAll() {
    // store.commit("beatmap/loadBeatmaps", { path });
    store
      .dispatch("beatmap/loadBeatmapsAsCache")
      .then(() => {
        return Promise.resolve();
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  public static Exist(key: BeatsaverKey) {
    return BeatsaverCachedLibrary.Get(key) !== undefined;
  }

  public static GetByKey(key: string): BeatsaverItem | undefined {
    const hash = this.GetKeyToHashIndex().get(key);

    return (
      (hash ? this.GetByHash(hash) : undefined) ??
      this.GetAllInvalid().get(
        toStrKey({
          type: BeatsaverKeyType.Key,
          value: key,
        })
      )
    );
  }

  public static GetByHash(hash: string): BeatsaverItem | undefined {
    hash = hash.toUpperCase();

    const beatmap =
      BeatsaverCachedLibrary.GetAllValid().get(hash) ??
      BeatsaverCachedLibrary.GetAllInvalid().get(
        toStrKey({
          type: BeatsaverKeyType.Hash,
          value: hash,
        })
      );
    if (beatmap?.beatmap?.coverURL.startsWith("/cdn/")) {
      beatmap.beatmap.coverURL = `https://cdn.beatsaver.com/${hash.toLowerCase()}.jpg`;
    }
    return beatmap;
    // return (
    //   BeatsaverCachedLibrary.GetAllValid().get(hash) ??
    //   BeatsaverCachedLibrary.GetAllInvalid().get(
    //     toStrKey({
    //       type: BeatsaverKeyType.Hash,
    //       value: hash,
    //     })
    //   )
    // );
  }

  public static GetAllValid(): Map<string, BeatsaverItemValid> {
    return store.getters["beatmap/beatsaverCached"];
  }

  public static GetAllInvalid(): Map<string, BeatsaverItemInvalid> {
    return store.getters["beatmap/beatsaverFailCached"];
  }

  public static Get(key: BeatsaverKey) {
    switch (key.type) {
      case BeatsaverKeyType.Hash:
        return BeatsaverCachedLibrary.GetByHash(key.value);
      case BeatsaverKeyType.Key:
        return BeatsaverCachedLibrary.GetByKey(key.value);
      default:
        throw new Error("Unexpected key type");
    }
  }

  public static UpdateOne(item: BeatsaverItem) {
    if (item.beatmap === undefined || !item.loadState.valid) {
      return;
    }

    this.Add(item.beatmap.hash, item);
  }

  public static ClearCache() {
    store.commit("beatmap/clearBeatsaverCache");
  }

  public static RemoveInvalid(key: BeatsaverKey | BeatsaverKey[]) {
    store.commit("beatmap/removeBeatsaverCachedInvalid", { key });
  }

  private static GetKeyToHashIndex(): Map<string, string> {
    return store.getters["beatmap/beatsaverKeyToHashIndex"];
  }
}
