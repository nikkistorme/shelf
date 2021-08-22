const defaultVolume = {
  author: "",
  categories: [],
  description: "",
  expanded: false,
  imageLinks: {},
  industryIdentifiers: [],
  language: "",
  maturityRating: "",
  pageCount: 0,
  previewLink: "",
  printType: "",
  publishedDate: "",
  publisher: "",
  title: "",
  currentPage: 0,
  startDate: "",
  goalDate: "",
  goalToday: {
    date: "",
    page: 0
  }
};

export { defaultVolume };

const stringFromArrayOfStrings = array => {
  let newString = "";
  let i;
  for (i = 0; i < array.length; i++) {
    if (!newString.length) {
      newString = array[i];
    } else {
      newString += `, ${array[i]}`;
    }
  }
  return newString;
};

export { stringFromArrayOfStrings };

const findVolumeUpdatePage = (injectedVolume, oldShelves) => {
  let newShelves = [];
  const volumeIsbn13 = injectedVolume.industryIdentifiers.find(ii => {
    return ii.type === "ISBN_13";
  }).identifier;
  newShelves = oldShelves.map(s => {
    if (s.id === "default-reading") {
      for (let i = 0; i < s.volumes.length; i++) {
        let vol = s.volumes[i];
        const isbn13 = vol.industryIdentifiers.find(ii => {
          return ii.type === "ISBN_13";
        }).identifier;
        if (isbn13 === volumeIsbn13) {
          vol = injectedVolume;
          s.volumes[i] = vol;
        }
      }
    }
    return s;
  });
  return newShelves;
};

export { findVolumeUpdatePage };

const volumeInReadingShelf = (shelf, volume) => {
  if (shelf.id === "default-reading") {
    shelf.volumes.find(v => {
      console.log("match?", v.description === volume.description)
      return v.description === volume.description;
    });
  } else {
    return false;
  }
};

export { volumeInReadingShelf };
