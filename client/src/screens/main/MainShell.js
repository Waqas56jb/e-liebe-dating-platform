import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';

import BottomTabBar from '../../components/discovery/BottomTabBar';
import HomeScreen from '../home/HomeScreen';
import FiltersScreen from '../home/FiltersScreen';
import ProfileDetailScreen from '../home/ProfileDetailScreen';
import MatchesScreen from '../matches/MatchesScreen';
import ChatListScreen from '../messaging/ChatListScreen';
import ChatScreen from '../messaging/ChatScreen';
import NotificationsScreen from '../notifications/NotificationsScreen';
import MatchSuccessScreen from '../match/MatchSuccessScreen';
import MyProfileScreen from '../profile/MyProfileScreen';
import EditProfileScreen from '../profile/EditProfileScreen';
import PreferencesScreen from '../profile/PreferencesScreen';
import PrivacySettingsScreen from '../profile/PrivacySettingsScreen';
import PrivateModeScreen from '../private/PrivateModeScreen';
import SettingsScreen from '../settings/SettingsScreen';
import NotificationSettingsScreen from '../settings/NotificationSettingsScreen';
import ChangePasswordScreen from '../settings/ChangePasswordScreen';
import LanguageSelectionScreen from '../onboarding/LanguageSelectionScreen';

import { PROFILES, DEFAULT_FILTERS } from '../../constants/profiles';
import { colors } from '../../theme';

function applyFilters(profiles, f) {
  return profiles.filter((p) => {
    if (p.age < f.ageMin || p.age > f.ageMax) return false;
    if (p.distance > f.distanceMax) return false;
    if (f.religion.length > 0 && !f.religion.includes(p.religion)) return false;
    if (f.interests.length > 0 && !p.interests.some((k) => f.interests.includes(k))) return false;
    return true;
  });
}
const filtersActiveOf = (f) =>
  f.ageMin !== DEFAULT_FILTERS.ageMin ||
  f.ageMax !== DEFAULT_FILTERS.ageMax ||
  f.distanceMax !== DEFAULT_FILTERS.distanceMax ||
  f.religion.length > 0 ||
  f.interests.length > 0;

export default function MainShell({ language, email, profile, onChangeLanguage, onLogout }) {
  const [tab, setTab] = useState('discover');
  const [stack, setStack] = useState([]); // [{ name, params }]
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filtersKey, setFiltersKey] = useState(0);
  const [myProfile, setMyProfile] = useState(profile);

  const push = useCallback((name, params = {}) => setStack((s) => [...s, { name, params }]), []);
  const pop = useCallback(() => setStack((s) => s.slice(0, -1)), []);
  const reset = useCallback(() => setStack([]), []);

  const visibleProfiles = useMemo(() => applyFilters(PROFILES, filters), [filters]);

  const top = stack[stack.length - 1];

  const renderTab = () => {
    switch (tab) {
      case 'discover':
        return (
          <HomeScreen
            language={language}
            profiles={visibleProfiles}
            filtersActive={filtersActiveOf(filters)}
            filtersKey={String(filtersKey)}
            onOpenFilters={() => push('filters')}
            onOpenNotifications={() => push('notifications')}
            onViewProfile={(p) => push('profileDetail', { profile: p })}
            onMatch={(p) => push('matchSuccess', { profile: p })}
          />
        );
      case 'matches':
        return (
          <MatchesScreen
            language={language}
            onOpenChat={(c) => push('chat', { conversation: c })}
            onOpenNotifications={() => push('notifications')}
          />
        );
      case 'chats':
        return (
          <ChatListScreen
            language={language}
            onOpenChat={(c) => push('chat', { conversation: c })}
            onOpenNotifications={() => push('notifications')}
          />
        );
      case 'profile':
        return (
          <MyProfileScreen
            language={language}
            profile={myProfile}
            onEdit={() => push('editProfile')}
            onPreferences={() => push('preferences')}
            onPrivateMode={() => push('privateMode')}
            onPrivacy={() => push('privacy')}
            onSettings={() => push('settings')}
          />
        );
      default:
        return null;
    }
  };

  const renderStackScreen = (entry) => {
    const { name, params } = entry;
    switch (name) {
      case 'filters':
        return (
          <FiltersScreen
            language={language}
            filters={filters}
            onClose={pop}
            onApply={(next) => {
              setFilters(next);
              setFiltersKey((k) => k + 1);
              pop();
            }}
          />
        );
      case 'profileDetail':
        return (
          <ProfileDetailScreen
            language={language}
            profile={params.profile}
            onBack={pop}
            onLike={pop}
            onPass={pop}
            onSuperLike={pop}
          />
        );
      case 'matchSuccess':
        return (
          <MatchSuccessScreen
            language={language}
            profile={params.profile}
            onContinue={pop}
            onSendMessage={(p) => {
              setStack((s) => [
                ...s.slice(0, -1),
                { name: 'chat', params: { conversation: { id: `new-${p.id}`, profileId: p.id, online: true, unread: 0, time: '', lastMessage: { de: '', en: '' } } } },
              ]);
              setTab('chats');
            }}
          />
        );
      case 'chat':
        return (
          <ChatScreen
            language={language}
            conversation={params.conversation}
            onBack={pop}
            onViewProfile={(p) => push('profileDetail', { profile: p })}
            onBlock={() => pop()}
          />
        );
      case 'notifications':
        return (
          <NotificationsScreen
            language={language}
            onBack={pop}
            onOpenProfile={(p) => push('profileDetail', { profile: p })}
          />
        );
      case 'editProfile':
        return (
          <EditProfileScreen
            language={language}
            profile={myProfile}
            onBack={pop}
            onSave={(data) => {
              setMyProfile((prev) => ({ ...(prev || {}), ...data }));
              pop();
            }}
          />
        );
      case 'preferences':
        return (
          <PreferencesScreen
            language={language}
            filters={filters}
            onBack={pop}
            onSave={(prefs) => {
              setFilters((f) => ({ ...f, ageMin: prefs.ageMin, ageMax: prefs.ageMax, distanceMax: prefs.distanceMax, religion: prefs.religion }));
              setFiltersKey((k) => k + 1);
              pop();
            }}
          />
        );
      case 'privacy':
        return <PrivacySettingsScreen language={language} onBack={pop} />;
      case 'privateMode':
        return <PrivateModeScreen language={language} onBack={pop} />;
      case 'settings':
        return (
          <SettingsScreen
            language={language}
            email={email}
            onBack={pop}
            onNotifications={() => push('notifSettings')}
            onPrivacy={() => push('privacy')}
            onLanguage={() => push('language')}
            onChangePassword={() => push('changePassword')}
            onDeleteAccount={onLogout}
            onLogout={onLogout}
          />
        );
      case 'notifSettings':
        return <NotificationSettingsScreen language={language} onBack={pop} />;
      case 'changePassword':
        return <ChangePasswordScreen language={language} onBack={pop} onSaved={pop} />;
      case 'language':
        return (
          <LanguageSelectionScreen
            onBack={pop}
            onContinue={(code) => {
              onChangeLanguage?.(code);
              pop();
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.content}>{top ? renderStackScreen(top) : renderTab()}</View>
      {!top && <BottomTabBar language={language} active={tab} onChange={setTab} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  content: { flex: 1 },
});
