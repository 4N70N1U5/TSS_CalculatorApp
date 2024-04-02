import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Platform } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
type Props = {};


const Milestones = (props: Props) => {
  console.log('props', props);
  const { route } = props;
  console.log('route', route);
  const { params } = route;
  console.log('params', params);
  const actualLongestStreak = params?.longestStreak;
  console.log('actualLongestStreak', actualLongestStreak);
  const [milestones, setMilestones] = useState([
    { title: 'One week smoke-free', targetDays: 7, isCompleted: false },
    { title: 'One month smoke-free', targetDays: 30, isCompleted: false },
    { title: 'One year smoke-free', targetDays: 365, isCompleted: false },
  ]);


  useEffect(() => {
    console.log('actualLongestStreak', actualLongestStreak);
    if (typeof actualLongestStreak !== 'number') return;
    const updatedMilestones = milestones.map((milestone) => {
      if (actualLongestStreak >= milestone.targetDays) {
        return { ...milestone, isCompleted: true };
      }
      return milestone;
    });

    setMilestones(updatedMilestones);
  }, [actualLongestStreak]);

  return (
    <View style={styles.container}>
      <FlatList
        data={milestones}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.milestoneItem}>
            <Text style={styles.milestoneTitle}>{item.title}</Text>
            {item.isCompleted ? (
              <Text style={styles.completedText}>Completed</Text>
            ) : (
              <ProgressBar
                progress={actualLongestStreak != null ? actualLongestStreak / item.targetDays : 0}
                width={Dimensions.get('window').width - 60}
                height={20}
                color={Platform.OS === 'ios' ? '#007AFF' : '#1E90FF'}
                borderRadius={5}
                style={{ marginTop: 10 }}
              />
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  milestoneItem: {
    width: Dimensions.get('window').width - 40,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  milestoneTitle: {
    fontSize: 20,
  },
  completedText: {
    fontSize: 17,
    lineHeight: 22,
    color: 'green',
    fontWeight: '600',
    marginTop: 10,
  },
});

export default Milestones;