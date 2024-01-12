import {
   Button,
   Code,
   Container,
   Flex,
   Group,
   NumberInput,
   Title,
} from "@mantine/core";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const iframecode = `
<iframe src="https://email-ai-three.vercel.app/"
        style="border:0px #ffffff none;" name="myiFrame"
        scrolling="no" frameborder="1" marginheight="0px"
        marginwidth="0px" height="400px" width="600px"
        allowfullscreen
>
</iframe>
`;

export default function Dashboard() {
   const nav = useNavigate();

   const handleLogout = () => {
      localStorage.clear();
      nav("/login");
   };

   useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
         nav("/login");
      }
   }, []);

   return (
      <div className={"m-3 mx-10"}>
         <Button
            my={24}
            onClick={handleLogout}
         >
            Log out
         </Button>
         <Title my={48}>Everything will be added soon!</Title>
         <Flex
            my={48}
            direction={"row"}
            justify={"flex-start"}
            align={"end"}
            columnGap={16}
         >
            <NumberInput
               label={"Limits per user"}
               defaultValue={5}
            />
            <Button>Set</Button>
         </Flex>
         <Title
            mt={48}
            mb={24}
         >
            Code for Embedding
         </Title>
         <Code
            block
            w={500}
         >
            {iframecode}
         </Code>
         <Group></Group>
      </div>
   );
}
