import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import { fromIsoDate, toIsoDate, type IsoDate } from '@/lib/date';

interface Props {
  value: IsoDate;
  onChange: (date: IsoDate) => void;
}

/** Opens the Android date dialog (iOS uses the calendar sheet in DateStrip). */
export function openAndroidDatePicker({ value, onChange }: Props) {
  DateTimePickerAndroid.open({
    value: fromIsoDate(value),
    mode: 'date',
    maximumDate: new Date(),
    onChange: (event, date) => {
      if (event.type === 'set' && date) onChange(toIsoDate(date));
    },
  });
}
