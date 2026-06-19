import React, { useState, useCallback } from 'react';
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
import PremiumScreen from '../premium/PremiumScreen';
import NotificationSettingsScreen from '../settings/NotificationSettingsScreen';
import ChangePasswordScreen from '../settings/ChangePasswordScreen';
import LanguageSelectionScreen from '../onboarding/LanguageSelectionScreen';

import { colors } from '../../theme';

export default function MainShell({ language, email, onChangeLanguage, onLogout }) {
  const [tab, setTab] = useState('discover');
  const [stack, setStack] = useState([]); // [{ name, params }]
  const [discoverKey, setDiscoverKey] = useState(0); // bump to refetch the feed
  const [profileKey, setProfileKey] = useState(0); // bump to refetch my profile

  const push = useCallback((name, params = {}) => setStack((s) => [...s, { name, params }]), []);
  const pop = useCallback(() => setStack((s) => s.slice(0, -1)), []);

  const top = stack[stack.length - 1];

  const openChat = (conversation) => push('chat', { conversation });

  const renderTab = () => {
    switch (tab) {
      case 'discover':
        return (
          <HomeScreen
            language={language}
            reloadKey={discoverKey}
            onOpenFilters={() => push('filters')}
            onOpenNotifications={() => push('notifications')}
            onViewProfile={(p) => push('profileDetail', { profile: p })}
            onMatch={(p, match) => push('matchSuccess', { profile: p, matchId: match?.id })}
          />
        );
      case 'matches':
        return (
          <MatchesScreen
            language={language}
            onOpenChat={openChat}
            onOpenProfile={(p) => push('profileDetail', { profile: p })}
            onOpenNotifications={() => push('notifications')}
          />
        );
      case 'chats':
        return (
          <ChatListScreen
            language={language}
            onOpenChat={openChat}
            onOpenNotifications={() => push('notifications')}
          />
        );
      case 'profile':
        return (
          <MyProfileScreen
            language={language}
            reloadKey={profileKey}
            onEdit={() => push('editProfile')}
            onPreferences={() => push('preferences')}
            onPrivateMode={() => push('privateMode')}
            onPrivacy={() => push('privacy')}
            onSettings={() => push('settings')}
            onPremium={() => push('premium')}
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
            onClose={pop}
            onApplied={() => { setDiscoverKey((k) => k + 1); pop(); }}
          />
        );
      case 'profileDetail':
        return <ProfileDetailScreen language={language} profile={params.profile} onBack={pop} />;
      case 'matchSuccess':
        return (
          <MatchSuccessScreen
            language={language}
            profile={params.profile}
            onContinue={pop}
            onSendMessage={(p) => {
              setStack((s) => [...s.slice(0, -1), { name: 'chat', params: { conversation: { id: params.matchId, profile: p } } }]);
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
            onBlock={pop}
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
            onBack={pop}
            onSaved={() => { setProfileKey((k) => k + 1); setDiscoverKey((k) => k + 1); pop(); }}
          />
        );
      case 'preferences':
        return (
          <PreferencesScreen
            language={language}
            onBack={pop}
            onSaved={() => { setDiscoverKey((k) => k + 1); pop(); }}
          />
        );
      case 'premium':
        return <PremiumScreen language={language} onBack={pop} onSubscribed={() => { setProfileKey((k) => k + 1); pop(); }} />;
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
            onContinue={(code) => { onChangeLanguage?.(code); pop(); }}
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
