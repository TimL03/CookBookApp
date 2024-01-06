import React, { useEffect, useState } from 'react';
import { TextInput, StyleSheet, ScrollView, View, Pressable, Text, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { db } from '../../FirebaseConfig'
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Alata16, Alata20, Alata12, AlataText } from '../../components/StyledText';
import { X, PlusCircle, Plus, Save, ChevronDown } from 'lucide-react-native';
import TopModalBar from '../../components/topModalBar';
import DropDown from '../../components/DropDown';
import { useSession } from '../../api/firebaseAuthentication/client';
import { getRecipeById, uploadImage } from '../../api/cookBookRecipesFirebase/client';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import ChooseImageAlert from '../modals/alerts/chooseImageAlert';
import InfoAlert from '../modals/alerts/infoAlert';
import { RecipeData } from '../../api/cookBookRecipesFirebase/model';

export default function AddRecipeScreen(this: any) {
  const router = useRouter();
  this.categorieInputs = [];
  this.ingredientInputs = [];
  this.stepsInputs = [];

  // Get user id from session
  const { session } = useSession();
  const userID = session;

  // Get recipe id from router params
  const params = useLocalSearchParams();
  const [recipe, setRecipe] = useState<RecipeData | null>(null);

  // Fetch recipe from database
  if (params.recipeID) {
    useEffect(() => {
      const fetchRecipe = async () => {
        const fetchedRecipe = await getRecipeById(userID.toString(), params.recipeID.toString());
        setRecipe(fetchedRecipe);
      };

      fetchRecipe();
    }, [userID, params.recipeID]);
  }

  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState('');
  const [cookHTime, setCookHTime] = useState('');
  const [cookMinTime, setCookMinTime] = useState('');
  const [categories, setCategories] = useState(['']);
  const [ingredients, setIngredients] = useState([{ name: '', unit: 'x', amount: '' },]);
  const [ingredientNames, setIngredientNames] = useState(['']);
  const [steps, setSteps] = useState(['']);
  const [imageUri, setImageUri] = useState<string | null>(null);

  React.useEffect(() => {
    if (recipe != null) {
      setEditMode(true);
      setName(recipe.name);
      setCookHTime(recipe.cookHTime);
      setCookMinTime(recipe.cookMinTime);
      setCategories(recipe.categories);
      setIngredients(recipe.ingredients);
      setIngredientNames(recipe.ingredientNames);
      setSteps(recipe.steps);
      setImageUri(recipe.imageUrl);
    }
  }, [recipe]);

  const [oneCategoryAlertVisible, setOneCategoryAlertVisible] = useState(false);
  const [chooseImageAlertVisible, setChooseImageAlertVisible] = useState(false);
  const [galeriePermissionAlertVisible, setGaleriePermissionAlertVisible] = useState(false);
  const [cameraPermissionAlertVisible, setCameraPermissionAlertVisible] = useState(false);
  
  const [multiLineHeights, setMultiLineHeights] = useState(new Array(steps.length).fill(80));
  
  const [activeDropdown, setActiveDropdown] = useState(0);
  const [saveDisabled, setSaveDisabled] = useState(false);


  const units = [
    { key: '1', value: 'tbsp' },
    { key: '2', value: 'tsp' },
    { key: '3', value: 'cup' },
    { key: '4', value: 'ml' },
    { key: '5', value: 'l' },
    { key: '6', value: 'g' },
    { key: '7', value: 'x' },
    { key: '8', value: 'pinch'}
  ];

  const addImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setGaleriePermissionAlertVisible(true);
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result && !result.canceled && result.assets) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
    }
  };

  const takePhoto = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== 'granted') {
      setCameraPermissionAlertVisible(true);
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result && !result.canceled && result.assets) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
    }
  };

  const handleSave = async () => {
    setSaveDisabled(true);
    if (categories.length === 0 || categories.some(category => !category)) {
      setSaveDisabled(false);
      setOneCategoryAlertVisible(true);
      return;
    }
    try {
      let imageUrl = imageUri;
      // Bild nur hochladen, wenn ein neues Bild ausgewählt wurde
      if (imageUri && !recipe?.imageUrl) {
        imageUrl = await uploadImage(imageUri, name);
      } 

      const recipeData = {
        name,
        cookHTime,
        cookMinTime,
        categories,
        ingredients,
        ingredientNames,
        steps,
        imageUrl,
        userID
      };

      // Bestehendes Rezept aktualisieren, falls eine ID vorhanden ist
      if (recipe && recipe.id) {
        const recipeRef = doc(db, 'recipes', recipe.id);
        await setDoc(recipeRef, recipeData);
        console.log('Rezept aktualisiert mit ID: ', recipe.id);
      } else {
        // Neues Rezept hinzufügen
        const docRef = await addDoc(collection(db, 'recipes'), recipeData);
        console.log('Dokument geschrieben mit ID: ', docRef.id);
      }
      router.push('/(tabs)/two');
    } catch (e) {
      setSaveDisabled(false);
      console.error('Fehler beim Speichern des Rezepts: ', e);
    }
  };

  useEffect(() => {
    const newIngredientNames = ingredients.map(ingredient => ingredient.name);
  
    if (!arraysEqual(newIngredientNames, ingredientNames)) {
      setIngredientNames(newIngredientNames);
    }
  }, [ingredients]);
  
  function arraysEqual(arr1: string | any[], arr2: string | any[]) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }
  
  
  const names = ingredients.map(ingredient => ingredient.name);

  const addCategory = () => {
    setCategories([...categories, '']);
    setTimeout(() => {
      this.categorieInputs[this.categorieInputs.length - 1].focus();
    }, 100);
  };

  const removeCategory = (indexToRemove: number) => {
    setCategories(categories.filter((_, index) => index !== indexToRemove));
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
    setIngredientNames(names);
    
    setTimeout(() => {
      this.ingredientInputs[this.ingredientInputs.length - 1].focus();
    }, 100);
  };

  const removeIngredient = (indexToRemove: number) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
    setIngredientNames(names.filter((_, index) => index !== indexToRemove));
  };

  const addStep = () => {
    setSteps([...steps, '']);
    setTimeout(() => {
      this.stepsInputs[this.stepsInputs.length - 1].focus();
    }, 100);
  };

  const removeStep = (indexToRemove: number) => {
    setSteps(steps.filter((_, index) => index !== indexToRemove));
  };

  const handleContentSizeChange = (index: number, height: number) => {
    setMultiLineHeights(prevHeights => {
      const newHeights = [...prevHeights];
      newHeights[index] = height + 20; // 20 is the extra space
      return newHeights;
    });
  };

  // If recipe is null (data is still loading), return a View with the same background color
  if (params.recipeID && !recipe) {
    return (
      <>
        <Stack.Screen options={{
          headerShown: false,
        }} />
        <View style={{ flex: 1, backgroundColor: Colors.dark.mainColorDark }} />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{
        headerShown: true,
        headerShadowVisible: false,
        title: editMode ? 'Edit Recipe' : 'Add a Recipe',
        headerStyle: {
          backgroundColor: Colors.dark.mainColorDark,
        },
        headerRight: () =>
          <Pressable onPress={router.back} style={({ pressed }) => [{ padding: 5, borderRadius: 20, backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]}>
            <X color={Colors.dark.text} size={28} />
          </Pressable>,
        headerLeft: () =>
          <></>
      }}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={[gStyles.defaultContainer, { backgroundColor: Colors.dark.mainColorDark }]}>
        {/* Main content */}
        <ScrollView style={[gStyles.fullScreenBackgroundContainer, { backgroundColor: Colors.dark.background }]} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>

          {/* Recipe image selection */}
          {imageUri != null ?
            <Pressable onPress={() => setChooseImageAlertVisible(true)}>
              <Image
                style={gStyles.image}
                source={{ uri: imageUri }}
              />
            </Pressable>
            :
            <Pressable onPress={() => setChooseImageAlertVisible(true)} style={({ pressed }) => [styles.addImage, { backgroundColor: pressed ? Colors.dark.background : Colors.dark.mainColorLight },]}>
              <PlusCircle color={Colors.dark.text} size={24} style={gStyles.alignCenter} />
              <Alata20>Add Image</Alata20>
            </Pressable>
          }


          <View style={[gStyles.fullScreenContentContainerLessGap]}>
            {/* adding Recipe name */}
            <Alata20>Name:</Alata20>
            <View style={gStyles.cardInput}>
              <TextInput 
                placeholder="Name" 
                value={name} 
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => { this.categorieInputs[0].focus(); }}
                onChangeText={setName} 
                style={gStyles.textInput} 
                placeholderTextColor={Colors.dark.text} />
            </View>


            {/* adding Recipe category */}
            <Alata20>Categories:</Alata20>
            <View style={styles.gap}>
              {categories.map((category, index) => (
                <View key={index} style={gStyles.cardInput}>
                  <TextInput
                    placeholder={`Category ${index + 1}`}
                    value={category}
                    returnKeyType="next"
                    blurOnSubmit={true}
                    onSubmitEditing={() => { this.categorieInputs[index + 1] != undefined ? this.categorieInputs[index + 1].focus() : null; }}
                    ref={(input) => { this.categorieInputs[index] = input; }}
                    placeholderTextColor={Colors.dark.text}
                    onChangeText={(text) => {
                      const newCategories = [...categories];
                      newCategories[index] = text;
                      setCategories(newCategories);
                    }}
                    style={gStyles.textInput}
                  />
                  <Pressable onPress={() => removeCategory(index)} style={[gStyles.iconButton, styles.marginRight]}>
                    <X color={Colors.dark.text} size={22} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
                  </Pressable>
                </View>
              ))}
              <Pressable onPress={addCategory} style={({ pressed }) => [gStyles.cardHorizontal, gStyles.justifyCenter, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint }]}>
                <Plus color={Colors.dark.text} size={28} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
              </Pressable>
            </View>



            {/* adding Recipe preparation time */}
            <Alata20>Preperation Time:</Alata20>
            <View style={[gStyles.HorizontalLayout, { gap: 12 }]}>
              <View style={[gStyles.cardInput, gStyles.flex]}>
                <TextInput 
                  inputMode="numeric" 
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => { this.minuteInput.focus(); }}
                  maxLength={2} 
                  placeholder="00" 
                  value={cookHTime} 
                  onChangeText={setCookHTime} 
                  style={gStyles.textInput} 
                  placeholderTextColor={Colors.dark.text} />
                <Alata16 style={gStyles.alignCenter}>hours</Alata16>
              </View>

              <View style={[gStyles.cardInput, gStyles.flex]}>
                <TextInput 
                  inputMode="numeric" 
                  maxLength={2} 
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => { this.ingredientInputs[0].focus(); }}
                  ref={(input) => { this.minuteInput = input; }}
                  placeholder="00" 
                  value={cookMinTime} 
                  onChangeText={setCookMinTime} 
                  style={gStyles.textInput} 
                  placeholderTextColor={Colors.dark.text} />
                <Alata16 style={gStyles.alignCenter}>minutes</Alata16>
              </View>
            </View>

            {/* adding Recipe ingredients */}
            <Alata20>Ingredients:</Alata20>
            <View style={styles.gap}>
              {ingredients.map((ingredient, index) => (
                <View key={index} style={[gStyles.HorizontalLayout, { gap: 12, zIndex: activeDropdown === index ? 1 : 0 }]}>
                  <View style={[gStyles.cardInput, { flex: 1 }]}>
                    <TextInput
                      placeholder={`Ingredient ${index + 1}`}
                      placeholderTextColor={Colors.dark.text}
                      returnKeyType="next"
                      blurOnSubmit={false}
                      onSubmitEditing={() => { this.dropDownInputs[index].focus(); }}
                      ref={(input) => { this.ingredientInputs[index] = input; }}
                      value={ingredient.name}
                      onChangeText={(text) => {
                        const newIngredients = [...ingredients];
                        newIngredients[index].name = text;
                        setIngredients(newIngredients);
                      }}
                      style={gStyles.textInput}
                    />
                    <Pressable onPress={() => removeIngredient(index)} style={[gStyles.iconButton, styles.marginRight]}>
                      <X color={Colors.dark.text} size={22} strokeWidth='2.5' />
                    </Pressable>
                  </View>
                  <View style={styles.flex2}>
                    <DropDown
                      item={units}
                      index={index}
                      selectedUnit={ingredient.unit}
                      selectedAmount={ingredient.amount}
                      onSelect={(unit, amount) => {
                        const newIngredients = [...ingredients];
                        newIngredients[index] = { ...newIngredients[index], unit, amount };
                        setIngredients(newIngredients);
                      }}
                      onDropDown={() => setActiveDropdown(index)}
                    />
                  </View>
                </View>
              ))}

              <Pressable onPress={addIngredient} style={({ pressed }) => [gStyles.cardHorizontal, gStyles.justifyCenter, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint }]}>
                <Plus color={Colors.dark.text} size={28} strokeWidth='2.5' style={gStyles.alignCenter} />
              </Pressable>
            </View>

            {/* adding Recipe steps */}
            <Alata20>Instructions:</Alata20>
            <View style={styles.gap}>
              {steps.map((step, index) => (
                <View key={index} style={[gStyles.cardInput, {height: multiLineHeights[index]}]}>
                  <TextInput
                    multiline
                    onContentSizeChange={(e) => handleContentSizeChange(index, e.nativeEvent.contentSize.height)}
                    placeholder={`Step ${index + 1}`}
                    value={step}
                    ref={(input) => { this.stepsInputs[index] = input; }}
                    placeholderTextColor={Colors.dark.text}
                    onChangeText={(text) => {
                      const newSteps = [...steps];
                      newSteps[index] = text;
                      setSteps(newSteps);
                    }}
                    style={[gStyles.textInput, gStyles.textAlignVerticalTop]}
                  />
                  <Pressable onPress={() => removeStep(index)} style={gStyles.iconButton}>
                    <X color={Colors.dark.text} size={22} strokeWidth='2.5' style={gStyles.alignCenter} />
                  </Pressable>
                </View>

              ))}
              <Pressable onPress={addStep} style={({ pressed }) => [gStyles.cardHorizontal, gStyles.justifyCenter, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
                <Plus color={Colors.dark.text} size={28} strokeWidth='2.5' style={gStyles.alignCenter} />
              </Pressable>
            </View>

            {/* Save button */}
            <Pressable disabled={saveDisabled} onPress={() => {handleSave()}} style={({ pressed }) => [gStyles.cardHorizontal, gStyles.justifyCenter, { marginTop: 30, backgroundColor: saveDisabled ? Colors.dark.mainColorDark : pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
              <Save color={Colors.dark.text} size={28} style={gStyles.alignCenter} />
              <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>{editMode ? 'Save Changes' : 'Save Recipe'}</Alata20>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Alerts */}
      <InfoAlert
        title='Error'
        message='You need to add at least one category'
        buttonText='ok'
        alertModalVisible={oneCategoryAlertVisible}
        setAlertModalVisible={setOneCategoryAlertVisible}
      />
      <InfoAlert
        title='Error'
        message='You need to allow access to your galerie to take a photo'
        buttonText='ok'
        alertModalVisible={galeriePermissionAlertVisible}
        setAlertModalVisible={setGaleriePermissionAlertVisible}
      />
      <InfoAlert
        title='Error'
        message='You need to allow access to your camera to take a photo'
        buttonText='ok'
        alertModalVisible={cameraPermissionAlertVisible}
        setAlertModalVisible={setCameraPermissionAlertVisible}
      />
      <ChooseImageAlert
        title='Choose Image'
        message='Please select an option'
        optionOneText='Open Gallery'
        optionTwoText='Take Photo'
        cancelText='Cancel'
        alertModalVisible={chooseImageAlertVisible}
        setAlertModalVisible={setChooseImageAlertVisible}
        optionOneConfirm={addImage}
        optionTwoConfirm={takePhoto}
      />
    </>
  );
}


const styles = StyleSheet.create({
  gap: {
    gap: 20,
  },
  flex2: {
    flex: 1,
    flexDirection: 'column',
  },
  marginRight: {
    marginRight: -4,
  },
  addImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    backgroundColor: Colors.dark.mainColorLight,
    borderRadius: 20,
  }
});