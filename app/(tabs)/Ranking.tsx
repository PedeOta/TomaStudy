import { useTheme } from '@/hooks/theme-context';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface Player {
  id: number;
  name: string;
  xp: number;
}

// Dados fictícios com XP entre 15 e 32
const playersData: Player[] = [
  { id: 1, name: 'Alex', xp: 32 },
  { id: 2, name: 'Jordan', xp: 29 },
  { id: 3, name: 'Casey', xp: 28 },
  { id: 4, name: 'Morgan', xp: 26 },
  { id: 5, name: 'Riley', xp: 25 },
  { id: 6, name: 'Taylor', xp: 23 },
  { id: 7, name: 'Blake', xp: 21 },
  { id: 8, name: 'Jamie', xp: 20 },
  { id: 9, name: 'Skyler', xp: 18 },
  { id: 10, name: 'Drew', xp: 15 },
].sort((a, b) => b.xp - a.xp);

export default function RankingScreen() {
  const { colors } = useTheme();

  const renderRankingItem = (item: Player, index: number) => {
    const medalEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
    
    return (
      <View style={[styles.rankingItem, { backgroundColor: colors.card }]}>
        <Text style={styles.medal}>{medalEmoji}</Text>
        <View style={styles.playerInfo}>
          <Text style={[styles.playerName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.xpText, { color: colors.secondaryText }]}>XP: {item.xp}</Text>
        </View>
        <View style={[styles.xpBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.xpFill,
              { width: `${(item.xp / 32) * 100}%` },
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>🏆 Ranking</Text>
      <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Top jogadores por XP</Text>

      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {playersData.map((player, index) => (
          <View key={player.id}>
            {renderRankingItem(player, index)}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginLeft: 20,
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginLeft: 20,
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medal: {
    fontSize: 24,
    marginRight: 12,
    minWidth: 30,
    textAlign: 'center',
  },
  playerInfo: {
    flex: 1,
    marginRight: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  xpText: {
    fontSize: 12,
    color: '#999',
  },
  xpBar: {
    width: 80,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
});