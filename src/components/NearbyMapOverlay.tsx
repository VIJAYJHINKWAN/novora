import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants/theme';
import { Reader } from '../types';
import { UserAvatar } from './UserAvatar';
import { PageTurnBadge } from './PageTurnBadge';
import { PageTurnButton } from './PageTurnButton';
import { useApp } from '../context/AppContext';

let WebView: any = null;
if (Platform.OS !== 'web') {
  try {
    WebView = require('react-native-webview').WebView;
  } catch (e) {
    console.warn('WebView native module not found');
  }
}

interface NearbyMapOverlayProps {
  onDismiss: () => void;
}

export const NearbyMapOverlay: React.FC<NearbyMapOverlayProps> = ({ onDismiss }) => {
  const { readers, selectReader } = useApp();
  const [selectedPin, setSelectedPin] = useState<Reader | null>(readers[0] || null);

  // Default GPS coordinates (Indiranagar, Bengaluru)
  const [userCoords, setUserCoords] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
  });

  const [loadingLocation, setLoadingLocation] = useState(true);

  // Obtain Real Device GPS Location via expo-location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          setUserCoords({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      } catch (err) {
        console.warn('Location position error:', err);
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);

  // Prepare reader markers with realistic coordinates around user
  const readerMarkers = readers.map((reader, idx) => {
    const latOffsets = [0.0035, -0.0052, 0.0078, -0.0085, 0.0062];
    const lngOffsets = [0.0042, 0.0075, -0.0068, -0.0092, 0.0081];

    const lat = userCoords.latitude + (latOffsets[idx % latOffsets.length] || 0.004);
    const lng = userCoords.longitude + (lngOffsets[idx % lngOffsets.length] || 0.004);

    return {
      id: reader.id,
      name: reader.name,
      matchPercentage: reader.matchPercentage,
      lat,
      lng,
    };
  });

  // Generate Leaflet HTML Map document with CartoDB Voyager tiles
  const leafletHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body, html, #map {
      margin: 0; padding: 0; width: 100%; height: 100%;
      background-color: #F8F9FA;
    }
    .custom-pin {
      background: #FFFFFF;
      border: 2px solid #C18C5D;
      border-radius: 50%;
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      font-family: sans-serif;
      font-weight: bold;
      font-size: 13px;
      color: #C18C5D;
      position: relative;
    }
    .pin-badge {
      position: absolute;
      bottom: -6px;
      right: -6px;
      background: #708A81;
      color: #FFFFFF;
      font-size: 8px;
      font-weight: bold;
      border-radius: 8px;
      padding: 1px 4px;
    }
    .user-pin {
      background: #C18C5D;
      color: #FFFFFF;
      border: 2px solid #FFFFFF;
      box-shadow: 0 0 0 8px rgba(193, 140, 93, 0.25);
    }
    .leaflet-control-attribution { display: none !important; }
    .leaflet-control-zoom { display: none !important; } /* NO ZOOM BUTTONS */
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([${userCoords.latitude}, ${userCoords.longitude}], 15);

    // High-resolution CartoDB Voyager Map Tiles (NO API KEY REQUIRED)
    L.tileLayer('https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png', {
      maxZoom: 19
    }).addTo(map);

    // User Location Marker
    var userIcon = L.divIcon({
      className: 'custom-pin user-pin',
      html: '📍',
      iconSize: [38, 38]
    });
    L.marker([${userCoords.latitude}, ${userCoords.longitude}], { icon: userIcon })
      .addTo(map)
      .bindPopup("<b>You are here</b><br>Indiranagar");

    // Reader Markers
    var readersData = ${JSON.stringify(readerMarkers)};
    readersData.forEach(function(r) {
      var initials = r.name.split(' ').map(function(n){ return n[0]; }).join('').substring(0, 2);
      var iconHtml = '<div class="custom-pin">' + initials + '<div class="pin-badge">' + r.matchPercentage + '%</div></div>';
      var customIcon = L.divIcon({
        className: '',
        html: iconHtml,
        iconSize: [38, 38]
      });

      var marker = L.marker([r.lat, r.lng], { icon: customIcon }).addTo(map);
      marker.on('click', function() {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SELECT_READER', id: r.id }));
        }
      });
    });
  </script>
</body>
</html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'SELECT_READER') {
        const found = readers.find(r => r.id === data.id);
        if (found) setSelectedPin(found);
      }
    } catch (e) {
      console.warn('WebView message error:', e);
    }
  };

  return (
    <Modal animationType="slide" transparent={false} visible onRequestClose={onDismiss}>
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onDismiss}>
            <Ionicons name="arrow-back" size={24} color={Colors.primaryText} />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Nearby Readers Map</Text>
            <Text style={styles.headerSubtitle}>
              {loadingLocation ? "Locating your GPS position..." : "Use 2-finger pinch & double-tap to zoom"}
            </Text>
          </View>

          {loadingLocation && (
            <ActivityIndicator size="small" color={Colors.primaryAccent} style={{ marginLeft: 8 }} />
          )}
        </View>

        {/* Cross-Platform Real OpenStreetMap View */}
        <View style={styles.mapContainer}>
          {Platform.OS === 'web' ? (
            <iframe
              srcDoc={leafletHtml}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Nearby Readers Map"
            />
          ) : (
            WebView && (
              <WebView
                originWhitelist={['*']}
                source={{ html: leafletHtml }}
                style={styles.webView}
                onMessage={handleMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                scalesPageToFit={true}
              />
            )
          )}
        </View>

        {/* Selected Reader Card Drawer */}
        {selectedPin && (
          <View style={styles.drawerCard}>
            <View style={styles.drawerHeader}>
              <UserAvatar name={selectedPin.name} size={48} />

              <View style={styles.drawerMeta}>
                <View style={styles.nameRow}>
                  <Text style={styles.readerName}>{selectedPin.name}</Text>
                  {selectedPin.verificationBadge && (
                    <Ionicons name="checkmark-circle" size={16} color={Colors.primaryAccent} style={{ marginLeft: 4 }} />
                  )}
                </View>
                <Text style={styles.readerLocation}>📍 {selectedPin.location}</Text>
                <Text style={styles.readerScore}>{selectedPin.matchPercentage}% Match • {selectedPin.readingScore} pts</Text>
              </View>
            </View>

            <Text style={styles.readerBio} numberOfLines={2}>{selectedPin.bio}</Text>

            <View style={styles.genresRow}>
              {selectedPin.genres.split(',').map((g, idx) => (
                <PageTurnBadge key={idx} text={g.trim()} isAccent style={{ marginRight: 6, marginTop: 4 }} />
              ))}
            </View>

            <View style={styles.drawerActions}>
              <PageTurnButton
                text="View Full Profile & Books"
                onPress={() => {
                  onDismiss();
                  selectReader(selectedPin);
                }}
                iconName="person"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: Colors.secondaryBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeBtn: {
    padding: 6,
    marginRight: 10,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  headerSubtitle: {
    fontSize: 11,
    color: Colors.secondaryText,
  },
  mapContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  drawerCard: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  drawerMeta: {
    marginLeft: 12,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readerName: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  readerLocation: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  readerScore: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.successAccent,
    marginTop: 2,
  },
  readerBio: {
    fontSize: 12,
    lineHeight: 17,
    color: Colors.secondaryText,
    marginBottom: 8,
  },
  genresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  drawerActions: {
    flexDirection: 'row',
  },
});
