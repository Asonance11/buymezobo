import { initializeApp } from 'firebase/app';
import { getStorage, ref } from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyCLxyHSIgWFYxLxDOW-BXO2D9LGiplUr8U',
	authDomain: 'buymezobo-b6e70.firebaseapp.com',
	projectId: 'buymezobo-b6e70',
	storageBucket: 'buymezobo-b6e70.appspot.com',
	messagingSenderId: '221802979129',
	appId: '1:221802979129:web:d01058354ce4299fe912e8',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseStorage = getStorage(firebaseApp);

