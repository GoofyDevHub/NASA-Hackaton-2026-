// Scene manifest (CAT01) and listening notes (CAT02).
// Media paths are relative to the repository root. Hashes are checked by site/check.mjs
// against assets/images/sources.json and assets/audio/sha256.json.

import { IT } from './scenes.it.js';

const IMG = '../assets/images/';
const AUD = '../assets/audio/';

export const SOURCES = {
  lightning: {
    label: 'Lightning',
    subtitle: 'Lightning flash rate density',
    sourceId: 'NASA SVS 3144',
    page: 'https://svs.gsfc.nasa.gov/3144/',
    period: 'Annual climatology from LIS 1998–2002 and OTD 1995–1999.',
    spokenPeriod: 'a yearly average built from satellite records between 1995 and 2002',
    credit: 'NASA/Goddard/SVS; Jeff de La Beaujardiere; Jeff Halverson',
    texture: IMG + 'originals/lightning.png',
    legend: IMG + 'legends/lightning.png',
    legendAlt: 'Legend: lightning flash rate density from 0 to 100 flashes per square kilometre per year, running from violet and blue through green and yellow to dark red.',
    limits: 'This is a sound picture of display colours on a long-term average map. It is not today\'s weather, a count of flashes or a measure of storm severity.'
  },
  ocean: {
    label: 'Ocean',
    subtitle: 'Sea-surface temperature colours',
    sourceId: 'NASA SVS 3912',
    page: 'https://svs.gsfc.nasa.gov/3912/',
    period: 'ECCO2 visualization covering March 2007 to March 2008. The exact instant of this still is not recorded.',
    spokenPeriod: 'a visualization covering March 2007 to March 2008',
    credit: 'NASA/Goddard/SVS; Greg Shirah; ECCO2 MIT/JPL',
    texture: IMG + 'originals/ocean.jpg',
    legend: IMG + 'legends/ocean.png',
    legendAlt: 'Legend: sea-surface temperature colours from blue at the cold end through green and yellow to red at the warm end.',
    limits: 'The voice follows relative colours in a still image. It gives no temperature in degrees and no current conditions.'
  },
  aerosols: {
    label: 'Aerosols',
    subtitle: 'Aerosols in the atmosphere',
    sourceId: 'NASA SVS 5669',
    page: 'https://svs.gsfc.nasa.gov/5669/',
    period: 'GEOS model still for 19 August 2025, 20:00 UTC.',
    spokenPeriod: 'a model still for 19 August 2025',
    credit: 'NASA GMAO/SVS; Joseph V. Ardizzone; Helen-Nicole Kostis; scientific consulting by Lesley Ott',
    texture: IMG + 'originals/aerosols.png',
    legend: IMG + 'legends/aerosols.png',
    legendAlt: 'Legend: black carbon in orange-red, dust in violet, sea salt in grey-blue, sulfate in green.',
    limits: 'These are colours in a model image. They are not an air-quality index, an exposure estimate or a statement about anyone\'s health.'
  }
};

export const REGIONS = {
  amazon: { label: 'Amazon', lat: -4, lon: -60 },
  congo: { label: 'Congo', lat: -2.5, lon: 18.5 },
  antarctica: { label: 'Antarctica', lat: -64.5, lon: -56 }
};

const audio = (file, mp3Sha256, wavSha256) => ({ mp3: AUD + file + '.mp3', master: AUD + file + '.wav', mp3Sha256, wavSha256 });

export const SCENES = [
  {
    id: 'amazon-lightning', place: 'Amazon', pin: { lat: -3, lon: -64 }, region: 'amazon', phenomenon: 'lightning',
    title: 'Amazon lightning', spoken: 'Amazon lightning',
    image: IMG + 'amazon-lightning.png', imageLabel: 'Amazon region',
    audio: audio('amazon-rain', 'd7b7f896417969671c7ed6d9ae2b4c64b06fbe444f3b0bcf0d84852f9d3ee05d', '1b401d48e72c01bc00610250f69472375617dea477f24025502009b4c65bd3db'),
    cue: 'Steady rain, no thunder',
    description: 'Amazon region, northern South America. This is NASA\'s map of how often lightning flashes in an average year, built from satellite records between 1995 and 2002. Almost the whole view is blue, the low end of the legend, with lighter blue speckles across the basin and a small yellow and red patch in the far north-west corner. Dark water in the north-east is the Atlantic.',
    soundKey: 'You hear 15 seconds of rain with no thunder. The sound scans the map column by column: brighter colours bring heavier rain.'
  },
  {
    id: 'congo-lightning', place: 'Congo', pin: { lat: 1, lon: 25 }, region: 'congo', phenomenon: 'lightning',
    title: 'Congo lightning', spoken: 'Congo lightning',
    image: IMG + 'congo-lightning.png', imageLabel: 'Congo region',
    audio: audio('congo-storm', '3d42812de9c037d27d79aaf7a4a2fdbea8153097f71e3cff90d98006a08bf9a5', '04beca0a07d28d5d34eb48d49dc1745f63a948a83bb3295142aec0c93bca674b'),
    cue: 'Heavier rain with nine thunder groups',
    description: 'Congo region, central Africa. The same NASA lightning map and legend as the Amazon view, built from satellite records between 1995 and 2002. Here the land is cyan and green with a yellow and orange centre and a dark red patch to the east, the high end of the legend. Dark blue in the south-west corner is the Atlantic.',
    soundKey: 'You hear heavier rain with nine groups of thunder in 15 seconds, made from the same rain recording as the Amazon track, which has rain alone. Heavier rain and frequent, loud thunder mean the map shows higher colours here. The contrast is between two places, not between two dates.'
  },
  {
    id: 'antarctica-lightning', place: 'Antarctic Peninsula', pin: { lat: -66, lon: -63 }, region: 'antarctica', phenomenon: 'lightning',
    title: 'Antarctic lightning view', spoken: 'the Antarctic lightning view',
    image: IMG + 'antarctica-lightning.png', imageLabel: 'Antarctic Peninsula sector',
    audio: audio('antarctica-wind', '7179f33c489ab71d9ae37e8dd345181887376afde1b204adabfee09e51152c95', '2675c23b9b20ce1e3aadc044a6b1d0853f4d986818f588c52e0bde7194b6be9d'),
    illustrative: true,
    cue: 'Light wind, illustrative',
    description: 'Antarctic Peninsula sector. The same NASA lightning map, built from satellite records between 1995 and 2002. The view shows the pale peninsula against dark water and no coloured lightning overlay at all. Satellite coverage near the pole is too limited to tell missing data from low activity.',
    soundKey: 'You hear a light synthesized wind. It is an illustrative cue chosen by the team. It is not a recording and it is not derived from a measurement.',
    limits: 'This scene cannot tell you how much lightning occurs here or how windy it is. Polar coverage in the source is insufficient.'
  },
  {
    id: 'antarctica-ocean', place: 'Southern Ocean', pin: { lat: -57, lon: -25 }, region: 'antarctica', phenomenon: 'ocean',
    title: 'Southern Ocean', spoken: 'the Southern Ocean',
    image: IMG + 'antarctica-ocean.png', imageLabel: 'Regional reference: Antarctic Peninsula',
    audioCrop: IMG + 'audio-crops/antarctica-ocean.png',
    audioCropLabel: 'Southern Ocean band that drives the sound (exact crop, scroll sideways)',
    audio: audio('antarctica-ocean-deep-male', '6364bc1c9479266fc2d67e6e6e314ed47db780f9b6f51afd468b5bd01d2aa79c', '7c1bbcdd49a5a45b667650de170e3c81a545230ed2d5717b688c7f25da2aa85e'),
    cue: 'A low male singing voice',
    description: 'Southern Ocean, the broad band of water around Antarctica. NASA\'s ECCO2 visualization draws surface currents as fine streamlines coloured by sea-surface temperature, for a period between March 2007 and March 2008. The band is dark blue with cyan and green threads along its northern edge, the cold end of the legend, above grey Antarctic land. The picture shows a detail of that band; the sound uses its whole width.',
    soundKey: 'You hear a low male singing voice in three long phrases. Cold colours select the singer\'s low register, and three sections of the band gently change how loud each phrase is. The singer keeps his natural pitch.'
  },
  {
    id: 'amazon-ocean', place: 'Atlantic, Amazon mouth', pin: { lat: 2, lon: -44 }, region: 'amazon', phenomenon: 'ocean',
    title: 'Atlantic near the Amazon mouth', spoken: 'the Atlantic near the Amazon mouth',
    image: IMG + 'amazon-ocean.png', imageLabel: 'Atlantic near the Amazon mouth',
    audioCrop: IMG + 'audio-crops/amazon-ocean.png',
    audio: audio('amazon-ocean-soprano', '1b4fb0855de10af5d8a3f9902058922b41a1ba61d64c139c7f7dcb0146d31d17', '70598115ff6482187353a9dcf8b8f1386cb5a6c0839ad7810af52f04a0714773'),
    cue: 'A soprano in four phrases',
    description: 'Atlantic Ocean beside the mouth of the Amazon. NASA\'s ECCO2 visualization draws surface currents as streamlines coloured by sea-surface temperature, for a period between March 2007 and March 2008. Bright orange streamlines curl in a large swirl off the coast, the warm end of the legend. Grey land sits in the lower left.',
    soundKey: 'You hear a soprano in four phrases. Warm colours select the high voice, and four sections of the view shift each phrase\'s pitch slightly, within three semitones.'
  },
  {
    id: 'congo-aerosols', place: 'Congo', pin: { lat: -9, lon: 19 }, region: 'congo', phenomenon: 'aerosols',
    title: 'Congo aerosols', spoken: 'Congo aerosols',
    image: IMG + 'congo-aerosols.png', imageLabel: 'Congo region',
    audio: audio('congo-air-pollution-cough-dense', '96bc6e4eefa92749e3dbdfbcb4119acd057f09dded4b11305997b217c3fc0b71', 'bfe67184b30ff8d1a1756ced39e737617bd6eb091356522e65d97871fa23c318'),
    cue: 'Thirteen groups of coughs',
    description: 'Congo region, central Africa. A still from NASA\'s GEOS atmospheric model for 19 August 2025 at 20:00 UTC. Orange and red smoke colours, labelled black carbon in the legend, cover more than half of the view, with a bright pink and white core near the centre and a green sulfate patch at the eastern edge.',
    soundKey: 'You hear thirteen groups of recorded coughs with short gaps between them. The share of the view covered by smoke colours sets how many coughs there are and how closely they follow each other. It is an artistic response to smoke colours.'
  },
  {
    id: 'congo-ocean', place: 'Atlantic, Congo mouth', pin: { lat: -6, lon: 7 }, region: 'congo', phenomenon: 'ocean',
    title: 'Atlantic near the Congo mouth', spoken: 'the Atlantic near the Congo mouth',
    image: IMG + 'congo-ocean.png', imageLabel: 'Atlantic near the Congo mouth',
    audio: null,
    description: 'Atlantic Ocean beside the mouth of the Congo. NASA\'s ECCO2 visualization draws surface currents as streamlines coloured by sea-surface temperature, for a period between March 2007 and March 2008. Yellow and orange streamlines run along the coast, toward the warm end of the legend, with grey land on the right.'
  },
  {
    id: 'amazon-aerosols', place: 'Amazon', pin: { lat: -11, lon: -54 }, region: 'amazon', phenomenon: 'aerosols',
    title: 'Amazon aerosols', spoken: 'Amazon aerosols',
    image: IMG + 'amazon-aerosols.png', imageLabel: 'Amazon region',
    audio: null,
    description: 'Amazon region, northern South America. A still from NASA\'s GEOS atmospheric model for 19 August 2025 at 20:00 UTC. The view is mostly dark green, with scattered small red points of black carbon and a grey-violet haze in the north-east.'
  },
  {
    id: 'antarctica-aerosols', place: 'Antarctic Peninsula', pin: { lat: -72, lon: -44 }, region: 'antarctica', phenomenon: 'aerosols',
    title: 'Antarctic aerosols', spoken: 'Antarctic aerosols',
    image: IMG + 'antarctica-aerosols.png', imageLabel: 'Antarctic Peninsula sector',
    audio: null,
    description: 'Antarctic Peninsula sector. A still from NASA\'s GEOS atmospheric model for 19 August 2025 at 20:00 UTC. A dark green haze lies over the ocean, with the pale peninsula in the lower left and a white patch in the upper left corner.'
  }
];

export const IMAGE_ONLY_NOTE = 'Image only. No sound has been approved for this view, so the playlist skips it. Its description and source are available.';

// Playlist order: the six approved tracks, in the order of the listening references.
export const PLAYLIST = SCENES.filter(s => s.audio).map(s => s.id);

export const byId = id => SCENES.find(s => s.id === id) || null;
export const sourceOf = scene => SOURCES[scene.phenomenon];
export const limitsOf = scene => scene.limits || sourceOf(scene).limits;
// Everything read aloud for a view: what the image shows, what is heard, and what it does not tell. English or Italian.
export const describe = (scene, lang) => lang === 'it-IT' ? IT.description[scene.id] : scene.description;
export const fullDescription = (scene, lang) => lang === 'it-IT'
  ? [IT.description[scene.id], scene.audio ? IT.soundKey[scene.id] : IT.imageOnly, IT.limits[scene.id] || IT.limits[scene.phenomenon]].join(' ')
  : [scene.description, scene.audio ? scene.soundKey : IMAGE_ONLY_NOTE, limitsOf(scene)].join(' ');
