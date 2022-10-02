import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { collection, getDocs } from "firebase/firestore"

export async function getAllArticleData() {
	const firebaseConfig = {
		apiKey: "AIzaSyB1fgZoQxuOlrakM_HDnSBFXsXcuJyeJ9E",
		authDomain: "bifyellowpages-website.firebaseapp.com",
		projectId: "bifyellowpages-website",
		storageBucket: "bifyellowpages-website.appspot.com",
		messagingSenderId: "971157057889",
		appId: "1:971157057889:web:7a9f0cb88fb7e803f05520",
		measurementId: "G-GNCPCMKHZS"
	}

	const app = initializeApp(firebaseConfig)
	var urlify = require('urlify').create();
	var res = []
	const db = getFirestore(app)
	const querySnapshot = await getDocs(collection(db, "articles"))
	querySnapshot.forEach((doc) => {
		console.log(`${doc.id} => ${doc.data().title}`)
		const id = doc.id
		const title = doc.data().title
		const author = doc.data().author
		const date = doc.data().date.toDate().toLocaleDateString()
		const url = date + '/' + urlify(title)
		res.push({
			id,
			url, 
			date, 
			author,
			title,
		})
	})

	return res
}