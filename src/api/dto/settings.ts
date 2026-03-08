import {z} from 'zod';
import {commonQuery} from './common';

export const settingDto = z.object({
  id: z.string().uuid(),
  key: z.string(),
  value: z.string(),
});

export type SettingDto = z.infer<typeof settingDto>;

export const getSettings = settingDto.pick({key: true}).partial().merge(commonQuery);
export type GetSettings = z.infer<typeof getSettings>;

export const getSettingsRes = z.object({
  count: z.number(),
  data: settingDto.array(),
});

export const getSettingRes = settingDto.optional();

export const addSetting = settingDto.pick({key: true, value: true});
export type AddSetting = z.infer<typeof addSetting>;

export const editSetting = settingDto.pick({value: true}).partial();
export type EditSetting = z.infer<typeof editSetting>;
