import Layout from '../../components/layout'
import { getArticleContent, getAllArticleIds, getAdmins } from '../../lib/firebase'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'
import { getApp } from "firebase/app"
import { doc, getFirestore, collection, getDocs, getDoc, updateDoc } from "firebase/firestore"
import { getDownloadURL, getStorage, getStream, ref, getBytes, uploadBytes } from "firebase/storage";
import matter from 'gray-matter';
import { remark } from 'remark';
import { useRouter } from 'next/router'; 
import { getAuth, signOut } from "firebase/auth";
import { useUser } from "../../firebase/useUser";
import { useReducer, useState } from 'react'
import html from 'remark-html';
import Link from 'next/link'
import { parseISO, format } from 'date-fns'

//reinstating, not in lib/firebase cause fs being stinky
const app = getApp()
const db = getFirestore(app)
const storage = getStorage(app)

export default function Post({ content, admins }) {
//then  get the textfield changes from here
const auth = getAuth();
const { user } = useUser();
const router = useRouter();
  const articleId = router.query.id
  if (user == null) {
    return (<div>You're not logged in my man</div>)
  }
  if (user == undefined) {
    return <Loading />
  }
  // console.log(admins);
  const inc = Array.from(admins).includes(user.id);
  const handleClick = (e) => {
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
  };
  if (!inc) {
    return (<div>Sry you're not authorized.<Link legacyBehavior href="/">
    <a onClick={(e) => handleClick(e)}>
          Sign out
        </a>
  </Link> </div> )
  }









  const makeCommaSeparatedString = (arr, useOxfordComma) => {
    const listStart = arr.slice(0, -1).join(', ')
    const listEnd = arr.slice(-1)
    const conjunction = arr.length <= 1 
      ? '' 
      : useOxfordComma && arr.length > 2 
        ? ', and ' 
        : ' and '
  
    return [listStart, listEnd].join(conjunction)
  }


  const [formData, setFormData] = useState(content.markdown);
  const [htmlData, setHtmlData] = useState(content.contentHtml);
  const [titleData, setTitleData] = useState(content.title);
  const [dateData, setDateData] = useState(content.date);
  const [errorData, setErrorData] = useState("");
  const [authorData, setAuthorData] = useState(makeCommaSeparatedString(content.author, true));
  // console.log(content)
  // const handleTextChange = event => {
  //   // 👇️ access textarea value
  //   setFormData(event.target.value);
  // };
  async function update() {
    setFormData(document.getElementById('updateText').value);
    var matterResult = null;
    try {
    matterResult = matter(document.getElementById('updateText').value);
    }
    catch (e) {
      setErrorData("Something's wrong with the way you formatted the title or author or date");
      return;
    }
	// Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    setTitleData(matterResult.data.title);
    try {
      const dats = parseISO(matterResult.data.date)
      format(dats, 'LLLL d, yyyy');
      setDateData(matterResult.data.date);
    }
    catch (e) {
      setErrorData("Something's wrong with the way you formatted the title or author or date");
      // console.log(e)
    }
    setAuthorData(makeCommaSeparatedString(matterResult.data.author, true))
    const contentHtml = processedContent.toString();
    setHtmlData(contentHtml);
    setErrorData("");
    // console.log(event.target.value);
  }




  async function upload() {
    // uploadMarkdown(formData, articleId);
    console.log(articleId);
    const article = await getDoc(doc(db, "articles", articleId.toString()));
    const cont = article.data();
    const markdownRef = ref(storage, cont.path);

    const matterResult = matter(formData);


    await updateDoc(doc(db, "articles", articleId), {
      date: matterResult.data.date,
      author: matterResult.data.author,
      title: matterResult.data.title
      });
    var file = new Blob([formData], { type: "text/plain" });
    const uploadTask = uploadBytes(markdownRef, file);
  }




  return (
    <Layout>
      {/* <Head>
        <title>{titleData}</title>
      </Head> */}
      <article>
        <h1 className = "text-4xl mb-1">{titleData}</h1>
        <div className="text-gray-500">
          <Date dateString={dateData} />
        </div>
        <div className="text-gray-500 mb-4">
          By {authorData}
        </div>
        
        <div dangerouslySetInnerHTML={{ __html: htmlData }} />
      </article>
      <textarea type="text" id="updateText" value={formData} onChange = {async () => await update()}/> 
      {errorData}
      <div><i>If you wanna reset all your changes to the original version cause you really messed up, just reload the page</i></div>
      <div onClick={async () => await upload()}>If you wanna submit your changes and update the article, click this - <button>Submit</button></div>
    </Layout>
  )
}

export async function getStaticPaths() {
  console.log("getting paths...")
  const paths = await getAllArticleIds()
  console.log(paths)
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const content = await getArticleContent(params.id)
  console.log(content)
  const admins = await getAdmins();
  const ret = admins.admins;
  return {
    props: {
      content,
      admins: ret
    }
  }
}
