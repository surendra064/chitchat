import React from 'react'
import {HStack,Avatar,Text}from "@chakra-ui/react"

const  Message= ({text,uri,user="other"})=> {
  return (
    <HStack bg="green.400" paddingX={"4"} paddingY={"2"} alignSelf={user==="me"?"flex-end":"flex-start"} borderRadius={"base"}>
         {
            user==="other"&&<Avatar src={uri} />
        }
        <Text>
            {text}
        </Text>
       
        {
            user==="me"&&<Avatar src={uri} />
        }
    </HStack>
  )
}

export default Message