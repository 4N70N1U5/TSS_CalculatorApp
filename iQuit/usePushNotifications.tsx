// NotificationService.js
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

const requestNotificationPermission = async () => {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  if (status !== 'granted') {
    console.log('Permission to receive push notifications denied');
  }
};

const titles = [
  'Celebrate a Smoke-Free Day!',
  'Your Health Journey Continues',
  'Embrace the Smoke-Free Lifestyle',
  'You\'re One Step Closer to Wellness',
  'Enjoy the Benefits of Being Smoke-Free',
  'Cheers to a Healthier You!',
  'Every Breath Counts!',
  'Your Lungs Thank You!',
  'Today, Choose Health',
  'Unlock a Better Future!',
];

const bodies = [
  'Celebrate your commitment to a smoke-free day! You\'re making great progress.',
  'Your health journey is on the right track. Keep going and enjoy the positive changes!',
  'Embrace the benefits of a smoke-free lifestyle. Your body thanks you for the positive choice!',
  'Congratulations! You\'re one step closer to wellness with each smoke-free moment.',
  'Enjoy the numerous benefits of being smoke-free. Your body is healing and thriving!',
  'Cheers to a healthier you! Every smoke-free day is a victory for your well-being.',
  'Every breath counts! Keep making healthy choices and breathing in fresh air.',
  'Your lungs thank you for the decision to quit smoking. Breathe freely and live well.',
  'Today, choose health over cigarettes. Your body will continue to thank you for it.',
  'Unlock a better future by staying smoke-free. Your journey to a healthier life is amazing!',
];

const getRandomItem = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const scheduleNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: getRandomItem(titles),
      body: getRandomItem(bodies),
      data: { data: '' },
    },
    trigger: { seconds: 3600 * 24 },  
  });
};

export { requestNotificationPermission, scheduleNotification };
