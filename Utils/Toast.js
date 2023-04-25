import Toast from 'react-native-root-toast';

export function Warn(message) {
  try {
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  } catch (e) {

  }
}
