// https://5e-bits.github.io/docs/api/
import * as transformMonster from "./transform-monster";
import * as transformSpell from "./transform-spell";
import type { MonsterResponse, SpellResponse } from "./types";

const api = "https://www.dnd5eapi.co";

const headers = new Headers();
headers.append("Accept", "application/json");

const requestOptions: RequestInit = {
  method: "GET",
  redirect: "follow",
  headers,
};

const request = async (endpoint: string) => {
  return await fetch(`${api}/api/${endpoint}`, requestOptions)
    .then((response) => response.json())
    .then((response) => response)
    .catch((error) => console.log("error", error));
};

export const fetchMonsters = async () => request("monsters");

export const fetchSpecificMonster = async (id: string) => {
  const response: MonsterResponse = await request(`monsters/${id}`);

  return transformMonster.mapApiResponseToSupportedFormat(response);
};

export const fetchSpecificSpell = async (id: string) => {
  const response: SpellResponse = await request(`spells/${id}`);

  return response
    ? transformSpell.mapApiResponseToSupportedFormat(response)
    : null;
};
