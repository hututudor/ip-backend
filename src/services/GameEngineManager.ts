import axios from 'axios';
import { Response } from '../utils';

console.log(process.env.GAME_ENGINE_URL);

const gameEngineClient = axios.create({
  baseURL: process.env.GAME_ENGINE_URL,
});

export const GameEngineManager = {
  act: async (lobbyId: string, body: any): Promise<Response> => {
    try {
      const { data } = await gameEngineClient.post(`/state/${lobbyId}`, body);

      return {
        status: 200,
        data,
      };
    } catch ({ response }: any) {
      if (response) {
        return {
          status: response.status ?? 500,
          data: response.data,
        };
      }

      return {
        status: 500,
        data: undefined,
      };
    }
  },
  getState: async (lobbyId: string): Promise<Response> => {
    try {
      const { data } = await gameEngineClient.get(`/state/${lobbyId}`);

      return {
        status: 200,
        data,
      };
    } catch ({ response }: any) {
      if (response) {
        return {
          status: response.status ?? 500,
          data: response.data,
        };
      }

      return {
        status: 500,
        data: undefined,
      };
    }
  },
};
