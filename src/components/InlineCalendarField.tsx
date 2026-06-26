import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type InlineCalendarFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function InlineCalendarField({ label, value, onChange }: InlineCalendarFieldProps) {
  const initialDate = value ? new Date(value) : new Date();
  const [open, setOpen] = useState(false);
  const [monthDate, setMonthDate] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));

  const monthTitle = monthDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const days = useMemo(() => {
    const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay();
    const totalDays = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    const cells: Array<{ key: string; day?: number }> = [];

    for (let index = 0; index < firstDay; index += 1) {
      cells.push({ key: `empty-${index}` });
    }

    for (let day = 1; day <= totalDays; day += 1) {
      cells.push({ key: `day-${day}`, day });
    }

    return cells;
  }, [monthDate]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.field} onPress={() => setOpen(current => !current)}>
        <Text style={styles.value}>{value || 'Select date'}</Text>
      </Pressable>
      {open ? (
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <Pressable style={styles.navButton} onPress={() => setMonthDate(current => new Date(current.getFullYear(), current.getMonth() - 1, 1))}>
              <Text style={styles.navText}>{'<'}</Text>
            </Pressable>
            <Text style={styles.monthTitle}>{monthTitle}</Text>
            <Pressable style={styles.navButton} onPress={() => setMonthDate(current => new Date(current.getFullYear(), current.getMonth() + 1, 1))}>
              <Text style={styles.navText}>{'>'}</Text>
            </Pressable>
          </View>
          <View style={styles.weekdaysRow}>
            {weekdays.map(day => (
              <Text key={day} style={styles.weekday}>{day}</Text>
            ))}
          </View>
          <View style={styles.grid}>
            {days.map(cell => {
              if (!cell.day) {
                return <View key={cell.key} style={styles.dayCell} />;
              }

              const selectedValue = formatDate(monthDate.getFullYear(), monthDate.getMonth(), cell.day);
              const active = selectedValue === value;

              return (
                <Pressable
                  key={cell.key}
                  style={[styles.dayCell, styles.dayButton, active && styles.dayButtonActive]}
                  onPress={() => {
                    onChange(selectedValue);
                    setOpen(false);
                  }}>
                  <Text style={[styles.dayText, active && styles.dayTextActive]}>{cell.day}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    gap: 8,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  field: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  value: {
    color: colors.textPrimary,
  },
  calendarCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  navText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  monthTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekday: {
    width: '14.28%',
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButton: {
    borderRadius: 12,
  },
  dayButtonActive: {
    backgroundColor: colors.primary,
  },
  dayText: {
    color: colors.textPrimary,
  },
  dayTextActive: {
    color: colors.background,
    fontWeight: '700',
  },
});