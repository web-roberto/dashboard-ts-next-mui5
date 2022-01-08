import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { calendarApi } from '../__fake-api__/calendar-api';
import type { AppThunk } from '../store';
import type { CalendarEvent } from '../types/calendar';

interface CalendarState {
  events: CalendarEvent[];
}

const initialState: CalendarState = {
  events: []
};

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    getEvents(
      state: CalendarState,
      action: PayloadAction<CalendarEvent[]>
    ): void {
      state.events = action.payload;
    },
    createEvent(
      state: CalendarState,
      action: PayloadAction<CalendarEvent>
    ): void {
      state.events.push(action.payload);
    },
    updateEvent(
      state: CalendarState,
      action: PayloadAction<CalendarEvent>
    ): void {
      const event = action.payload;

      state.events = state.events.map((_event) => {
        if (_event.id === event.id) {
          return event;
        }

        return _event;
      });
    },
    deleteEvent(
      state: CalendarState,
      action: PayloadAction<string>
    ): void {
      state.events = state.events.filter((event) => event.id !== action.payload);
    }
  }
});

export const { reducer } = slice;

export const getEvents = (): AppThunk => async (dispatch): Promise<void> => {
  const data = await calendarApi.getEvents();

  dispatch(slice.actions.getEvents(data));
};

export const createEvent = (createData): AppThunk => async (dispatch): Promise<void> => {
  const data = await calendarApi.createEvent(createData);

  dispatch(slice.actions.createEvent(data));
};

export const updateEvent = (
  eventId: string,
  update: any
): AppThunk => async (dispatch): Promise<void> => {
  const data = await calendarApi.updateEvent({
    eventId,
    update
  });

  dispatch(slice.actions.updateEvent(data));
};

export const deleteEvent = (eventId: string): AppThunk => async (dispatch): Promise<void> => {
  await calendarApi.deleteEvent(eventId);

  dispatch(slice.actions.deleteEvent(eventId));
};
