import React, { useState, ReactElement } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, Button } from 'react-native';
import { Rating } from 'react-native-ratings'; 

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
      <View>
        <Text>Bewerte das Rezept</Text>
        <Rating
          showRating
          onFinishRating={handleRating}
        />
        <TextInput
          placeholder="Optional: Kommentar eingeben"
          value={comment}
          onChangeText={handleCommentChange}
        />
        <Button title="Bewertung absenden" onPress={handleSubmit} />
      </View>
    </Modal>
  );
};


export default RatingModal;
