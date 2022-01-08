import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { chatApi } from '../__fake-api__/chat-api';
import type { AppThunk } from '../store';
import type { Contact, Message, Thread } from '../types/chat';
import { objFromArray } from '../utils/obj-from-array';

interface ChatState {
  activeThreadId?: string;
  contacts: {
    byId: Record<string, Contact>;
    allIds: string[];
  };
  threads: {
    byId: Record<string, Thread>;
    allIds: string[];
  };
}

const initialState: ChatState = {
  activeThreadId: null,
  contacts: {
    byId: {},
    allIds: []
  },
  threads: {
    byId: {},
    allIds: []
  }
};

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    getContacts(state: ChatState, action: PayloadAction<Contact[]>): void {
      const contacts = action.payload;

      state.contacts.byId = objFromArray(contacts);
      state.contacts.allIds = Object.keys(state.contacts.byId);
    },
    getThreads(state: ChatState, action: PayloadAction<Thread[]>): void {
      const threads = action.payload;

      state.threads.byId = objFromArray(threads);
      state.threads.allIds = Object.keys(state.threads.byId);
    },
    getThread(state: ChatState, action: PayloadAction<Thread | null>): void {
      const thread = action.payload;

      if (thread) {
        state.threads.byId[thread.id] = thread;

        if (!state.threads.allIds.includes(thread.id)) {
          state.threads.allIds.unshift(thread.id);
        }
      }
    },
    markThreadAsSeen(state: ChatState, action: PayloadAction<string>): void {
      const threadId = action.payload;
      const thread = state.threads.byId[threadId];

      if (thread) {
        thread.unreadCount = 0;
      }
    },
    setActiveThread(state: ChatState, action: PayloadAction<string>): void {
      state.activeThreadId = action.payload;
    },
    addMessage(state: ChatState,
      action: PayloadAction<{ message: Message, threadId: string }>): void {
      const { threadId, message } = action.payload;
      const thread = state.threads.byId[threadId];

      if (thread) {
        thread.messages.push(message);
      }
    }
  }
});

export const { reducer } = slice;

export const getContacts = (): AppThunk => async (dispatch): Promise<void> => {
  const data = await chatApi.getContacts();

  dispatch(slice.actions.getContacts(data));
};

export const getThreads = (): AppThunk => async (dispatch): Promise<void> => {
  const data = await chatApi.getThreads();

  dispatch(slice.actions.getThreads(data));
};

export const getThread = (threadKey: string): AppThunk => async (dispatch): Promise<string> => {
  const data = await chatApi.getThread(threadKey);

  dispatch(slice.actions.getThread(data));

  return data?.id;
};

export const markThreadAsSeen = (threadId: string): AppThunk => async (dispatch): Promise<void> => {
  await chatApi.markThreadAsSeen(threadId);

  dispatch(slice.actions.markThreadAsSeen(threadId));
};

export const setActiveThread = (threadId?: string): AppThunk => (dispatch): void => {
  dispatch(slice.actions.setActiveThread(threadId));
};

export const addMessage = ({
  threadId,
  recipientIds,
  body
}: { threadId?: string, recipientIds?: string[], body: string }): AppThunk => async (dispatch): Promise<string> => {
  const data = await chatApi.addMessage({
    threadId,
    recipientIds,
    body
  });

  dispatch(slice.actions.addMessage(data));

  return data.threadId;
};
