import { Text, TextProps } from './Themed';
import Colors from '../constants/Colors';
import React from 'react';



export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'SpaceMono' }]} />;
}

export function AlataText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Alata', color: Colors.dark.text }]} />;
}

export function Alata12(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Alata', fontSize: 12, color: Colors.dark.text }]} />;
}

export function Alata14(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Alata', fontSize: 14, color: Colors.dark.text }]} />;
}

export function Alata16(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Alata', fontSize: 16, color: Colors.dark.text }]} />;
}

export function Alata20(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Alata', fontSize: 20, color: Colors.dark.text }]} />;
}

export function Alata22(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Alata', fontSize: 22, color: Colors.dark.text }]} />;
}

export function Alata24(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Alata', fontSize: 24, color: Colors.dark.text }]} />;
}
