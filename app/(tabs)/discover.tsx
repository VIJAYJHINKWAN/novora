import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { PageTurnTextField } from '../../components/PageTurnTextField';
import { PageTurnBadge } from '../../components/PageTurnBadge';
import { PageTurnButton } from '../../components/PageTurnButton';
import { SlideIndicatorScrollView } from '../../components/SlideIndicatorScrollView';

export default function DiscoverScreen() {
  const {
    events,
    searchQuery,
    setSearchQuery,
    selectedEventCategory,
    setEventCategory,
    toggleEventRsvp,
  } = useApp();

  const categories = ['All', 'Poetry Circles', 'Book Exchange', 'Book Fairs', 'Reading Clubs'];

  const filteredEvents = events.filter(e => {
    const matchCategory = selectedEventCategory === 'All' || e.category === selectedEventCategory;
    const matchSearch = !searchQuery.trim() ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Events & Salons</Text>
        <Text style={styles.headerSubtitle}>Find literary gatherings near your city.</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Input */}
        <View style={styles.searchSection}>
          <PageTurnTextField
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search events, locations, or topics..."
            iconName="search-outline"
          />
        </View>

        {/* Category Chips */}
        <SlideIndicatorScrollView
          style={styles.chipsContainer}
          contentContainerStyle={{ paddingRight: 24 }}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, selectedEventCategory === cat && styles.chipActive]}
              onPress={() => setEventCategory(cat)}
            >
              <Text style={[styles.chipText, selectedEventCategory === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </SlideIndicatorScrollView>

        {/* Events List */}
        <View style={styles.listSection}>
          {filteredEvents.map(event => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.dateBadge}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.primaryAccent} />
                  <Text style={styles.dateText}>{event.date}</Text>
                </View>
                <PageTurnBadge text={event.category} isAccent />
              </View>

              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.organizer}>Hosted by {event.organizer}</Text>

              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={14} color={Colors.secondaryText} />
                <Text style={styles.infoText}>{event.time}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={14} color={Colors.secondaryText} />
                <Text style={styles.infoText}>{event.location}</Text>
              </View>

              <Text style={styles.description}>{event.description}</Text>

              <View style={styles.cardFooter}>
                <PageTurnButton
                  text={event.isRsvped ? "RSVP'd ✓" : "RSVP Now"}
                  isSecondary={event.isRsvped}
                  onPress={() => toggleEventRsvp(event)}
                  style={styles.rsvpBtn}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: Colors.secondaryBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  chipsContainer: {
    paddingLeft: 20,
    marginVertical: 12,
  },
  chip: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: Colors.primaryAccent,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  listSection: {
    paddingHorizontal: 20,
  },
  eventCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
    marginLeft: 4,
  },
  eventTitle: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  organizer: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginLeft: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.primaryText,
    marginTop: 10,
    marginBottom: 14,
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  rsvpBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
});
