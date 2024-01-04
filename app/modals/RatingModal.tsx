import React, { useState, ReactElement } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Button, Pressable } from 'react-native';
import { Rating } from 'react-native-ratings'; 
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { Alata20, Alata24 } from '../../components/StyledText';

interface RatingModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (ratingData: { rating: number; comment: string; }) => void;
  }

  const starImage = require('../../assets/images/star.png');

  const RatingModal = ({ isVisible, onClose, onSubmit }: RatingModalProps): ReactElement => {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');

  const handleRating = (value: number) => {
    console.log('Received rating:', value);
    setRating(value);
  };

  const handleCommentChange = (text: string) => {
    setComment(text);
  };

  const handleSubmit = async () => {
    const ratingData = {
      rating,
      comment,
    };

    await onSubmit(ratingData);
    onClose();
    
  };


  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
    <Pressable style={gStyles.modalBackgroundContainer}>
      <View style={[gStyles.modalContentContainer,{backgroundColor: Colors.dark.background}]}>
        <Alata24 style={gStyles.alignCenter}>Rate the Recipe</Alata24>
        <Rating
          type='custom'
          ratingImage={starImage}
          ratingColor={Colors.dark.rating}
          ratingBackgroundColor={Colors.dark.background}
          style={{ paddingVertical: 10}}
          showRating
          onFinishRating={handleRating}
          imageSize={40}
          
        />
        <Alata20>Comment:</Alata20>
        <View style={[gStyles.cardInput, gStyles.cardInputMultiline]}>
          <TextInput
            multiline
            numberOfLines={3}
            style={[gStyles.textInput, gStyles.textAlignVerticalTop]}
            placeholder="Optional comment"
            value={comment}
            onChangeText={handleCommentChange}
            placeholderTextColor={Colors.dark.text}
            />
        </View>
        <Pressable style={({ pressed }) => [gStyles.cardHorizontal, gStyles.justifyCenter, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]} onPress={handleSubmit}>
          <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>Submit Review</Alata20>
        </Pressable>
      </View>
    </Pressable>
    </Modal>
  );
};


export default RatingModal;

const styles = StyleSheet.create({
  ratingContainerStyle: {
    backgroundColor: Colors.dark.background,
  },
});
