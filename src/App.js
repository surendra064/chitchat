import {Box,Button,Container,HStack,Input,VStack} from "@chakra-ui/react"
import Message from "./files/Message";
import {onAuthStateChanged,signOut,getAuth,GoogleAuthProvider,signInWithPopup} from "firebase/auth"
import {app} from "./firebase"
import { useEffect,useRef, useState } from "react";
import {getFirestore,addDoc, collection, serverTimestamp,onSnapshot,query,orderBy} from "firebase/firestore"

const auth=getAuth(app);
const db=getFirestore(app);
const loginhandler=()=>{
  const provider= new GoogleAuthProvider();
  signInWithPopup(auth,provider);
};
const logouthandler=()=>{
  signOut(auth);
};

function App() {
  const [user,setuser]=useState(false);
  // console.log(user);
  const [message,setmessage]=useState("");
  const [messages,setmessages]=useState([]);
  const divforscroll=useRef(null);

  const submithandler=async(e)=>{
    e.preventDefault();
    try {
      setmessage("");
      await addDoc(collection(db,"Messages"),{
        text:message,uid:user.uid,uri:user.photoURL,createdAt:serverTimestamp(),
      });
      
      divforscroll.current.scrollIntoView({behavior:"smooth"});
      
      
    } catch (error) {
      alert(error);
    }

  };
  useEffect(()=>{
    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onAuthStateChanged(auth,(data)=>{
      setuser(data);

    });
    const unsubscribeForMessage=onSnapshot(q,(snap)=>{
      setmessages(
        snap.docs.map((item)=>{
          const id=item.id;
          return {id, ...item.data()};

        })
      );

    });
    return ()=>{
      unsubscribe();
      unsubscribeForMessage();
    };
  },[]);
  return <Box bg={"pink"}>
    {
      user?(<Container bg={"white"} h={"100vh"}>
      <VStack h={"full"} paddingY={"4"}> 
        <Button colorScheme={"red"}w={"full"} onClick={logouthandler}> Logout</Button>
        <VStack  w={"full"}h={"full"} overflowY={"auto"} css={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}>
          {
            messages.map((item)=>(
            <Message key={item.id} text={item.text} uri={item.uri} user={item.uid===user.uid?"me":"other"} />))
          }
          <div ref={divforscroll}></div>
        </VStack>
        <form onSubmit={submithandler}style={{width:"100%"}}>
          <HStack>
          <Input value={message} onChange={(e)=>setmessage(e.target.value)} placeholder="Message.."/>
          <Button colorScheme="purple" type="submit">Send</Button>
          </HStack>
          
        </form>
      </VStack>

    </Container>):(<VStack h="100vh" justifyContent={"center"}>
      <Button onClick={loginhandler}> Sign In With Google</Button>

    </VStack>)
    }
  </Box>;
  
}

export default App;
