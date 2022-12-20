import Layout from '../../components/layout'
import { getArticleContent, getAllArticleIds } from '../../lib/firebase'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'

export default function Post({ content }) {
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
  const authorData = makeCommaSeparatedString(content.author, true);
  return (
    <Layout>
      <article>
        <h1 className = "text-4xl mb-1">{content.title}</h1>
        <div className="text-gray-500">
          <Date dateString={content.date} />
        </div>
        <div className="text-gray-500 mb-4">
          By {authorData}
        </div>
        
        <div dangerouslySetInnerHTML={{ __html: content.contentHtml }} />
      </article>
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
  return {
    props: {
      content
    }
  }
}
