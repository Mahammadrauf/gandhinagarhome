type SellFormMedia = {
  photos: File[];
  video: File | null;
  saleDeed: File | null;
  brochure: File | null;
};

const mediaStore: SellFormMedia = {
  photos: [],
  video: null,
  saleDeed: null,
  brochure: null,
};

export function getSellFormMedia(): SellFormMedia {
  return mediaStore;
}

export function setSellFormPhotos(photos: File[]) {
  mediaStore.photos = photos;
}

export function setSellFormVideo(video: File | null) {
  mediaStore.video = video;
}

export function setSellFormSaleDeed(saleDeed: File | null) {
  mediaStore.saleDeed = saleDeed;
}

export function setSellFormBrochure(brochure: File | null) {
  mediaStore.brochure = brochure;
}

export function clearSellFormMedia() {
  mediaStore.photos = [];
  mediaStore.video = null;
  mediaStore.saleDeed = null;
  mediaStore.brochure = null;
}
