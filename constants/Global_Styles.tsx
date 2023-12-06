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

    textInput: {
        fontFamily: 'Alata',
        flex: 1,
        color: Colors.dark.text
    },

    mapHorizontal: {
        flexDirection: 'row', 
        marginBottom: 20, 
        flexWrap: 'wrap'
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
        paddingHorizontal: 10,
        height: 45,
        borderRadius: 10,
        gap: 10,
    },

    roundButtonIcon: {
        height: 50,
        width: 50,
        borderRadius: 30,
        padding: 12,
        justifyContent: 'center',
        marginBottom: -15,
        marginTop: 10,
    },
    squareButtonText: {
        borderRadius: 10,
        width: 200,
        padding: 10,
        justifyContent: 'center',
        alignSelf: 'center',    
    },

    modalBackgroundContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#0000'
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
    justifyCenter: {
        justifyContent: 'center',
    },
    margin: {
        margin: 8,
    },
    marginBottom: {
        marginBottom: 5,
    },
});
