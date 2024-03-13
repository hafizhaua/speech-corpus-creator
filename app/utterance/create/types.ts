import { z } from "zod";

export type LanguagesType = {
  id: string;
  name: string;
};

export type UtterancesType = {
  id: string | number;
  text: string;
};
