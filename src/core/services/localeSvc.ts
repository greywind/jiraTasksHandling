import { Locale as DateFnsLocale } from "date-fns";
import deLocale from "date-fns/locale/de";
import usLocale from "date-fns/locale/en-US";
import moment from "moment";
import React from "react";

const registeredLocales = new Map<string, LocaleStringsContainer>();
const defaultLocale: AvailableLocales = "en";

export type AvailableLocales = "en" | "ru";
export type AvailableLocalesLongForm = "en-gb" | "ru-ru";
export const availableLocales: AvailableLocales[] = ["en", "ru"];

export function isAvailableLocale(value: string): value is AvailableLocales {
  return (availableLocales as string[]).includes(value);
}

export function transformToLongForm(
  locale: AvailableLocales
): AvailableLocalesLongForm {
  switch (locale) {
    case "en":
      return "en-gb";
    case "ru":
      return "ru-ru";
  }
}

export function transformToReadable(locale: AvailableLocales): string {
  switch (locale) {
    case "en":
      return "English";
    case "ru":
      return "Russian";
  }
}

export function transformToShortForm(
  locale: AvailableLocalesLongForm
): AvailableLocales {
  switch (locale) {
    case "en-gb":
      return "en";
    case "ru-ru":
      return "ru";
  }
}

export function transformToDateFnsLocale(
  locale: AvailableLocales
): DateFnsLocale {
  switch (locale) {
    case "en":
      return usLocale;
    case "ru":
      return deLocale;
  }
}

interface Locale {
  [key: string]: React.ReactNode;
}
export type LocaleStringValue = {
  en: React.ReactNode;
} & {
  [locale in AvailableLocales]?: React.ReactNode;
};
interface LocaleStrings {
  [key: string]: LocaleStringValue;
}

class LocaleSvc {
  private locale: AvailableLocales;
  private subscribers = new Set<() => void>();

  constructor() {
    this.setLocale(defaultLocale);
  }

  public setLocale(locale: AvailableLocales): void {
    this.locale = locale;
    moment.locale(transformToLongForm(locale));
    this.subscribers.forEach((handler) => handler());
  }

  public getLocale(): AvailableLocales {
    return this.locale;
  }

  public subscribeOnLocaleChange(handler: () => void): void {
    this.subscribers.add(handler);
    handler();
  }

  public unsubscribeOnLocaleChange(handler: () => void): void {
    this.subscribers.delete(handler);
  }

  public get(area: string): Locale {
    if (!registeredLocales.has(area))
      throw new Error(`area ${area} not found.`);
    const result: Locale = {};
    const areaValues = registeredLocales.get(area).getValues();
    for (const prop in areaValues) {
      result[prop] =
        typeof areaValues[prop][this.locale] !== "undefined"
          ? areaValues[prop][this.locale]
          : typeof areaValues[prop][defaultLocale] !== "undefined"
          ? areaValues[prop][defaultLocale]
          : `MISSED: ${area}.${prop}.${this.locale}`;
    }
    return result;
  }

  public isRtl(): boolean {
    return false;
  }

  public getRegisteredAreas(): string[] {
    return [...registeredLocales.keys()];
  }
}

const localeSvc = new LocaleSvc();

class LocaleStringsContainer {
  private values: LocaleStrings;
  constructor(values: LocaleStrings) {
    this.values = values;
  }
  public getValues(): LocaleStrings {
    return this.values;
  }
  public getValuesForCurrentLocale(): Locale {
    const result: Locale = {};
    const values = this.getValues();
    for (const prop in values)
      result[prop] =
        values[prop][localeSvc.getLocale()] || values[prop][defaultLocale];
    return result;
  }
}

export function registerLocale(area: string, values: LocaleStrings): void {
  const locale = new LocaleStringsContainer(values);
  registeredLocales.set(area, locale);
}

export function registerUseLocale(
  area: string,
  setLocale: (locale: Locale) => void
): void {
  localeSvc.subscribeOnLocaleChange(() => setLocale(localeSvc.get(area)));
}

export default localeSvc;
