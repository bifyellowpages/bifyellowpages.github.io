import { initializeApp } from "firebase/app"
import { doc, getFirestore, collection, getDocs, getDoc } from "firebase/firestore"
import { getDownloadURL, getStorage, getStream, ref, getBytes } from "firebase/storage";

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
	// var urlify = require('urlify').create();
	var res = []
	const db = getFirestore(app)
	const querySnapshot = await getDocs(collection(db, "articles"))
	querySnapshot.forEach((doc) => {
		console.log(`${doc.id} => ${doc.data().title}`)
		const id = doc.id
		const title = doc.data().title
		const author = doc.data().author
		const date = doc.data().date.toDate().toISOString().substr(0,10)
		res.push({
			id,
			date, 
			author,
			title
		})
	})

	return res.sort(({ date: a }, { date: b }) => {
		if (a < b) {
		  return 1;
		} else if (a > b) {
		  return -1;
		} else {
		  return 0;
		}
	  });
}
export async function getArticleContent(id) {
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
	const db = getFirestore(app)
	const article = await getDoc(doc(db, "articles", id))
	const cont = article.data()
	cont.date = cont.date.toDate().toISOString().substr(0,10)

	const storage = getStorage(app)
	const markdownRef = ref(storage, article.data().path)
	// console.log(article.data().path)

	const bytes = await getBytes(markdownRef);
	// console.log(bytes)

	const dec = new TextDecoder();
	const markdown = dec.decode(bytes);
	// console.log(markdown);

	return {
		id,
		...cont,
		markdown
	}
}

export async function getAllArticleIds() {
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
	const db = getFirestore(app)
	const querySnapshot = await getDocs(collection(db, "articles"))
	var res = []
	querySnapshot.forEach((doc) => {
		const id = doc.id
		res.push({
			params: {id: doc.id},
		},)
	})
	return res
	// Returns an array that looks like this:
	// [
	//   {
	//     params: {
	//       id: 'ssg-ssr'
	//     }
	//   },
	//   {
	//     params: {
	//       id: 'pre-rendering'
	//     }
	//   }
	// ]
	// return fileNames.map((fileName) => {
	//   return {
	// 	params: {
	// 	  id: fileName.replace(/\.md$/, ''),
	// 	},
	//   };
	// });
  }