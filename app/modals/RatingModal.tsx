import React, { useState, ReactElement } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, Button, Pressable } from 'react-native';
import { Rating } from 'react-native-ratings'; 
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { Alata20 } from '../../components/StyledText';

interface RatingModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (ratingData: { rating: number; comment: string; }) => void;
  }

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
      <View style={gStyles.modalContentContainer}>
        <Text>Bewerte das Rezept</Text>
        <Rating
          showRating
          onFinishRating={handleRating}
          ratingBackgroundColor={Colors.dark.mainColorDark}
          ratingColor={Colors.dark.tint}
        />
        <TextInput
          placeholder="Optional: Kommentar eingeben"
          value={comment}
          onChangeText={handleCommentChange}
        />
        <Pressable style={({ pressed }) => [gStyles.cardHorizontal, gStyles.justifyCenter, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]} onPress={handleSubmit}>
          <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>Submit Review</Alata20>
        </Pressable>
      </View>
    </Pressable>
    </Modal>
  );
};


export default RatingModal;
