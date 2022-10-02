import Layout from '../../components/layout'
import { getArticleContent, getAllArticleIds } from '../../lib/firebase'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'

export default function Post({ content }) {
  return (
    <Layout>
      <Head>
        <title>{content.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{content.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={content.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: content.markdown }} />
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = await getAllArticleIds()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const content = await getArticleContent(params.id)
  return {
    props: {
      content
    }
  }
}
