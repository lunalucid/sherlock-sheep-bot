const inspectGifs = [
  'https://i.ibb.co/B5mn0bgD/Sherlock-Sheep-Inspect.gif',
  'https://i.ibb.co/vvVWBKwH/Sherlock-Sheep-Inspect-Half.gif',
  'https://i.ibb.co/998Skj72/Sherlock-Sheep-Merp.gif',
  'https://i.ibb.co/DfRjWnKL/Sherlock-Sheep-Merp-Half.gif'
]

const idleGifs = [
  'https://i.ibb.co/v6fssMKp/Sherlock-Sheep-No-Hat-Half.gif',
  'https://i.ibb.co/tp0qgzx2/Sherlock-Sheep.gif',
  'https://i.ibb.co/LXD0xrKN/Sherlock-Sheep-Half.gif',
]

export const Gif = {
  Inspect: () => inspectGifs[Math.floor(Math.random() * inspectGifs.length)],
  Idle: () => idleGifs[Math.floor(Math.random() * idleGifs.length)]
}