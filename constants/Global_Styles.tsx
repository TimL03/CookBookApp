import { StyleSheet } from 'react-native';
import Colors from './Colors';

export default StyleSheet.create({
    defaultContainer: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    screenContainer: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        flexDirection: 'column',
        padding: 30,
        alignContent: 'center',
        justifyContent: 'space-between',
        gap: 15
    },
    fullScreenBackgroundContainer: {
        flex: 1,
        borderRadius: 20,
        backgroundColor: Colors.dark.mainColorDark,
        flexDirection: 'column',
        gap: 20,
    },
    fullScreenContentContainer: {
        padding: 30, 
        marginTop: -20, 
        backgroundColor: Colors.dark.mainColorDark, 
        borderRadius: 15, 
        flex: 1,
        gap: 20,
    },
    fullScreenContentContainerLessGap: {
        padding: 30,
        backgroundColor: Colors.dark.background,
        gap: 8,
        flex: 1,
    },
    transparentContainer: {
        backgroundColor: Colors.dark.mainColorDark,
    },

    textInput: {
        fontFamily: 'Alata',
        flex: 1,
        color: Colors.dark.text
    },

    mapHorizontal: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },

    card: {
        backgroundColor: Colors.dark.background,
        borderRadius: 20,
        padding: 20,
    },
    cardHorizontal: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 15,
        borderRadius: 10,
        padding: 12,
    },
    cardInput: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.mainColorLight,
        paddingHorizontal: 15,
        height: 50,
        borderRadius: 10,
        gap: 10,
    },
    cardInputMultiline: {
        height: 80,
        textAlignVertical: 'top',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 20,
      },

    HorizontalLayout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 5,
    },
    VerticalLayout: {
        flexDirection: 'column', 
        paddingHorizontal: 10,
        paddingTop: 5
    },
    IngredientLayout: {
        paddingVertical: 4, 
        justifyContent: 'space-between', 
        flexDirection: 'row'
    },

    roundButtonIcon: {
        height: 50,
        width: 50,
        borderRadius: 30,
        padding: 12,
        justifyContent: 'center',
    },
    squareButtonText: {
        borderRadius: 10,
        width: 200,
        padding: 10,
        justifyContent: 'center',
        alignSelf: 'center',    
    },
    switchButton: {
        backgroundColor: Colors.dark.tint, 
        padding: 10, 
        paddingHorizontal: 15,
        borderRadius: 20
    },
    iconButton: {
        alignSelf: 'center', 
        padding: 5, 
        borderRadius: 20,
    },

    modalBackgroundContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: Colors.dark.seeThrough,
    },
    modalContentContainer: {
        backgroundColor: Colors.dark.mainColorDark,
        padding: 25,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        gap: 15,
        width: '100%',
    },

    alignCenter: {
        textAlign: 'center',
        alignSelf: 'center',
    },
    textAlignVerticalTop:{
        textAlignVertical: 'top',
        paddingTop: 10,
    },
    justifyCenter: {
        justifyContent: 'center',
    },
    margin: {
        margin: 8,
    },
    marginBottom: {
        marginBottom: 5,
    },
    negativeMarginBottom: {
        marginBottom: -15,
    },
    flex: {
        flex: 1,
    }
});
