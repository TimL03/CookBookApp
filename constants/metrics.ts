import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const metrics = {
    ScreenWidth: width < height ? width : height,
    ScreenHeight: width < height ? height : width,
};

export default metrics;
