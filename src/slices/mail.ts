import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { mailApi } from '../__fake-api__/mail-api';
import type { AppThunk } from '../store';
import type { Email, Label } from '../types/mail';
import { objFromArray } from '../utils/obj-from-array';

interface MailState {
  emails: {
    byId: Record<string, Email>;
    allIds: string[];
  };
  labels: Label[];
  isSidebarOpen: boolean;
  isComposeOpen: boolean;
}

const initialState: MailState = {
  emails: {
    byId: {},
    allIds: []
  },
  labels: [],
  isSidebarOpen: true,
  isComposeOpen: false
};

const slice = createSlice({
  name: 'mail',
  initialState,
  reducers: {
    getLabels(state: MailState, action: PayloadAction<Label[]>): void {
      state.labels = action.payload;
    },
    getEmails(state: MailState, action: PayloadAction<Email[]>): void {
      const emails = action.payload;

      state.emails.byId = objFromArray(emails);
      state.emails.allIds = Object.keys(state.emails.byId);
    },
    getEmail(state: MailState, action: PayloadAction<Email>): void {
      const email = action.payload;

      state.emails.byId[email.id] = email;

      if (!state.emails.allIds.includes(email.id)) {
        state.emails.allIds.push(email.id);
      }
    },
    openSidebar(state: MailState): void {
      state.isSidebarOpen = true;
    },
    closeSidebar(state: MailState): void {
      state.isSidebarOpen = false;
    },
    openCompose(state: MailState): void {
      state.isComposeOpen = true;
    },
    closeCompose(state: MailState): void {
      state.isComposeOpen = false;
    }
  }
});

export const { reducer } = slice;

export const getLabels = (): AppThunk => async (dispatch): Promise<void> => {
  const data = await mailApi.getLabels();

  dispatch(slice.actions.getLabels(data));
};

export const getEmails = ({
  label
}: { label: string }): AppThunk => async (dispatch): Promise<void> => {
  const data = await mailApi.getEmails({ label });

  dispatch(slice.actions.getEmails(data));
};

export const getEmail = (emailId: string): AppThunk => async (dispatch): Promise<void> => {
  const data = await mailApi.getEmail(emailId);

  dispatch(slice.actions.getEmail(data));
};

export const openSidebar = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.openSidebar());
};

export const closeSidebar = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.closeSidebar());
};

export const openComposer = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.openCompose());
};

export const closeComposer = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.closeCompose());
};
