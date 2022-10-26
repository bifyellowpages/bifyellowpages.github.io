import React from "react";
import { useUser } from "../firebase/useUser";
import Loading from "../components/Loader";
import 'firebase/firestore'
import { useRouter } from 'next/router'; 
import { getAuth, signOut } from "firebase/auth";
import Link from 'next/link'


// var user_id = null;
const Closet = ({ userCloset }) => {
  const auth = getAuth();
  const { user } = useUser();
  const router = useRouter();
  if (user == null) {
    return (<div>You're not logged in my man</div>)
  }
  if (user == undefined) {
    return <Loading />
  }
  const handleClick = (e) => {
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
  };
  
  return (<div>Upload Modal bois <Link href="/">
  <a onClick={(e) => handleClick(e)}>
        <a>Sign out</a>
      </a>
</Link> </div> );
  /*
  return <Redirect to={{
    pathname: '/closet/[userId]',
    query: {
      userId: (user?.id ?? '')
    }
  }} />
  */
  // logUser().then(() => {
  // console.log("here?");
  // console.log(userCloset)
  // // })
  // return (
  //   <div>
  //     <div
  //       className={
  //         "bg-indigo-50 w-full h-72 flex items-center justify-between px-20"
  //       }
  //     >
  //       <h1 className={"text-5xl font-bold"}>My Closet</h1>
  //       <div>Icon of closet here</div>
  //     </div>
  //     <UploadModal />
  //     <ImageGrid images={[]} />
  //   </div>
  // );
};
// export async function getServerSideProps () {
//   const { user } = useUser();
//   // const user = {id: 1, email: "fdsa", name: "john"}
//   console.log("logging user")

//   return {
//     props: {
//       userCloset,
//     },
//   }
// }
export default Closet;