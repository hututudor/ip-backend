import axios from 'axios';
import { Response } from '../utils';
import { PlayersRepository } from '../repositories/PlayersRepository';
import { Player, PlayerStatus } from '../models';
import { string } from 'joi';
import { LobbiesRepository } from '../repositories';

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
  getState: async (lobbyId: string, userId: number): Promise<Response> => {
    try {
      const { data } = await gameEngineClient.get(
        `/state/${lobbyId}?userId=${userId}`,
      );

      if (!data?.currentUser?.isAlive) {
        await new PlayersRepository().updatePlayerStatus(
          userId,
          lobbyId,
          'dead',
        );
      }

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
  join: async ({ lobbyId, userId }: any): Promise<Response> => {
    try {
      const { data } = await gameEngineClient.post(
        `/lobbies/${lobbyId}/add_user`,
        { userId },
      );

      //Create the lobby if it doesn't already exists
      const lobby = await new LobbiesRepository().getById(lobbyId);
      if (!lobby) {
        new LobbiesRepository().create(lobbyId, 'waiting');
      }

      //Assign player to lobby
      await new PlayersRepository().create(userId, lobbyId, 'alive');

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

      //Update lobby status
      await new LobbiesRepository().update({ id: lobbyId, status: 'started' });

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

      await new PlayersRepository().delete(body.userId, lobbyId);
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
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
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
