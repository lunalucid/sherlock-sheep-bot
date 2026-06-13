import { bot } from "../index";

const botAvatar = (avatar: string) => {
  if (!bot.user) return;
  bot.user.setAvatar(avatar).catch(console.error);
}

const botAvatars: Record<string, string> = {
  Default1: 'https://i.ibb.co/Y7QwVPnR/Avatar1.gif',
  Default2: 'https://i.ibb.co/tMbndgZP/Avatar2.gif',
  Default3: 'https://i.ibb.co/5Xv1dFZ3/Avatar3.gif',
  Default4: 'https://i.ibb.co/wrKy4trq/Avatar4.gif',
  Big1: 'https://i.ibb.co/HDysqqBh/Avatar-Big1.gif',
  Big2: 'https://i.ibb.co/PZhdPx3k/Avatar-Big2.gif',
  Big3: 'https://i.ibb.co/8LJnRSrW/Avatar-Big3.gif',
  Big4: 'https://i.ibb.co/LXkKYPq8/Avatar-Big4.gif',
  Sideways1: 'https://i.ibb.co/F4RJdR1g/Avatar-Sideways1.gif',
  Sideways2: 'https://i.ibb.co/FL8J7Zck/Avatar-Sideways2.gif',
  Sideways3: 'https://i.ibb.co/NdHN7wDy/Avatar-Sideways3.gif',
  Sideways4: 'https://i.ibb.co/jZvgYgC0/Avatar-Sideways4.gif',
  UpsideDown1: 'https://i.ibb.co/xrsq0p2/Avatar-Upside-Down1.gif',
  UpsideDown2: 'https://i.ibb.co/938snj8V/Avatar-Upside-Down2.gif',
  UpsideDown3: 'https://i.ibb.co/HL4bvZ95/Avatar-Upside-Down3.gif',
  UpsideDown4: 'https://i.ibb.co/PG6RGNsc/Avatar-Upside-Down4.gif'
}

export const BotAvatar = {
  Random: () => {
    const keys = Object.keys(botAvatars);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    botAvatar(botAvatars[randomKey]);
    return botAvatars[randomKey]
  }
}