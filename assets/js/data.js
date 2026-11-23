/**
 * Omega Developers: site data.
 *
 * MEDIA: every render registered once by id (src = full WebP, thumb = 720px WebP,
 * lqip = tiny blurred preview shown while it loads). Unregistered ids draw the
 * building elevation placeholder, so a project with no photos still looks finished.
 *
 * PROJECTS: order here = order on the site. pin is an approximate [lat, lon] for the
 * schematic map (confirm the exact plot with the client). facts / highlights are shown
 * on the project page. Everything below comes from Omega's own posts.
 */
window.OM_MEDIA = {
  "byblos-front": {"src": "assets/media/byblos/byblos-front.webp", "thumb": "assets/media/byblos/byblos-front-sm.webp", "lqip": "data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAADQAwCdASoUAAwAPu1iqU2ppaOiMAgBMB2JQBOgA9a08/shxi//fSAA/t7uqFov3j6S3VwfqPLnpyaLqlmJbyyGg3KfWRa2KDh48/Jm7m/b5Ya9wQhAbBx2flLZbEb3hPFqnlxKQoeg05udnUZtC7OQoPFLsaAA", "width": 1600, "height": 969, "alt": "Render of the Omega building in Central Byblos: white frame facade, timber-clad upper floors and shops at street level", "focal": "center 60%"},
  "shops-front": {"src": "assets/media/byblos/shops-front.webp", "thumb": "assets/media/byblos/shops-front-sm.webp", "lqip": "data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAADwAwCdASoUAAwAPu1iqU2ppaOiMAgBMB2JZACdABcTg4FqP21cuPqoAP7Ut6UbweIHzU5txMmBhG12Ci5BVIdWQal7Y5mfE2orEE7OFddyKYYA2PRgG2sCs8BYTQAJ5CaNJ30E1Z4qjZ1PZRYLT23SWiQyYPcAAAA=", "width": 1600, "height": 929, "focal": "center 88%", "alt": "Street-level shops under the white frame facade of the Omega building"},
  "angle-day": {"src": "assets/media/byblos/angle-day.webp", "thumb": "assets/media/byblos/angle-day-sm.webp", "lqip": "data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAADQAwCdASoUAA0APu1iqU2ppaOiMAgBMB2JZQCsAB0bKVQ7YNdLL4AA/loTrTjAKUMjkjsLkgErJdeoF4naVSp2lh9cB0teXpVqd06iycyV5XoYDD37v9jQG/7f3+oGbxe53ljsmtvteaGtP5HguoE8c+hVUUlj6ZJxYJ+HwAA=", "width": 1500, "height": 954, "focal": "center 75%", "alt": "Daytime render of the Omega building, office and clinic floors behind the white frames"},
  "solar-side": {"src": "assets/media/byblos/solar-side.webp", "thumb": "assets/media/byblos/solar-side-sm.webp", "lqip": "data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAAAQBACdASoUAA0APu1iqU2ppaOiMAgBMB2JZwC2yYwmwEy0GlyoFdoVYAD+7g50kCjwfmcChY+OdG5C1lT4xnH0X+QAmrqy5vBkWyDE28ZRYXHUKUAVcwAzuy6sFhHtyEB+oFBiWku5qab9KWcPsbEKUej9QEdC0RZ/u0jXQAA=", "width": 1600, "height": 1022, "alt": "Side view of the Omega building with its dark tiled wall and timber balconies"},
  "apartments": {"src": "assets/media/byblos/apartments.webp", "thumb": "assets/media/byblos/apartments-sm.webp", "lqip": "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAACwAwCdASoUAAwAPu1iqU2ppaOiMAgBMB2JZwAAUpmF6c4J1Skp6AD42+ydT9h8/fwYVodlerjiR9wibVxIPgGdGjiUSwCYPwM0x1gPo7H38SUR/YEPSERlM/zOoyoapcnIYaf2iiuAAA==", "width": 1500, "height": 915, "alt": "Close view of the white frame floors and greenery of the Omega building", "focal": "center 40%"},
  "aerial": {"src": "assets/media/byblos/aerial.webp", "thumb": "assets/media/byblos/aerial-sm.webp", "lqip": "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAAAwBACdASoUAAwAPu1iqU2ppaOiMAgBMB2JZwDG9B8v8rhiR/Btt9cjLgAA+XiOrsuRtvtX76mjzCMjlBp1zRmoTcDBXpk+xMQKgc+zmQ/EUBSYPfMrflHGP513y3UPJbxdEk++8TgAAA==", "width": 1600, "height": 966, "alt": "Aerial render of the Omega building with its slanted solar-integrated top"},
  "ardi-view": {"src": "assets/media/byblos/ardi-view.webp", "thumb": "assets/media/byblos/ardi-view-sm.webp", "lqip": "data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAAAwBACdASoUAA0APu1iqU2ppaOiMAgBMB2JQBOmUABWnfecSSVpZnYYCQgA/O7pO0Yo5TAeIHjcqVUFk0gr4I7xDclrY9J7aaVmE+czemE4MbqlRM3wZwkMp417B/iNO5huOAFJXt75vEMXRntdKte4kz1C7wY7RBhPlkB+TrgoAA==", "width": 1590, "height": 1038, "alt": "Front render of the Omega building with terraces and planted balconies"},
  "jbeil-center": {"src": "assets/media/byblos/jbeil-center.webp", "thumb": "assets/media/byblos/jbeil-center-sm.webp", "lqip": "data:image/webp;base64,UklGRqgAAABXRUJQVlA4IJwAAABQBACdASoUABEAPu1ur1IppiQiqAgBMB2JYwAAFhPdFL5S+5E3mwTzXbGAAP7o3YAjlgshZu6PV7LZrKi7mwWyQnSQ+4xqLdADspkNKVRldaHF2nC8nWUXzfd6ZX0su3cwdOfA566+hNlr9CB/zvdOJXXWMHKxri8SFdMBNx+3hkQx5RtkqPynF+CGQHETE8QuGB4Yug47gYAAAAA=", "width": 744, "height": 630, "alt": "Evening render of a new low-rise commercial center in Jbeil with a white frame facade"}
};

window.OM_PROJECTS = [
  {
    slug: "central-byblos",
    pin: [34.1232, 35.6492],
    region: "Central Byblos",
    map: "https://www.google.com/maps/search/?api=1&query=Byblos+Jbeil+Lebanon",
    title: "Omega Central Byblos",
    location: "Prime location, Central Byblos",
    type: "Mixed use: shops, offices, clinics, apartments",
    summary: "A modern mixed-use building in the heart of Byblos: shops at street level, offices and clinics from 90 m², and 190 m² apartments under a solar-integrated top.",
    description: "Our flagship in a prime location in Central Byblos. Shops open onto the street, luxurious offices and clinic spaces start from 90 m², and spacious 190 m² apartments sit above, each with 2 underground parking spaces. A modern design wrapped in white frames, timber and greenery, finished with a solar-integrated top.",
    facts: [
      ["Apartments", "190 m², 2 underground parking spaces"],
      ["Offices & clinics", "From 90 m²"],
      ["Shops", "For rent, flexible terms"],
      ["Payment", "20% down payment, 4-year plan"],
      ["Delivery", "In 3 years"]
    ],
    highlights: ["Solar-integrated top", "No agents' commissions, directly from the developer", "Competitive prices", "Ideal for businesses, clinics and investments"],
    coverId: "byblos-front",
    galleryIds: ["byblos-front", "angle-day", "aerial", "ardi-view", "solar-side", "apartments", "shops-front"]
  },
  {
    slug: "jbeil-commercial",
    region: "Jbeil",
    map: "https://www.google.com/maps/search/?api=1&query=Jbeil+Lebanon",
    title: "Jbeil Commercial Centers",
    location: "Jbeil",
    type: "Commercial centers",
    summary: "New commercial centers in Jbeil, with spaces for sale and flexible payment plans through Ardi Properties.",
    description: "New commercial centers in Jbeil, with spaces for sale. Direct purchase from Ardi Properties, with flexible payment plans and competitive prices.",
    facts: [
      ["Spaces", "For sale"],
      ["Payment", "Flexible payment plans"],
      ["Sales", "Ardi Properties"]
    ],
    highlights: ["New commercial centers in Jbeil", "Flexible payment plans", "Competitive prices", "Ideal for businesses, clinics and investments"],
    coverId: "jbeil-center",
    galleryIds: ["jbeil-center"]
  }
];

window.OM_CONTACT = {
  whatsapp: "96179338163",
  phones: [
    { name: "Omega Developers", display: "+961 79 338 163", wa: "96179338163", tel: "+96179338163" },
    { name: "Ardi Properties", display: "+961 71 944 988", wa: "96171944988", tel: "+96171944988" }
  ],
  offices: [
    { name: "Project site", place: "Central Byblos, Jbeil", map: "https://www.google.com/maps/search/?api=1&query=Byblos+Jbeil+Lebanon" }
  ],
  instagram: "omegadevelopers"
};
