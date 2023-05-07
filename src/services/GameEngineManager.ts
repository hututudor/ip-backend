import axios from 'axios';
import { Response } from '../utils';

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
  getState: async (lobbyId: string, userId: string): Promise<Response> => {
    try {
      const { data } = await gameEngineClient.get(
        `/state/${lobbyId}?userId=${userId}`,
      );

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
  join: async (body: any): Promise<Response> => {
    try {
      const { data } = await gameEngineClient.post(`/lobbies`, body);
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
  start: async (lobbyId: string): Promise<Response> => {
    try {
      const { data } = await gameEngineClient.post(
        `/lobbies/${lobbyId}/start_game`,
        {},
      );

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
  quit: async (lobbyId: string, body: any): Promise<Response> => {
    try {
      const { data } = await gameEngineClient.delete(
        `/lobbies/${lobbyId}`,
        body,
      );

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
  getPeers: async (lobbyId: string, userId: string): Promise<Response> => {
    try {
      const { data } = await gameEngineClient.get(
        `/lobbies/${lobbyId}/peers?userId=${userId}`,
      );
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
