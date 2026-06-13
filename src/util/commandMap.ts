import { commands } from '../commands';

export const getCommandMap = () =>
  new Map(Object.values(commands).map((command) => [command.data.toJSON().name, command]));
