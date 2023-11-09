import { Text, TextProps } from './Themed';
import Colors from '../constants/Colors';


export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'SpaceMono' }]} />;
}

export function AlataMedium(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Alata', fontSize: 12, color: Colors.dark.text }]} />;
}

export function AlataLarge(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Alata', fontSize: 18, color: Colors.dark.text }]} />;
}


