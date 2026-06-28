/**
 * ItineraryView — renders a structured AI Trip Planner response as a premium
 * Art Deco timeline instead of raw chat text.
 *
 * Expected JSON schema from the /api/ai/chat planner endpoint:
 *   ItineraryDay[] | { days: ItineraryDay[] }
 *
 * Use tryParseItinerary() to attempt extraction from any AI message content
 * (handles plain JSON arrays and markdown ```json code blocks).
 */

import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GlassCard } from './GlassCard';
import { PremiumBadge } from './PremiumBadge';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ItineraryActivity {
  time: string;
  description: string;
  location: string;
  /** 1 (standard luxury) – 5 (ultra-exclusive). */
  luxury_factor: number;
}

export interface ItineraryDay {
  day_number: number;
  title: string;
  activities: ItineraryActivity[];
}

// ─── JSON parser ─────────────────────────────────────────────────────────────

/**
 * Attempts to extract an ItineraryDay[] from an AI message string.
 * Handles:
 *   - Raw JSON array:        [{"day_number":1,...}]
 *   - Wrapped JSON object:   {"days":[...]}
 *   - Markdown code block:   ```json\n[...]\n```
 *
 * Returns null if the content is not a recognisable itinerary.
 */
export function tryParseItinerary(content: string): ItineraryDay[] | null {
  if (!content.includes('day_number')) return null; // fast-path reject

  // Strip optional markdown code fence
  const fenceMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenceMatch ? fenceMatch[1].trim() : content.trim();

  // Isolate outermost JSON array or object
  const firstBracket = raw.search(/[\[{]/);
  if (firstBracket === -1) return null;

  try {
    const parsed: unknown = JSON.parse(raw.slice(firstBracket));

    if (Array.isArray(parsed) && isItineraryArray(parsed)) {
      return parsed;
    }
    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      'days' in (parsed as Record<string, unknown>) &&
      Array.isArray((parsed as Record<string, unknown>).days) &&
      isItineraryArray((parsed as Record<string, unknown[]>).days)
    ) {
      return (parsed as { days: ItineraryDay[] }).days;
    }
    return null;
  } catch {
    return null;
  }
}

function isItineraryArray(arr: unknown[]): arr is ItineraryDay[] {
  return arr.length > 0 && typeof (arr[0] as ItineraryDay).day_number === 'number';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const LuxuryMeter = memo(({ level }: { level: number }) => {
  const filled = Math.max(1, Math.min(5, Math.round(level)));
  return (
    <View style={luxStyles.row}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Text
          key={i}
          style={[luxStyles.diamond, i < filled && luxStyles.diamondFilled]}>
          ◆
        </Text>
      ))}
    </View>
  );
});

const luxStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 2, alignItems: 'center' },
  diamond: { fontSize: 8, color: colors.textMuted },
  diamondFilled: { color: colors.primary },
});

const ActivityCard = memo(
  ({
    activity,
    isLast,
  }: {
    activity: ItineraryActivity;
    isLast: boolean;
  }) => (
    <View style={styles.activityRow}>
      {/* Timeline spine */}
      <View style={styles.spine}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.spineDot}
        />
        {!isLast && <View style={styles.spineLine} />}
      </View>

      {/* Card */}
      <GlassCard style={styles.actCard} noPadding>
        <View style={styles.actContent}>
          <View style={styles.actMeta}>
            <View style={styles.timePill}>
              <Text style={styles.timeText}>{activity.time}</Text>
            </View>
            <LuxuryMeter level={activity.luxury_factor} />
          </View>

          <Text style={styles.actDesc}>{activity.description}</Text>

          <View style={styles.locRow}>
            <Text style={styles.locPin}>◉</Text>
            <Text style={styles.locText} numberOfLines={1}>
              {activity.location}
            </Text>
          </View>
        </View>

        {activity.luxury_factor >= 4 && (
          <View style={styles.badgeRow}>
            <PremiumBadge label="Ultra Luxury" variant="gold" />
          </View>
        )}

        {/* Art Deco accent line */}
        <View style={styles.cardFooterLine} />
      </GlassCard>
    </View>
  ),
);

const DaySection = memo(({ day }: { day: ItineraryDay }) => (
  <View style={styles.dayBlock}>
    {/* Day header */}
    <LinearGradient
      colors={[colors.primaryMuted, 'transparent']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.dayHeader}>
      <View style={styles.dayHeaderInner}>
        <View style={styles.dayNumBadge}>
          <Text style={styles.dayNumText}>DAY {day.day_number}</Text>
        </View>
        <Text style={styles.dayTitle} numberOfLines={2}>
          {day.title}
        </Text>
      </View>
      {/* Left gold accent bar */}
      <View style={styles.dayLeftBar} />
    </LinearGradient>

    {/* Activity timeline */}
    <View style={styles.timeline}>
      {day.activities.map((act, idx) => (
        <ActivityCard
          key={idx}
          activity={act}
          isLast={idx === day.activities.length - 1}
        />
      ))}
    </View>
  </View>
));

// ─── Main export ──────────────────────────────────────────────────────────────

interface ItineraryViewProps {
  days: ItineraryDay[];
}

export function ItineraryView({ days }: ItineraryViewProps) {
  return (
    <View style={styles.container}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <View style={styles.headerRule} />
        <Text style={styles.headerLabel}>✦ BESPOKE ITINERARY ✦</Text>
        <View style={styles.headerRule} />
      </View>

      <View style={styles.summaryRow}>
        <PremiumBadge label={`${days.length} Days`} variant="gold" />
        <PremiumBadge
          label={`${days.reduce((n, d) => n + d.activities.length, 0)} Experiences`}
          variant="info"
        />
      </View>

      {days.map(day => (
        <DaySection key={day.day_number} day={day} />
      ))}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginVertical: spacing[4],
  },
  headerRule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.primaryBorder,
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[5],
  },
  // Day block
  dayBlock: {
    marginBottom: spacing[6],
  },
  dayHeader: {
    borderRadius: borderRadius.md,
    marginBottom: spacing[4],
    overflow: 'hidden',
    position: 'relative',
  },
  dayHeaderInner: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    paddingLeft: spacing[6],
    gap: spacing[1],
  },
  dayLeftBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.primary,
    borderTopLeftRadius: borderRadius.md,
    borderBottomLeftRadius: borderRadius.md,
  },
  dayNumBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryMuted,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  dayNumText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 2,
  },
  dayTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.3,
    lineHeight: 22,
  },
  // Timeline
  timeline: {
    paddingLeft: spacing[2],
  },
  activityRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  spine: {
    width: 14,
    alignItems: 'center',
    paddingTop: spacing[4],
  },
  spineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  spineLine: {
    flex: 1,
    width: 1,
    backgroundColor: colors.primaryBorder,
    marginTop: 3,
    marginBottom: -spacing[3],
  },
  actCard: {
    flex: 1,
  },
  actContent: {
    padding: spacing[4],
    gap: spacing[2],
  },
  actMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timePill: {
    backgroundColor: colors.primaryMuted,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  actDesc: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  locPin: {
    fontSize: 10,
    color: colors.primary,
  },
  locText: {
    fontSize: 12,
    color: colors.textMuted,
    flex: 1,
  },
  badgeRow: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  cardFooterLine: {
    height: 1.5,
    backgroundColor: colors.primaryBorder,
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    borderRadius: borderRadius.full,
  },
});
