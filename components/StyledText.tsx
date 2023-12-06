import { Text, TextProps } from './Themed';
import Colors from '../constants/Colors';
import React from 'react';



export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'SpaceMono' }]} />;
}

export function AlataText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Alata', color: Colors.dark.text }]} />;
}

export function AlataMedium(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Alata', fontSize: 12, color: Colors.dark.text }]} />;
}

export function AlataLarge(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Alata', fontSize: 20, color: Colors.dark.text }]} />;
}

export function AlataLargeMiddle(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Alata', fontSize: 24, color: Colors.dark.text, textAlign: 'center'}]} />;
}


