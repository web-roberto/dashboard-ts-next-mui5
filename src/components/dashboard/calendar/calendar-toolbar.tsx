import type { ChangeEvent, ElementType, FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import ViewConfigIcon from '@mui/icons-material/ViewComfy';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ViewDayIcon from '@mui/icons-material/ViewDay';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import { ChevronLeft as ChevronLeftIcon } from '../../../icons/chevron-left';
import { ChevronRight as ChevronRightIcon } from '../../../icons/chevron-right';
import { Plus as PlusIcon } from '../../../icons/plus';
import type { CalendarView } from '../../../types/calendar';

interface CalendarToolbarProps {
  children?: ReactNode;
  date: Date;
  mobile?: boolean;
  onAddClick?: () => void;
  onDateNext?: () => void;
  onDatePrev?: () => void;
  onDateToday?: () => void;
  onViewChange?: (view: CalendarView) => void;
  view: CalendarView;
}

interface ViewOption {
  icon: ElementType;
  label: string;
  value: CalendarView;
}

const viewOptions: ViewOption[] = [
  {
    icon: ViewConfigIcon,
    label: 'Month',
    value: 'dayGridMonth'
  },
  {
    icon: ViewWeekIcon,
    label: 'Week',
    value: 'timeGridWeek'
  },
  {
    icon: ViewDayIcon,
    label: 'Day',
    value: 'timeGridDay'
  },
  {
    icon: ViewAgendaIcon,
    label: 'Agenda',
    value: 'listWeek'
  }
];

export const CalendarToolbar: FC<CalendarToolbarProps> = (props) => {
  const {
    date,
    mobile,
    onAddClick,
    onDateNext,
    onDatePrev,
    onDateToday,
    onViewChange,
    view,
    ...other
  } = props;

  const handleViewChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onViewChange?.(event.target.value as CalendarView);
  };

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        px: 3,
        flexDirection: {
          xs: 'column',
          md: 'row'
        }
      }}
      {...other}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          mb: {
            xs: 2,
            md: 0
          },
          mr: 2
        }}
      >
        <Typography variant="h5">
          {format(date, 'MMMM')}
        </Typography>
        <Typography
          sx={{
            fontWeight: 400,
            ml: 1
          }}
          variant="h5"
        >
          {format(date, 'y')}
        </Typography>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          flexWrap: 'wrap',
          display: 'flex',
          m: -1
        }}
      >
        <Box sx={{ m: 1 }}>
          <IconButton onClick={onDatePrev}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={onDateNext}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
        <TextField
          label="View"
          name="view"
          onChange={handleViewChange}
          select
          size="small"
          value={view}
          sx={{
            ml: {
              xs: 'auto',
              md: 1
            },
            m: 1,
            minWidth: 120
          }}
          SelectProps={{ native: true }}
        >
          {viewOptions.map((viewOption) => {
            // On mobile allow only timeGridDay and agenda views
            if (mobile && !['timeGridDay', 'listWeek'].includes(viewOption.value)) {
              return null;
            }

            return (
              <option
                key={viewOption.value}
                value={viewOption.value}
              >
                {viewOption.label}
              </option>
            );
          })}
        </TextField>
        <Button
          onClick={onAddClick}
          startIcon={<PlusIcon fontSize="small" />}
          sx={{
            m: 1,
            order: {
              xs: -1,
              md: 0
            },
            width: {
              xs: '100%',
              md: 'auto'
            }
          }}
          variant="contained"
        >
          New Event
        </Button>
      </Box>
    </Box>
  );
};

CalendarToolbar.propTypes = {
  children: PropTypes.node,
  date: PropTypes.instanceOf(Date).isRequired,
  mobile: PropTypes.bool,
  onAddClick: PropTypes.func,
  onDateNext: PropTypes.func,
  onDatePrev: PropTypes.func,
  onDateToday: PropTypes.func,
  onViewChange: PropTypes.func,
  view: PropTypes.oneOf([
    'dayGridMonth',
    'timeGridWeek',
    'timeGridDay',
    'listWeek'
  ])
};
